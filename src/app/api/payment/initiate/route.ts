/**
 * POST /api/payment/initiate
 *
 * Called by the source site (e.g. auraaccessoriessolutions.fun) to start
 * a Paytm payment hosted on aurtostechnologies.in.
 *
 * Request body (JSON):
 *   {
 *     "siteId":           "auraaccessories",
 *     "externalOrderId":  "WC-12345",       // source-site order id
 *     "amount":           "499.00",
 *     "currency":         "INR",
 *     "customerId":       "CUST_001",
 *     "customerEmail":    "user@example.com",  // optional
 *     "customerMobile":   "9876543210",        // optional
 *     "webhookUrl":       "https://auraaccessoriessolutions.fun/?wc-api=aurtos_paytm_webhook",
 *     "returnUrl":        "https://auraaccessoriessolutions.fun/order-received/12345",
 *     "timestamp":        1700000000
 *   }
 *
 * Headers:
 *   x-aurtos-signature: <hex HMAC-SHA256 of raw body using PAYMENT_INTEGRATION_SECRET>
 *
 * Response:
 *   { ok: true, paymentUrl: "https://aurtostechnologies.in/payment/<orderId>?t=<token>" }
 */

import { NextResponse } from 'next/server';
import { initiateTransaction } from '@/lib/paytm';
import { signPaymentToken, verifyHmacSignature, type PaymentTokenPayload } from '@/lib/payment-token';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { z } from 'zod';

export const runtime = 'nodejs';

const schema = z.object({
  siteId: z.string().min(1).max(40),
  externalOrderId: z.string().min(1).max(80),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'amount must be like "499.00"'),
  currency: z.string().default('INR'),
  customerId: z.string().min(1).max(80),
  customerEmail: z.string().email().optional(),
  customerMobile: z.string().regex(/^\d{10,15}$/).optional(),
  webhookUrl: z.string().url(),
  returnUrl: z.string().url(),
  timestamp: z.number().int().positive(),
});

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://aurtostechnologies.in').replace(/\/$/, '');
const TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes

export async function POST(req: Request) {
  // Rate limit: 30 req/hour per IP (source-site server IP)
  const ip = clientIp(req);
  const rl = rateLimit(`payment-init:${ip}`, { limit: 30, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  // Read raw body so we can verify the HMAC of exactly what was signed
  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const sig = req.headers.get('x-aurtos-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
  }

  try {
    if (!verifyHmacSignature(raw, sig)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Signature verification failed' },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Body is not valid JSON' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Reject signed requests older than 5 min (replay protection)
  const ageMs = Date.now() - data.timestamp * 1000;
  if (ageMs > 5 * 60 * 1000 || ageMs < -60 * 1000) {
    return NextResponse.json({ error: 'Stale or future request' }, { status: 401 });
  }

  // Build a unique Paytm orderId. We prefix the source siteId so two source
  // sites can't collide. Paytm requires alphanumeric/hyphen/underscore.
  const safeExt = data.externalOrderId.replace(/[^A-Za-z0-9_-]/g, '');
  const paytmOrderId = `${data.siteId}-${safeExt}-${Date.now().toString(36)}`.slice(0, 50);

  // Aurtos's own callback URL — Paytm posts to this after payment
  const paytmCallbackUrl = `${SITE_URL}/api/payment/callback`;

  // Call Paytm to obtain the txnToken
  const result = await initiateTransaction({
    orderId: paytmOrderId,
    amount: data.amount,
    currency: data.currency,
    customerId: data.customerId,
    customerEmail: data.customerEmail,
    customerMobile: data.customerMobile,
    callbackUrl: paytmCallbackUrl,
  });

  if (!result.ok || !result.txnToken) {
    return NextResponse.json(
      { error: 'Paytm initiateTransaction failed', resultMsg: result.resultMsg, resultCode: result.resultCode },
      { status: 502 },
    );
  }

  // Sign a session token and return the redirect URL
  const tokenPayload: PaymentTokenPayload = {
    orderId: paytmOrderId,
    amount: data.amount,
    currency: data.currency,
    txnToken: result.txnToken,
    siteId: data.siteId,
    webhookUrl: data.webhookUrl,
    returnUrl: data.returnUrl,
    externalOrderId: data.externalOrderId,
    exp: Date.now() + TOKEN_TTL_MS,
  };

  const token = signPaymentToken(tokenPayload);
  const paymentUrl = `${SITE_URL}/payment/${encodeURIComponent(paytmOrderId)}?t=${encodeURIComponent(token)}`;

  return NextResponse.json({
    ok: true,
    orderId: paytmOrderId,
    paymentUrl,
    expiresAt: tokenPayload.exp,
  });
}
