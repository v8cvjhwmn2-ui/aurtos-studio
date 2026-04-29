import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { isAuthorizedCron, unauthorized } from '@/lib/cron-auth';
import { getGoogleAuthClient } from '@/lib/google-auth';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Pulls last 28 days of search analytics from GSC and surfaces low-CTR
 * opportunities (rank < 10, CTR < average). Returns a JSON summary that
 * can be emailed by the weekly health report cron.
 */
export async function GET(req: Request) {
  if (!isAuthorizedCron(req)) return unauthorized();

  const site = process.env.GOOGLE_SEARCH_CONSOLE_SITE;
  if (!site) {
    return NextResponse.json({ ok: false, reason: 'GOOGLE_SEARCH_CONSOLE_SITE not set' });
  }

  const auth = getGoogleAuthClient(['https://www.googleapis.com/auth/webmasters.readonly']);
  if (!auth) {
    return NextResponse.json({
      ok: false,
      reason: 'GOOGLE_SERVICE_ACCOUNT_KEY not set — paste JSON key in env',
    });
  }

  const sc = google.searchconsole({
  version: 'v1',
  auth: auth as any,
});
  const today = new Date();
  const past = new Date(today);
  past.setDate(past.getDate() - 28);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const res = await sc.searchanalytics.query({
    siteUrl: site,
    requestBody: {
      startDate: fmt(past),
      endDate: fmt(today),
      dimensions: ['query', 'page'],
      rowLimit: 250,
    },
  });

  const rows = res.data.rows || [];
  const avgCtr = rows.length
    ? rows.reduce((s, r) => s + (r.ctr || 0), 0) / rows.length
    : 0;

  const opportunities = rows
    .filter((r) => (r.position || 99) < 10 && (r.ctr || 0) < avgCtr * 0.5)
    .slice(0, 25)
    .map((r) => ({
      query: r.keys?.[0],
      page: r.keys?.[1],
      position: r.position,
      ctr: r.ctr,
      impressions: r.impressions,
      clicks: r.clicks,
    }));

  return NextResponse.json({
    ok: true,
    range: { from: fmt(past), to: fmt(today) },
    totalRows: rows.length,
    avgCtr,
    opportunities,
  });
}
