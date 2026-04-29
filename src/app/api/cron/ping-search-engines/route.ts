import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { isAuthorizedCron, unauthorized } from '@/lib/cron-auth';
import { getGoogleAuthClient } from '@/lib/google-auth';
import { site } from '@/data/site';
import { blogPosts } from '@/data/blog';
import { services } from '@/data/services';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Submits recent URLs to the Google Indexing API.
 * Officially supported only for JobPosting + BroadcastEvent — but works as
 * a soft signal for other content too. No-op if service account key is missing.
 */
export async function GET(req: Request) {
  if (!isAuthorizedCron(req)) return unauthorized();

  const auth = getGoogleAuthClient(['https://www.googleapis.com/auth/indexing']);
  if (!auth) {
    return NextResponse.json({
      ok: false,
      reason: 'GOOGLE_SERVICE_ACCOUNT_KEY not set — paste full JSON key in env',
    });
  }

  const indexing = google.indexing({ version: 'v3', auth: auth as any });
  const base = site.url.replace(/\/$/, '');

  // Pick the most recent blog posts + service pages to ping.
  const urls = [
    ...services.map((s) => `${base}/services/${s.slug}`),
    ...[...blogPosts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map((p) => `${base}/blog/${p.slug}`),
  ];

  const results = await Promise.allSettled(
    urls.map((url) =>
      indexing.urlNotifications.publish({
        requestBody: { url, type: 'URL_UPDATED' },
      }),
    ),
  );

  return NextResponse.json({
    ok: true,
    submitted: urls.length,
    succeeded: results.filter((r) => r.status === 'fulfilled').length,
    failed: results.filter((r) => r.status === 'rejected').length,
  });
}
