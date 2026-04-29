import { NextResponse } from 'next/server';
import { isAuthorizedCron, unauthorized } from '@/lib/cron-auth';
import { site } from '@/data/site';
import { services } from '@/data/services';
import { blogPosts } from '@/data/blog';
import { portfolio } from '@/data/portfolio';

export const runtime = 'nodejs';
export const maxDuration = 60;

const ENDPOINT = 'https://api.indexnow.org/IndexNow';

function allUrls(): string[] {
  const base = site.url.replace(/\/$/, '');
  const urls = new Set<string>([
    `${base}/`,
    `${base}/about`,
    `${base}/services`,
    `${base}/portfolio`,
    `${base}/blog`,
    `${base}/contact`,
  ]);
  for (const s of services) urls.add(`${base}/services/${s.slug}`);
  for (const p of blogPosts) urls.add(`${base}/blog/${p.slug}`);
  for (const p of portfolio) urls.add(`${base}/portfolio/${p.slug}`);
  return [...urls];
}

export async function GET(req: Request) {
  if (!isAuthorizedCron(req)) return unauthorized();

  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    return NextResponse.json({ ok: false, reason: 'INDEXNOW_KEY not set' });
  }

  const host = new URL(site.url).host;
  const body = {
    host,
    key,
    keyLocation: `${site.url}/${key}.txt`,
    urlList: allUrls(),
  };

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      submitted: body.urlList.length,
      response: text.slice(0, 300),
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
