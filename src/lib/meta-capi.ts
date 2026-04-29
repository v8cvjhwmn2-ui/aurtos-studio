import { createHash } from 'node:crypto';

const GRAPH_API = 'https://graph.facebook.com/v20.0';

export type CapiEvent = {
  eventName: 'Lead' | 'Contact' | 'CompleteRegistration' | 'PageView';
  eventId?: string;
  eventSourceUrl?: string;
  email?: string;
  phone?: string;
  ip?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  value?: number;
  currency?: string;
};

function sha256(s: string) {
  return createHash('sha256').update(s.trim().toLowerCase()).digest('hex');
}

function normalizePhone(p: string) {
  return p.replace(/[^\d]/g, '');
}

export async function sendCapiEvent(evt: CapiEvent) {
  const pixelId = process.env.META_CAPI_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !token) {
    console.warn('[meta-capi] missing env — skipping event');
    return { ok: false, reason: 'unconfigured' as const };
  }

  const userData: Record<string, string> = {};
  if (evt.email) userData.em = sha256(evt.email);
  if (evt.phone) userData.ph = sha256(normalizePhone(evt.phone));
  if (evt.ip) userData.client_ip_address = evt.ip;
  if (evt.userAgent) userData.client_user_agent = evt.userAgent;
  if (evt.fbp) userData.fbp = evt.fbp;
  if (evt.fbc) userData.fbc = evt.fbc;

  const payload = {
    data: [
      {
        event_name: evt.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: evt.eventId,
        event_source_url: evt.eventSourceUrl,
        action_source: 'website' as const,
        user_data: userData,
        custom_data: {
          ...(evt.value !== undefined && { value: evt.value }),
          ...(evt.currency && { currency: evt.currency }),
        },
      },
    ],
  };

  try {
    const res = await fetch(`${GRAPH_API}/${pixelId}/events?access_token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('[meta-capi] non-2xx', res.status, text);
      return { ok: false, reason: 'api-error' as const };
    }
    return { ok: true };
  } catch (err) {
    console.error('[meta-capi] network error', err);
    return { ok: false, reason: 'network' as const };
  }
}
