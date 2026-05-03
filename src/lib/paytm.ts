/**
 * Paytm Payment Gateway helpers.
 *
 * Implements the v1 native flow:
 *   1. initiateTransaction() — POST to Paytm to obtain a txnToken.
 *   2. generateChecksum() / verifyChecksum() — AES-128-CBC over SHA-256
 *      hash with the standard Paytm IV "@@@@&&&&####$$$$".
 *
 * Required env vars:
 *   PAYTM_MID            — merchant ID
 *   PAYTM_MERCHANT_KEY   — 16-char merchant key (encryption key)
 *   PAYTM_WEBSITE_NAME   — e.g. "WEBSTAGING" (staging) or "DEFAULT" (prod)
 *   PAYTM_ENV            — "staging" | "production"
 */
import crypto from 'node:crypto';

const PAYTM_IV = '@@@@&&&&####$$$$';

const PAYTM_HOSTS = {
  staging: 'https://securestage.paytmpayments.com',
  production: 'https://secure.paytmpayments.com',
} as const;

export function paytmHost(): string {
  const env = process.env.PAYTM_ENV === 'production' ? 'production' : 'staging';
  return PAYTM_HOSTS[env];
}

function randomSalt(len = 4): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function aesEncrypt(plain: string, key: string): string {
  const cipher = crypto.createCipheriv('aes-128-cbc', key, PAYTM_IV);
  return cipher.update(plain, 'utf8', 'base64') + cipher.final('base64');
}

function aesDecrypt(ciphertext: string, key: string): string {
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, PAYTM_IV);
  return decipher.update(ciphertext, 'base64', 'utf8') + decipher.final('utf8');
}

/** Generate Paytm checksum / signature for a JSON body or param string. */
export function generateChecksum(payload: string, merchantKey?: string): string {
  const key = merchantKey || process.env.PAYTM_MERCHANT_KEY;
  if (!key) throw new Error('PAYTM_MERCHANT_KEY env var not set');
  const salt = randomSalt();
  const hash = crypto.createHash('sha256').update(payload + '|' + salt).digest('hex');
  return aesEncrypt(hash + salt, key);
}

/** Verify checksum returned by Paytm in callback. */
export function verifyChecksum(payload: string, checksum: string, merchantKey?: string): boolean {
  const key = merchantKey || process.env.PAYTM_MERCHANT_KEY;
  if (!key) throw new Error('PAYTM_MERCHANT_KEY env var not set');
  try {
    const decrypted = aesDecrypt(checksum, key);
    if (decrypted.length < 4) return false;
    const salt = decrypted.slice(-4);
    const expectedHash = decrypted.slice(0, -4);
    const actualHash = crypto.createHash('sha256').update(payload + '|' + salt).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(expectedHash), Buffer.from(actualHash));
  } catch {
    return false;
  }
}

/** Generate checksum specifically for the JSON body of v1 APIs. */
export function generateBodyChecksum(body: object): string {
  return generateChecksum(JSON.stringify(body));
}

/** Verify checksum from a callback POST (sorted-key concat with `|`). */
export function verifyParamsChecksum(params: Record<string, string>, checksum: string): boolean {
  // Paytm sorts param keys alphabetically and joins values with '|'
  const sorted = Object.keys(params)
    .filter((k) => k !== 'CHECKSUMHASH')
    .sort()
    .map((k) => params[k] ?? '')
    .join('|');
  return verifyChecksum(sorted, checksum);
}

export interface InitiateTransactionInput {
  orderId: string;
  amount: string;            // "499.00"
  currency?: string;         // "INR"
  customerId: string;
  customerEmail?: string;
  customerMobile?: string;
  callbackUrl: string;       // Paytm will POST result here
}

export interface InitiateTransactionResult {
  ok: boolean;
  txnToken?: string;
  resultCode?: string;
  resultMsg?: string;
  raw?: unknown;
}

/** Call Paytm's initiateTransaction API and return the transaction token. */
export async function initiateTransaction(input: InitiateTransactionInput): Promise<InitiateTransactionResult> {
  const mid = process.env.PAYTM_MID;
  const websiteName = process.env.PAYTM_WEBSITE_NAME || 'WEBSTAGING';
  if (!mid) return { ok: false, resultMsg: 'PAYTM_MID not set' };

  const body = {
    requestType: 'Payment',
    mid,
    websiteName,
    orderId: input.orderId,
    callbackUrl: input.callbackUrl,
    txnAmount: {
      value: input.amount,
      currency: input.currency || 'INR',
    },
    userInfo: {
      custId: input.customerId,
      ...(input.customerEmail ? { email: input.customerEmail } : {}),
      ...(input.customerMobile ? { mobile: input.customerMobile } : {}),
    },
  };

  const signature = generateBodyChecksum(body);
  const url = `${paytmHost()}/theia/api/v1/initiateTransaction?mid=${mid}&orderId=${encodeURIComponent(input.orderId)}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body, head: { signature } }),
    });
    const json = await res.json() as {
      body?: { txnToken?: string; resultInfo?: { resultCode?: string; resultMsg?: string; resultStatus?: string } };
    };
    const ri = json?.body?.resultInfo;
    const txnToken = json?.body?.txnToken;
    if (txnToken && ri?.resultStatus === 'S') {
      return { ok: true, txnToken, resultCode: ri.resultCode, resultMsg: ri.resultMsg, raw: json };
    }
    return {
      ok: false,
      resultCode: ri?.resultCode,
      resultMsg: ri?.resultMsg || 'Paytm initiateTransaction failed',
      raw: json,
    };
  } catch (err) {
    return { ok: false, resultMsg: err instanceof Error ? err.message : String(err) };
  }
}

/** URL of the Paytm-hosted payment page that the form must POST to. */
export function paytmShowPaymentPageUrl(orderId: string): string {
  const mid = process.env.PAYTM_MID;
  return `${paytmHost()}/theia/api/v1/showPaymentPage?mid=${mid}&orderId=${encodeURIComponent(orderId)}`;
}
