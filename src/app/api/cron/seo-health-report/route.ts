import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { isAuthorizedCron, unauthorized } from '@/lib/cron-auth';
import { site } from '@/data/site';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Weekly SEO health report. Pulls from rank-tracker + web-vitals-check
 * crons internally and emails a summary via Resend.
 */
async function fetchInternal(path: string, secret: string, baseUrl: string) {
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    if (!res.ok) return { ok: false, status: res.status };
    return await res.json();
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function GET(req: Request) {
  if (!isAuthorizedCron(req)) return unauthorized();

  const secret = process.env.CRON_SECRET || '';
  const reportTo = process.env.RESEND_TO_EMAIL || 'info@aurtostechnologies.in';
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'hello@aurtostechnologies.in';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Run sub-reports in parallel (best-effort).
  const [ranks, vitals, gsc] = await Promise.all([
    fetchInternal('/api/cron/keyword-rank-tracker', secret, baseUrl),
    fetchInternal('/api/cron/web-vitals-check', secret, baseUrl),
    fetchInternal('/api/cron/gsc-sync', secret, baseUrl),
  ]);

  const html = `<!doctype html>
<html><body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#f5f5f7;margin:0;padding:24px;color:#111">
  <div style="max-width:680px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden">
    <div style="padding:24px;background:linear-gradient(135deg,#6366F1,#F472B6);color:#fff">
      <p style="margin:0;font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.85">Weekly SEO Report</p>
      <h1 style="margin:6px 0 0;font-size:22px">${site.name} · ${new Date().toDateString()}</h1>
    </div>
    <div style="padding:24px">
      <h2 style="font-size:16px;margin:0 0 8px">Keyword ranks</h2>
      <pre style="background:#fafafa;padding:12px;border-radius:8px;font-size:12px;overflow:auto;max-height:260px">${JSON.stringify(
        ranks,
        null,
        2,
      )}</pre>
      <h2 style="font-size:16px;margin:18px 0 8px">Core Web Vitals</h2>
      <pre style="background:#fafafa;padding:12px;border-radius:8px;font-size:12px;overflow:auto;max-height:260px">${JSON.stringify(
        vitals,
        null,
        2,
      )}</pre>
      <h2 style="font-size:16px;margin:18px 0 8px">Search Console — CTR opportunities</h2>
      <pre style="background:#fafafa;padding:12px;border-radius:8px;font-size:12px;overflow:auto;max-height:260px">${JSON.stringify(
        gsc,
        null,
        2,
      )}</pre>
    </div>
  </div>
</body></html>`;

  if (!apiKey) {
    return NextResponse.json({ ok: false, reason: 'RESEND_API_KEY not set', preview: { ranks, vitals, gsc } });
  }

  const resend = new Resend(apiKey);
  const sent = await resend.emails.send({
    from: `Aurtos SEO <${fromEmail}>`,
    to: [reportTo],
    subject: `Weekly SEO report — ${new Date().toLocaleDateString('en-IN')}`,
    html,
  });

  return NextResponse.json({ ok: !sent.error, emailId: sent.data?.id, ranks, vitals, gsc });
}
