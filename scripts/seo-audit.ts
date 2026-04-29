/**
 * Prebuild SEO audit. Blocks build on critical issues.
 * Run: tsx scripts/seo-audit.ts (or via "prebuild" script).
 *
 * Checks:
 *  - Every page.tsx exports `metadata` or has parent metadata.
 *  - At most one top-level <h1> per page.
 *  - <Image> / <img> tags include alt= attribute.
 *  - Required env keys flagged as warnings (not blockers).
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(process.cwd(), 'src/app');
const errors: string[] = [];
const warnings: string[] = [];

function walk(dir: string, files: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(tsx|ts)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function rel(p: string) {
  return path.relative(process.cwd(), p);
}

function checkPage(file: string) {
  const src = fs.readFileSync(file, 'utf8');
  const isPage = /\/page\.tsx$/.test(file);
  const isLayout = /\/layout\.tsx$/.test(file);

  if (isPage || isLayout) {
    // metadata: either exported, or generateMetadata, or parent layout will provide.
    const hasMetadata =
      /export\s+(const|let|var|async\s+function|function)\s+(metadata|generateMetadata)\b/.test(
        src,
      );
    if (isPage && !hasMetadata) {
      // Parent layout / route group may supply metadata; warn only.
      warnings.push(`${rel(file)} has no exported metadata or generateMetadata`);
    }
  }

  if (isPage) {
    const h1Matches = src.match(/<h1[\s>]/g) || [];
    if (h1Matches.length > 1) {
      errors.push(`${rel(file)} has ${h1Matches.length} <h1> tags (max 1)`);
    }
  }

  // Image alt check across all components
  const imgRegex = /<(?:img|Image)\b[^>]*?\/?>/g;
  let m: RegExpExecArray | null;
  while ((m = imgRegex.exec(src)) !== null) {
    const tag = m[0];
    if (!/\salt\s*=/.test(tag)) {
      const line = src.slice(0, m.index).split('\n').length;
      errors.push(`${rel(file)}:${line} image without alt= attribute`);
    }
  }
}

const files = walk(ROOT);
for (const f of files) checkPage(f);

// Env warnings
const envKeys = [
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_GTM_ID',
  'NEXT_PUBLIC_WHATSAPP_NUMBER',
  'CONTACT_EMAIL',
  'RESEND_API_KEY',
  'CRON_SECRET',
  'INDEXNOW_KEY',
];
const envFile = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envFile)) {
  const envContents = fs.readFileSync(envFile, 'utf8');
  for (const key of envKeys) {
    if (!new RegExp(`^${key}=`, 'm').test(envContents)) {
      warnings.push(`Missing env: ${key} (set in Vercel for production)`);
    }
  }
} else {
  warnings.push('.env.local not found — using defaults');
}

console.log('\n🔎 SEO audit\n');
if (warnings.length) {
  console.log('⚠️  Warnings:');
  warnings.forEach((w) => console.log(`   - ${w}`));
  console.log('');
}

if (errors.length) {
  console.error('❌ Errors:');
  errors.forEach((e) => console.error(`   - ${e}`));
  console.error('\nBuild blocked. Fix above and retry.\n');
  process.exit(1);
}

console.log(`✅ SEO audit passed (${files.length} files scanned)\n`);
