/**
 * Google auth helper. Two modes, in priority order:
 *
 * 1. Keyless via Vercel OIDC + Workload Identity Federation (recommended).
 *    Required env:
 *      - VERCEL_OIDC_TOKEN              (auto-injected by Vercel)
 *      - GCP_WORKLOAD_IDENTITY_AUDIENCE  (full audience string from GCP console)
 *      - GOOGLE_SERVICE_ACCOUNT_EMAIL    (the SA we're impersonating)
 *
 * 2. Service account JSON key (fallback for local dev).
 *    Required env: GOOGLE_SERVICE_ACCOUNT_KEY (full JSON as one-liner)
 *
 * If neither is configured, returns null and callers should gracefully no-op.
 *
 * GCP setup checklist (one-time):
 *   - Create Workload Identity Pool (e.g. `vercel-pool`)
 *   - Add OIDC provider with issuer `https://oidc.vercel.com/<team-slug>`
 *   - Set attribute mapping: google.subject = assertion.sub
 *   - Grant Workload Identity User role on the SA to principalSet for the pool
 *   - Copy the audience URL → set as GCP_WORKLOAD_IDENTITY_AUDIENCE
 */
import { google } from 'googleapis';
import {
  ExternalAccountClient,
  type AuthClient,
  JWT,
} from 'google-auth-library';

let cachedClient: AuthClient | null = null;
let cachedScopesKey: string | null = null;

export function getGoogleAuthClient(scopes: string[]): AuthClient | null {
  const scopesKey = scopes.slice().sort().join(',');
  if (cachedClient && cachedScopesKey === scopesKey) return cachedClient;

  // ---- Mode 1: Keyless via Vercel OIDC + Workload Identity Federation ----
  // Accept both env-var names for backwards compatibility.
  const audience =
    process.env.GCP_WORKLOAD_IDENTITY_AUDIENCE ||
    process.env.GOOGLE_WORKLOAD_IDENTITY_AUDIENCE;
  const saEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const oidcToken = process.env.VERCEL_OIDC_TOKEN;

  if (audience && saEmail) {
    try {
      const client = ExternalAccountClient.fromJSON({
        type: 'external_account',
        audience,
        subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
        token_url: 'https://sts.googleapis.com/v1/token',
        service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${saEmail}:generateAccessToken`,
        subject_token_supplier: {
          getSubjectToken: async () => {
            const t = process.env.VERCEL_OIDC_TOKEN || oidcToken;
            if (!t) {
              throw new Error(
                '[google-auth] VERCEL_OIDC_TOKEN missing — keyless auth needs Vercel runtime',
              );
            }
            return t;
          },
        },
      });
      if (!client) {
        console.error('[google-auth] ExternalAccountClient.fromJSON returned null');
        return null;
      }
      client.scopes = scopes;
      cachedClient = client as unknown as AuthClient;
      cachedScopesKey = scopesKey;
      return cachedClient;
    } catch (err) {
      console.error('[google-auth] WIF setup failed', err);
      // fall through to JWT fallback
    }
  }

  // ---- Mode 2: Service account JSON key fallback ----
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (raw && raw.trim() !== '') {
    let parsed: { client_email: string; private_key: string };
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error('[google-auth] invalid GOOGLE_SERVICE_ACCOUNT_KEY JSON', err);
      return null;
    }
    cachedClient = new google.auth.JWT({
      email: parsed.client_email,
      key: parsed.private_key.replace(/\\n/g, '\n'),
      scopes,
    }) as unknown as AuthClient;
    cachedScopesKey = scopesKey;
    return cachedClient;
  }

  return null;
}

// Re-export for type consumers.
export type { JWT };
