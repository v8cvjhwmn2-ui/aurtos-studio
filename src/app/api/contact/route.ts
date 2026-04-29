import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { verifyTurnstile } from '@/lib/turnstile';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import {
  leadAdminEmail,
  leadAutoReplyEmail,
} from '@/lib/email-templates';
import { sendCapiEvent } from '@/lib/meta-capi';

export const runtime = 'nodejs';

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(150),
  phone: z.string().min(10).max(20),
  company: z.string().max(120).optional(),
  service: z.string().min(1).max(60),
  budget: z.string().max(40).optional(),
  message: z.string().min(10).max(2000),
  turnstileToken: z.string().optional(),
  // Honeypot — must be empty
  website: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many submissions. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Honeypot triggered — silent success to fool bots.
  if (data.website && data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  // Turnstile
  const turnstile = await verifyTurnstile(
    data.turnstileToken || '',
    ip,
    req.headers.get('host'),
  );
  if (!turnstile.success) {
    return NextResponse.json(
      { error: 'Anti-spam check failed. Please try again.' },
      { status: 403 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'hello@aurtostechnologies.in';
  const toEmail = process.env.RESEND_TO_EMAIL || 'info@aurtostechnologies.in';

  // Send emails (admin + auto-reply) in parallel.
  const errors: string[] = [];
  if (apiKey) {
    const resend = new Resend(apiKey);
    const lead = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      service: data.service,
      budget: data.budget,
      message: data.message,
    };
    const [adminRes, replyRes] = await Promise.allSettled([
      resend.emails.send({
        from: `Aurtos Leads <${fromEmail}>`,
        to: [toEmail],
        replyTo: data.email,
        subject: `New lead — ${data.name} (${data.service})`,
        html: leadAdminEmail(lead),
      }),
      resend.emails.send({
        from: `Aurtos Studio <${fromEmail}>`,
        to: [data.email],
        subject: `We got your message, ${data.name.split(' ')[0]} — Aurtos Studio`,
        html: leadAutoReplyEmail(lead),
      }),
    ]);
    if (adminRes.status === 'rejected') {
      errors.push('admin-email-failed');
      console.error('[contact] admin email failed', adminRes.reason);
    }
    if (replyRes.status === 'rejected') {
      errors.push('auto-reply-failed');
      console.error('[contact] auto-reply failed', replyRes.reason);
    }
  } else {
    console.warn('[contact] RESEND_API_KEY not set — skipping email');
  }

  // CRM webhook (Make.com / Zapier)
  if (process.env.CRM_WEBHOOK_URL) {
    try {
      await fetch(process.env.CRM_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'aurtos-website-contact',
          submittedAt: new Date().toISOString(),
          ip,
          ...data,
          turnstileToken: undefined,
          website: undefined,
        }),
      });
    } catch (err) {
      errors.push('crm-webhook-failed');
      console.error('[contact] CRM webhook failed', err);
    }
  }

  // Server-side conversion (Meta CAPI) — fire-and-forget, don't fail the request.
  void sendCapiEvent({
    eventName: 'Lead',
    eventId: `contact-${Date.now()}-${data.email}`,
    eventSourceUrl: req.headers.get('referer') || undefined,
    email: data.email,
    phone: data.phone,
    ip,
    userAgent: req.headers.get('user-agent') || undefined,
  }).catch((err) => console.error('[contact] capi event failed', err));

  // Don't block user on background failures — admin email is the source of truth.
  if (errors.includes('admin-email-failed')) {
    return NextResponse.json(
      { error: 'Could not deliver your message right now. Please WhatsApp us.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, warnings: errors });
}
