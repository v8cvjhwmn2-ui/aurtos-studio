/**
 * One-shot logo setup. After dropping:
 *   - public/icons/aurtos-mark.png   (the A icon, square)
 *   - public/logos/aurtos-studio.png (the full lockup)
 *
 * Run: npx tsx scripts/setup-logos.ts
 *
 * Copies the A-mark to all the file-convention paths Next.js auto-detects:
 *   - src/app/icon.png       (browser favicon)
 *   - src/app/apple-icon.png (iOS home screen)
 *
 * No imagemagick / sharp needed — Next.js auto-resizes from the source.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SOURCE_MARK = path.join(ROOT, 'public/icons/aurtos-mark.png');
const SOURCE_LOGO = path.join(ROOT, 'public/logos/aurtos-studio.png');

const TARGETS = [
  path.join(ROOT, 'src/app/icon.png'),
  path.join(ROOT, 'src/app/apple-icon.png'),
];

if (!fs.existsSync(SOURCE_MARK)) {
  console.error(`❌ Missing: ${path.relative(ROOT, SOURCE_MARK)}`);
  console.error('   Drop the A-icon there, then re-run.');
  process.exit(1);
}
if (!fs.existsSync(SOURCE_LOGO)) {
  console.warn(`⚠️  Missing: ${path.relative(ROOT, SOURCE_LOGO)} (Header + Footer will show broken image until added)`);
}

for (const t of TARGETS) {
  fs.copyFileSync(SOURCE_MARK, t);
  console.log(`✅ ${path.relative(ROOT, t)}`);
}

// Also try to remove the stale Next default favicon.ico so the new icon.png wins.
const staleFavicon = path.join(ROOT, 'src/app/favicon.ico');
if (fs.existsSync(staleFavicon)) {
  fs.unlinkSync(staleFavicon);
  console.log(`🗑  Removed default src/app/favicon.ico (Next will use icon.png now)`);
}

console.log('\n✨ Logos wired. Restart dev server / hard-refresh browser to see.');
