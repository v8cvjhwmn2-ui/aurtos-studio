/**
 * Generate SEO meta (title, description, keywords) for a piece of content
 * using the Claude API. Pipe content via stdin or pass --file.
 *
 * Usage:
 *   tsx scripts/generate-meta.ts --file content/blog/my-post.md
 *   cat draft.md | tsx scripts/generate-meta.ts
 *
 * Output: prints YAML frontmatter to stdout you can paste into a post.
 */
import fs from 'node:fs';
import path from 'node:path';

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('❌ ANTHROPIC_API_KEY not set');
    process.exit(1);
  }

  // --- Resolve input ---
  const args = process.argv.slice(2);
  const fileArgIdx = args.indexOf('--file');
  let body = '';
  if (fileArgIdx >= 0 && args[fileArgIdx + 1]) {
    const file = path.resolve(args[fileArgIdx + 1]);
    body = fs.readFileSync(file, 'utf8');
  } else if (!process.stdin.isTTY) {
    body = await new Promise<string>((res) => {
      let s = '';
      process.stdin.on('data', (c: Buffer) => (s += c.toString()));
      process.stdin.on('end', () => res(s));
    });
  } else {
    console.error('Usage: tsx scripts/generate-meta.ts --file <path>  OR  pipe content via stdin');
    process.exit(1);
  }

  // Lazy import (deps may not exist in CI without --skip-install)
  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const client = new Anthropic({ apiKey });

  const sys = `You are an SEO copywriter for Aurtos Studio (full-stack digital agency in India). Generate concise, click-worthy meta tags. Indian English. Honest, no clickbait.`;

  const prompt = `Given the article content below, output STRICT YAML frontmatter with these fields:

  title: 50-60 chars, primary keyword first, click-worthy
  description: 150-160 chars, ends with a soft CTA
  keywords: array of 5-8 relevant search terms (mix of head + long-tail, India-focused where natural)
  category: one of [SEO, Digital Marketing, Web Dev, App Dev, AI Tools, Case Studies]
  tags: 3-6 lowercase tags

Output ONLY the YAML block, starting with --- and ending with ---. No commentary.

CONTENT:
${body.slice(0, 12_000)}`;

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 800,
    system: sys,
    messages: [{ role: 'user', content: prompt }],
  });

  const out = msg.content
    .filter((b: { type: string }) => b.type === 'text')
    .map((b: { type: string; text?: string }) => b.text || '')
    .join('\n')
    .trim();

  process.stdout.write(out + '\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
