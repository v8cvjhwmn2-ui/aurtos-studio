/**
 * POST /api/cron/auto-blog
 *
 * Runs daily (cron schedule defined in vercel.json).
 * Picks the next unwritten topic from the queue, generates a full MDX
 * blog post with Claude, commits it to GitHub (triggering a Vercel redeploy),
 * pings IndexNow with the new URL, and sends a Slack/email notification.
 *
 * Required env vars:
 *   ANTHROPIC_API_KEY   — Claude API
 *   GITHUB_TOKEN        — GitHub PAT with contents:write
 *   GITHUB_REPO         — e.g. "keshavpc/aurtos-studio"
 *   GITHUB_BRANCH       — defaults to "main"
 *   CRON_SECRET         — shared secret for cron auth
 *   INDEXNOW_KEY        — for IndexNow ping
 *   RESEND_API_KEY      — for notification email
 *   BLOG_NOTIFY_EMAIL   — where to send the notification (defaults to site email)
 */

import { NextResponse } from 'next/server';
import { isAuthorizedCron, unauthorized } from '@/lib/cron-auth';
import { blogTopics } from '@/data/blog-topics';
import { generateBlogPost } from '@/lib/blog-generator';
import { publishToGitHub, listGitHubDirectory } from '@/lib/github-publish';
import { site } from '@/data/site';
import fs from 'node:fs';
import path from 'node:path';
import { Resend } from 'resend';

export const runtime = 'nodejs';
export const maxDuration = 300; // Claude generation can take up to 60s; allow buffer

const SITE_URL = site.url.replace(/\/$/, '');
const BLOG_DIR = 'content/blog';

/** In local dev — check local filesystem. In prod — check GitHub. */
async function getExistingSlugs(): Promise<Set<string>> {
  const isDev = process.env.NODE_ENV !== 'production';
  const slugs = new Set<string>();

  if (isDev) {
    const localDir = path.join(process.cwd(), BLOG_DIR);
    if (fs.existsSync(localDir)) {
      fs.readdirSync(localDir)
        .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
        .filter((f) => !f.startsWith('_'))
        .forEach((f) => slugs.add(f.replace(/\.(mdx|md)$/, '')));
    }
  } else {
    const files = await listGitHubDirectory(BLOG_DIR);
    files
      .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
      .filter((f) => !f.startsWith('_'))
      .forEach((f) => slugs.add(f.replace(/\.(mdx|md)$/, '')));
  }

  return slugs;
}

/** Pings IndexNow with a single URL */
async function pingIndexNow(url: string): Promise<void> {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return;

  const host = new URL(SITE_URL).host;
  await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host,
      key,
      keyLocation: `${SITE_URL}/${key}.txt`,
      urlList: [url],
    }),
  }).catch((e) => console.warn('[auto-blog] IndexNow ping failed:', e));
}

/** Sends a notification email via Resend */
async function sendNotification(
  slug: string,
  title: string,
  commitUrl: string | undefined,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const to = process.env.BLOG_NOTIFY_EMAIL || site.email;
  const postUrl = `${SITE_URL}/blog/${slug}`;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: `Aurtos Auto-Blog <noreply@aurtostechnologies.in>`,
      to,
      subject: `📝 New blog post published: ${title}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#6366F1">New blog post published</h2>
          <p><strong>${title}</strong></p>
          <p>
            <a href="${postUrl}" style="color:#6366F1">View post →</a>
          </p>
          ${commitUrl ? `<p style="font-size:12px;color:#888">Commit: <a href="${commitUrl}">${commitUrl}</a></p>` : ''}
          <hr style="border:1px solid #eee;margin:20px 0"/>
          <p style="font-size:12px;color:#888">Sent by the Aurtos auto-blog pipeline.</p>
        </div>
      `,
    });
  } catch (e) {
    console.warn('[auto-blog] notification email failed:', e);
  }
}

/** In local dev — writes directly to the filesystem */
function writeLocally(slug: string, content: string): void {
  const filePath = path.join(process.cwd(), BLOG_DIR, `${slug}.mdx`);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[auto-blog] wrote locally: ${filePath}`);
}

export async function GET(req: Request) {
  if (!isAuthorizedCron(req)) return unauthorized();

  const isDev = process.env.NODE_ENV !== 'production';

  // 1. Determine which topics have already been written
  const existingSlugs = await getExistingSlugs();

  // 2. Find the next topic in the queue
  const nextTopic = blogTopics.find((t) => !existingSlugs.has(t.slug));

  if (!nextTopic) {
    return NextResponse.json({
      ok: true,
      message: 'All topics have been written. Add more topics to blog-topics.ts.',
      totalTopics: blogTopics.length,
    });
  }

  console.log(`[auto-blog] generating post for topic: ${nextTopic.slug}`);

  // 3. Generate MDX content with Claude
  let mdxContent: string;
  try {
    mdxContent = await generateBlogPost(nextTopic);
  } catch (err) {
    console.error('[auto-blog] generation failed:', err);
    return NextResponse.json(
      {
        ok: false,
        stage: 'generation',
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }

  const filePath = `${BLOG_DIR}/${nextTopic.slug}.mdx`;
  const commitMessage = `feat(blog): auto-publish "${nextTopic.title}"`;
  let commitUrl: string | undefined;

  // 4a. Dev: write to local filesystem
  if (isDev) {
    writeLocally(nextTopic.slug, mdxContent);
    console.log('[auto-blog] dev mode — skipping GitHub publish');
  } else {
    // 4b. Prod: commit to GitHub (triggers Vercel redeploy)
    const publishResult = await publishToGitHub(filePath, mdxContent, commitMessage);

    if (!publishResult.ok) {
      return NextResponse.json(
        {
          ok: false,
          stage: 'github-publish',
          error: publishResult.error,
          slug: nextTopic.slug,
        },
        { status: 500 },
      );
    }

    commitUrl = publishResult.commitUrl;
    console.log(`[auto-blog] committed to GitHub: ${commitUrl}`);

    // 4c. Trigger Vercel Deploy Hook to publish the new commit
    const deployHook = process.env.VERCEL_DEPLOY_HOOK_URL;
    if (deployHook) {
      try {
        const r = await fetch(deployHook, { method: 'POST' });
        console.log(`[auto-blog] deploy hook triggered: ${r.status}`);
      } catch (e) {
        console.warn('[auto-blog] deploy hook failed:', e);
      }
    } else {
      console.warn('[auto-blog] VERCEL_DEPLOY_HOOK_URL not set — relying on Git auto-deploy');
    }
  }

  // 5. Ping IndexNow with the new URL
  const postUrl = `${SITE_URL}/blog/${nextTopic.slug}`;
  if (!isDev) {
    await pingIndexNow(postUrl);
  }

  // 6. Send notification email
  await sendNotification(nextTopic.slug, nextTopic.title, commitUrl);

  const topicsRemaining = blogTopics.filter((t) => !existingSlugs.has(t.slug) && t.slug !== nextTopic.slug).length;

  return NextResponse.json({
    ok: true,
    published: {
      slug: nextTopic.slug,
      title: nextTopic.title,
      category: nextTopic.category,
      url: postUrl,
      commitUrl: commitUrl || 'local-dev',
    },
    topicsRemaining,
    totalTopics: blogTopics.length,
  });
}
