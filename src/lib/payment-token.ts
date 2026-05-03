/**
 * Signed payment session token.
 *
 * After the source site (e.g. auraaccessoriessolutions.fun) initiates an
 * order, Aurtos returns a payment URL containing a signed token.  The token
 * carries the data needed to render the Paytm form and to fire the result
 * webhook back to the source site, without us needing a database.
 *
 * Token format (URL-safe base64):
 *   <base64url(payloadJson)>.<base64url(hmacSha256)>
 *
 * Uses PAYMENT_INTEGRATION_SECRET for HMAC.
 */
import crypto from 'node:crypto';

export interface PaymentTokenPayload {
  /** Aurtos / Paytm order id (echoed to Paytm) */
  orderId: string;
  /** Amount as Paytm wants it (e.g. "499.00") */
  amount: string;
  /** "INR" */
  currency: string;
  /** From Paytm initiateTransaction response */
  txnToken: string;
  /** Source site identifier (free string, eg "auraaccessories") */
  siteId: string;
  /** Where Aurtos should POST the result webhook (server-to-server) */
  webhookUrl: string;
  /** Where Aurtos should redirect the customer after completion */
  returnUrl: string;
  /** Optional source-site internal order id for reconciliation */
  externalOrderId?: string;
  /** Unix ms expiry */
  exp: number;
}

function base64url(buf: Buffer): string {
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function fromBase64url(s: string): Buffer {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64');
}

function getSecret(): string {
  const secret = process.env.PAYMENT_INTEGRATION_SECRET;
  if (!secret) throw new Error('PAYMENT_INTEGRATION_SECRET env var not set');
  return secret;
}

export function signPaymentToken(payload: PaymentTokenPayload): string {
  const secret = getSecret();
  const body = base64url(Buffer.from(JSON.stringify(payload), 'utf8'));
  const sig = crypto.createHmac('sha256', secret).update(body).digest();
  return `${body}.${base64url(sig)}`;
}

export function verifyPaymentToken(token: string): PaymentTokenPayload | null {
  if (!token || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  let secret: string;
  try { secret = getSecret(); } catch { return null; }
  const expected = base64url(crypto.createHmac('sha256', secret).update(body).digest());
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  let parsed: PaymentTokenPayload;
  try {
    parsed = JSON.parse(fromBase64url(body).toString('utf8')) as PaymentTokenPayload;
  } catch {
    return null;
  }
  if (typeof parsed.exp !== 'number' || Date.now() > parsed.exp) return null;
  return parsed;
}

/** HMAC sign an arbitrary JSON body (used for webhook back to source site). */
export function hmacSignBody(body: string, secret = getSecret()): string {
  return crypto.createHmac('sha256', secret).update(body).digest('hex');
}

/** Verify HMAC signature on an incoming JSON request body (e.g. /api/payment/initiate). */
export function verifyHmacSignature(body: string, signatureHex: string, secret = getSecret()): boolean {
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  if (signatureHex.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(signatureHex), Buffer.from(expected));
}
