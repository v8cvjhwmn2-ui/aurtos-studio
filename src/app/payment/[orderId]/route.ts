/**
 * GET /payment/[orderId]?t=<signed-token>
 *
 * Returns an auto-submitting HTML form that POSTs to Paytm's
 * showPaymentPage URL, AND sets a signed cookie so /api/payment/callback
 * can recover the source-site webhook + return URLs.
 *
 * Implemented as a Route Handler (not a Page) because Server Components
 * cannot set cookies in Next.js — Route Handlers can.
 */
import { NextResponse } from 'next/server';
import { paytmShowPaymentPageUrl } from '@/lib/paytm';
import { verifyPaymentToken } from '@/lib/payment-token';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'aurtos_paytm_ctx';
const COOKIE_TTL_S = 30 * 60; // 30 min, matches token TTL

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function errorPage(title: string, body: string): NextResponse {
  const html = `<!doctype html><html><head><meta charset="utf-8"/><title>${escapeHtml(title)}</title><meta name="robots" content="noindex,nofollow"/></head>
<body style="font-family:system-ui,sans-serif;background:#fafafa;margin:0;">
  <main style="max-width:520px;margin:80px auto;padding:24px;text-align:center;">
    <h1 style="font-size:22px;margin:0 0 12px">${escapeHtml(title)}</h1>
    <p style="color:#666;font-size:14px;">${escapeHtml(body)}</p>
  </main>
</body></html>`;
  return new NextResponse(html, {
    status: 400,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const url = new URL(req.url);
  const t = url.searchParams.get('t');

  const tokenPayload = t ? verifyPaymentToken(t) : null;
  if (!tokenPayload) return errorPage('Payment session expired', 'Please return to your store and start the order again.');
  if (tokenPayload.orderId !== orderId) return errorPage('Order mismatch', 'The payment link does not match this order.');

  const mid = process.env.PAYTM_MID;
  if (!mid) return errorPage('Payment unavailable', 'Server is not configured for payments yet.');

  const action = paytmShowPaymentPageUrl(orderId);

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Redirecting to Paytm…</title>
    <meta name="robots" content="noindex,nofollow"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
  </head>
  <body style="margin:0;font-family:system-ui,-apple-system,sans-serif;background:#fafafa;">
    <main style="max-width:520px;margin:80px auto;padding:24px;text-align:center;">
      <div style="font-size:28px;margin-bottom:16px;">🔒</div>
      <h1 style="font-size:22px;margin:0 0 12px;">Redirecting to secure payment…</h1>
      <p style="color:#666;font-size:14px;margin-bottom:24px;">Please do not refresh or close this page.</p>
      <p style="color:#999;font-size:12px;">Order: <code>${escapeHtml(orderId)}</code> · Amount: ₹${escapeHtml(tokenPayload.amount)}</p>
      <form id="paytm-form" method="post" action="${escapeHtml(action)}" novalidate>
        <input type="hidden" name="mid" value="${escapeHtml(mid)}"/>
        <input type="hidden" name="orderId" value="${escapeHtml(orderId)}"/>
        <input type="hidden" name="txnToken" value="${escapeHtml(tokenPayload.txnToken)}"/>
        <noscript>
          <button type="submit" style="margin-top:24px;padding:12px 24px;font-size:14px;background:#00BAF2;color:#fff;border:none;border-radius:6px;cursor:pointer;">Continue to Paytm</button>
          <p style="margin-top:12px;font-size:12px;color:#666;">JavaScript is disabled. Click the button to continue.</p>
        </noscript>
      </form>
      <script>document.getElementById('paytm-form').submit();</script>
    </main>
  </body>
</html>`;

  const res = new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });

  // Stash the original signed token in a cookie so /api/payment/callback can
  // recover the source-site webhook + return URLs.
  res.cookies.set(COOKIE_NAME, t!, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',          // Paytm POSTs back from a different origin
    path: '/',
    maxAge: COOKIE_TTL_S,
  });

  return res;
}
