/**
 * POST /api/payment/callback
 *
 * Paytm posts the transaction result here as application/x-www-form-urlencoded.
 * We:
 *   1. Read all params and the CHECKSUMHASH.
 *   2. Verify the checksum using PAYTM_MERCHANT_KEY.
 *   3. Look up the source-site context from a signed cookie/state. (We
 *      can't use a DB; instead we re-verify by hitting Paytm's status
 *      check API isn't strictly needed here — we trust the checksum.)
 *   4. POST the result to the source site's webhookUrl with HMAC.
 *   5. 303 redirect the customer to the source site's returnUrl with
 *      the public order id and final status appended.
 *
 * NOTE: The source site's webhookUrl/returnUrl came from the signed
 * payment token at /payment/[orderId]. To retain those across the
 * Paytm redirect we stash them in a signed cookie when the form was
 * served. See `setReturnContextCookie` below.
 */

import { NextResponse } from 'next/server';
import { verifyParamsChecksum } from '@/lib/paytm';
import { hmacSignBody, verifyPaymentToken } from '@/lib/payment-token';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const maxDuration = 30;

const COOKIE_NAME = 'aurtos_paytm_ctx';

interface SourceContext {
  webhookUrl: string;
  returnUrl: string;
  externalOrderId?: string;
  siteId: string;
}

async function readContextFromCookie(orderId: string): Promise<SourceContext | null> {
  const c = (await cookies()).get(COOKIE_NAME)?.value;
  if (!c) return null;
  // Cookie value is the original signed payment token.
  const payload = verifyPaymentToken(c);
  if (!payload || payload.orderId !== orderId) return null;
  return {
    webhookUrl: payload.webhookUrl,
    returnUrl: payload.returnUrl,
    externalOrderId: payload.externalOrderId,
    siteId: payload.siteId,
  };
}

async function fireWebhook(ctx: SourceContext, body: object): Promise<void> {
  const json = JSON.stringify(body);
  let signature: string;
  try {
    signature = hmacSignBody(json);
  } catch {
    console.error('[payment-callback] cannot sign webhook — PAYMENT_INTEGRATION_SECRET missing');
    return;
  }
  try {
    const res = await fetch(ctx.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-aurtos-signature': signature,
      },
      body: json,
    });
    console.log(`[payment-callback] webhook → ${ctx.webhookUrl} status=${res.status}`);
  } catch (err) {
    console.error('[payment-callback] webhook delivery failed:', err);
  }
}

function decodeForm(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of raw.split('&')) {
    if (!part) continue;
    const [k, v = ''] = part.split('=');
    out[decodeURIComponent(k.replace(/\+/g, ' '))] = decodeURIComponent(v.replace(/\+/g, ' '));
  }
  return out;
}

export async function POST(req: Request) {
  const raw = await req.text();
  const params = decodeForm(raw);
  const checksum = params.CHECKSUMHASH;
  const orderId = params.ORDERID;
  const status = params.STATUS;

  if (!orderId || !checksum) {
    return NextResponse.json({ error: 'Missing ORDERID or CHECKSUMHASH' }, { status: 400 });
  }

  if (!verifyParamsChecksum(params, checksum)) {
    console.error('[payment-callback] checksum verification failed for', orderId);
    return NextResponse.json({ error: 'Invalid checksum' }, { status: 400 });
  }

  const ctx = await readContextFromCookie(orderId);

  // Build the canonical webhook payload
  const webhookBody = {
    type: 'paytm.transaction',
    orderId,
    externalOrderId: ctx?.externalOrderId,
    siteId: ctx?.siteId,
    status,           // TXN_SUCCESS | TXN_FAILURE | PENDING
    amount: params.TXNAMOUNT,
    currency: params.CURRENCY,
    paytmTxnId: params.TXNID,
    bankTxnId: params.BANKTXNID,
    paymentMode: params.PAYMENTMODE,
    bankName: params.BANKNAME,
    gatewayName: params.GATEWAYNAME,
    respCode: params.RESPCODE,
    respMsg: params.RESPMSG,
    txnDate: params.TXNDATE,
    receivedAt: new Date().toISOString(),
  };

  // Fire-and-forget webhook to source site
  if (ctx?.webhookUrl) {
    void fireWebhook(ctx, webhookBody);
  } else {
    console.warn('[payment-callback] no source context cookie — webhook skipped for', orderId);
  }

  // Decide where to send the customer
  const returnUrl = ctx?.returnUrl;
  const fallback = `${(process.env.NEXT_PUBLIC_SITE_URL || 'https://aurtostechnologies.in').replace(/\/$/, '')}/thank-you?orderId=${encodeURIComponent(orderId)}&status=${encodeURIComponent(status || 'UNKNOWN')}`;

  let target = fallback;
  if (returnUrl) {
    try {
      const u = new URL(returnUrl);
      u.searchParams.set('orderId', orderId);
      if (ctx?.externalOrderId) u.searchParams.set('externalOrderId', ctx.externalOrderId);
      u.searchParams.set('status', status || 'UNKNOWN');
      target = u.toString();
    } catch {
      target = fallback;
    }
  }

  // Clear the context cookie and 303 redirect
  const res = NextResponse.redirect(target, 303);
  res.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
  return res;
}

/** GET handler in case Paytm hits the URL with GET (rare). Return a friendly message. */
export async function GET() {
  return NextResponse.json({ ok: true, message: 'POST only — payment callback endpoint' });
}
