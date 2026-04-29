/**
 * Cloudflare Turnstile server-side verification.
 * Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const DEV_BYPASS_TOKEN = 'dev-bypass-localhost';

function isLocalhostHost(host: string | null | undefined) {
  if (!host) return false;
  const h = host.toLowerCase().split(':')[0];
  return h === 'localhost' || h === '127.0.0.1' || h.endsWith('.local');
}

export async function verifyTurnstile(
  token: string,
  remoteIp?: string,
  requestHost?: string | null,
): Promise<{ success: boolean; errorCodes?: string[] }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const isDev = process.env.NODE_ENV !== 'production';

  // Dev bypass — only accept when running non-production OR request came from localhost.
  if (token === DEV_BYPASS_TOKEN && (isDev || isLocalhostHost(requestHost))) {
    return { success: true };
  }

  if (!secret) {
    console.warn('[turnstile] TURNSTILE_SECRET_KEY not set — skipping verification');
    return { success: true };
  }
  if (!token) return { success: false, errorCodes: ['missing-token'] };

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set('remoteip', remoteIp);

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const json = (await res.json()) as {
      success: boolean;
      'error-codes'?: string[];
    };
    return { success: json.success, errorCodes: json['error-codes'] };
  } catch (err) {
    console.error('[turnstile] verify failed', err);
    return { success: false, errorCodes: ['network-error'] };
  }
}
