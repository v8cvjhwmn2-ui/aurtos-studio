import { NextResponse } from 'next/server';
import { isAuthorizedCron, unauthorized } from '@/lib/cron-auth';
import { site } from '@/data/site';

export const runtime = 'nodejs';
export const maxDuration = 60;

const SERPER_URL = 'https://google.serper.dev/search';

const KEYWORDS = [
  'digital marketing services India',
  'website development company India',
  'mobile app development India',
  'SEO services company India',
  'brand design agency India',
  'agency ad accounts Meta Google',
  'WhatsApp automation India',
  'aurtos studio',
  'aurtos technologies',
  'best digital agency Noida',
  'D2C marketing agency India',
  'meta ads agency India',
  'shopify development India',
  'AI automation agency India',
];

type SerperOrganic = { link?: string; position?: number };
type SerperResponse = { organic?: SerperOrganic[] };

async function rankFor(query: string) {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return { query, error: 'SERPER_API_KEY not set' };
  const host = new URL(site.url).host;
  try {
    const res = await fetch(SERPER_URL, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: query, gl: 'in', hl: 'en', num: 50 }),
    });
    if (!res.ok) return { query, error: `http-${res.status}` };
    const json = (await res.json()) as SerperResponse;
    const organic = json.organic || [];
    const hit = organic.find((r) => r.link && r.link.includes(host));
    return {
      query,
      rank: hit?.position ?? null,
      url: hit?.link ?? null,
    };
  } catch (err) {
    return { query, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function GET(req: Request) {
  if (!isAuthorizedCron(req)) return unauthorized();

  const results = await Promise.all(KEYWORDS.map(rankFor));
  const ranked = results.filter((r) => 'rank' in r && r.rank !== null);
  const top10 = ranked.filter((r) => 'rank' in r && (r.rank ?? 99) <= 10);

  return NextResponse.json({
    ok: true,
    runAt: new Date().toISOString(),
    totalTracked: KEYWORDS.length,
    ranked: ranked.length,
    top10: top10.length,
    results,
  });
}
