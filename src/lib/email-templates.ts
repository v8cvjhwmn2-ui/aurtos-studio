type Lead = {
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  budget?: string;
  message: string;
};

function escape(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function leadAdminEmail(lead: Lead) {
  const row = (label: string, value?: string) =>
    value
      ? `<tr><td style="padding:6px 12px;color:#666;font-size:13px;width:120px">${label}</td><td style="padding:6px 12px;font-size:14px;color:#111">${escape(value)}</td></tr>`
      : '';

  return `<!doctype html>
<html><body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#f5f5f7;margin:0;padding:24px">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06)">
    <div style="padding:20px 24px;background:linear-gradient(135deg,#6366F1,#F472B6);color:#fff">
      <p style="margin:0;font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.85">New Lead</p>
      <h1 style="margin:6px 0 0;font-size:22px;font-weight:700">${escape(lead.name)} just contacted you</h1>
    </div>
    <table style="width:100%;border-collapse:collapse">
      ${row('Name', lead.name)}
      ${row('Email', lead.email)}
      ${row('Phone', lead.phone)}
      ${row('Company', lead.company)}
      ${row('Service', lead.service)}
      ${row('Budget', lead.budget)}
    </table>
    <div style="padding:16px 24px;border-top:1px solid #eee">
      <p style="margin:0 0 6px;color:#666;font-size:13px">Message</p>
      <p style="margin:0;font-size:14px;color:#111;line-height:1.55;white-space:pre-wrap">${escape(lead.message)}</p>
    </div>
    <div style="padding:14px 24px;background:#fafafa;color:#888;font-size:12px;border-top:1px solid #eee">
      Reply within 2 hours · sent from aurtostechnologies.in
    </div>
  </div>
</body></html>`;
}

export function leadAutoReplyEmail(lead: Lead) {
  return `<!doctype html>
<html><body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#f5f5f7;margin:0;padding:24px">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06)">
    <div style="padding:24px;background:linear-gradient(135deg,#6366F1,#F472B6);color:#fff">
      <h1 style="margin:0;font-size:24px;font-weight:700">Hi ${escape(lead.name.split(' ')[0])}, we got your message 👋</h1>
    </div>
    <div style="padding:24px">
      <p style="margin:0 0 12px;font-size:15px;color:#111;line-height:1.6">
        Thanks for reaching out to <strong>Aurtos Studio</strong>. Our team is reviewing your enquiry and we'll be in touch within <strong>2 hours</strong> during business hours (9am–9pm IST).
      </p>
      <p style="margin:0 0 12px;font-size:15px;color:#111;line-height:1.6">
        In the meantime, feel free to ping us on WhatsApp for a faster response:
      </p>
      <p style="margin:18px 0">
        <a href="https://wa.me/916397845844" style="display:inline-block;padding:10px 18px;background:#25D366;color:#fff;font-weight:600;border-radius:999px;text-decoration:none;font-size:14px">Chat on WhatsApp</a>
      </p>
      <p style="margin:24px 0 0;font-size:13px;color:#666;line-height:1.5">
        — Team Aurtos<br/>
        Aurtos Technologies LLP · Noida, India
      </p>
    </div>
  </div>
</body></html>`;
}
