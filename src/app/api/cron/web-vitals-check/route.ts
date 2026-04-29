import { NextResponse } from 'next/server';
import { isAuthorizedCron, unauthorized } from '@/lib/cron-auth';
import { site } from '@/data/site';

export const runtime = 'nodejs';
export const maxDuration = 60;

const ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

const KEY_PAGES = [
  '/',
  '/about',
  '/services',
  '/services/digital-marketing',
  '/services/website-development',
  '/services/seo',
  '/blog',
  '/contact',
];

const THRESHOLDS = {
  performance: 0.85,
  lcp: 2500,
  cls: 0.1,
  inp: 200,
};

type Result = {
  url: string;
  perf: number | null;
  lcp: number | null;
  cls: number | null;
  inp: number | null;
  alerts: string[];
};

async function check(url: string): Promise<Result> {
  const apiKey = process.env.PAGESPEED_API_KEY;
  const params = new URLSearchParams({
    url,
    strategy: 'mobile',
    category: 'performance',
  });
  if (apiKey) params.set('key', apiKey);

  const res = await fetch(`${ENDPOINT}?${params}`);
  if (!res.ok) {
    return { url, perf: null, lcp: null, cls: null, inp: null, alerts: [`http-${res.status}`] };
  }
  type PsiResponse = {
    lighthouseResult?: {
      categories?: { performance?: { score?: number } };
      audits?: Record<string, { numericValue?: number }>;
    };
  };
  const json = (await res.json()) as PsiResponse;
  const lh = json.lighthouseResult;
  const perf = lh?.categories?.performance?.score ?? null;
  const lcp = lh?.audits?.['largest-contentful-paint']?.numericValue ?? null;
  const cls = lh?.audits?.['cumulative-layout-shift']?.numericValue ?? null;
  const inp = lh?.audits?.['interaction-to-next-paint']?.numericValue ?? null;

  const alerts: string[] = [];
  if (perf !== null && perf < THRESHOLDS.performance) alerts.push(`perf-low:${perf}`);
  if (lcp !== null && lcp > THRESHOLDS.lcp) alerts.push(`lcp-slow:${Math.round(lcp)}ms`);
  if (cls !== null && cls > THRESHOLDS.cls) alerts.push(`cls-high:${cls.toFixed(3)}`);
  if (inp !== null && inp > THRESHOLDS.inp) alerts.push(`inp-slow:${Math.round(inp)}ms`);
  return { url, perf, lcp, cls, inp, alerts };
}

export async function GET(req: Request) {
  if (!isAuthorizedCron(req)) return unauthorized();
  const base = site.url.replace(/\/$/, '');

  const results = await Promise.all(KEY_PAGES.map((p) => check(`${base}${p}`)));
  const flagged = results.filter((r) => r.alerts.length > 0);

  return NextResponse.json({
    ok: true,
    checked: results.length,
    flagged: flagged.length,
    results,
  });
}
