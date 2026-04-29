/**
 * Cron auth helper. Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`.
 */
export function isAuthorizedCron(req: Request): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    console.warn('[cron-auth] CRON_SECRET not set — allowing in dev');
    return process.env.NODE_ENV !== 'production';
  }
  const auth = req.headers.get('authorization');
  return auth === `Bearer ${expected}`;
}

export function unauthorized() {
  return new Response('Unauthorized', { status: 401 });
}
