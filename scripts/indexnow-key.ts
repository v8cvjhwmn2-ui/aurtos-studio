/**
 * Generates /public/{INDEXNOW_KEY}.txt verification file from env.
 * Run after setting INDEXNOW_KEY in .env.local or in CI:
 *   tsx scripts/indexnow-key.ts
 */
import fs from 'node:fs';
import path from 'node:path';

const envPath = path.join(process.cwd(), '.env.local');
let key = process.env.INDEXNOW_KEY || '';

if (!key && fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  const m = envFile.match(/^INDEXNOW_KEY=(.+)$/m);
  if (m) key = m[1].trim();
}

if (!key) {
  console.warn('⚠️  INDEXNOW_KEY not set — skipping verification file generation.');
  process.exit(0);
}

const dest = path.join(process.cwd(), 'public', `${key}.txt`);
fs.writeFileSync(dest, key, 'utf8');
console.log(`✅ Wrote IndexNow verification file: public/${key}.txt`);
