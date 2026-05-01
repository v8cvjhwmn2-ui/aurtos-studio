/**
 * Generates a complete MDX blog post using the Anthropic Claude API.
 * Called by the auto-blog cron — runs entirely server-side.
 */
import Anthropic from '@anthropic-ai/sdk';
import type { BlogTopic } from '@/data/blog-topics';

const SITE_URL = 'https://aurtostechnologies.in';

/** Returns today's date as YYYY-MM-DD (UTC) */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Generates 3–5 FAQs from the topic's keywords */
function buildFaqHint(topic: BlogTopic): string {
  return `Generate 4 FAQPage-schema-ready FAQs. Each question should be a real search query containing one of these keywords: ${topic.keywords.join(', ')}.`;
}

const SYSTEM_PROMPT = `You are an expert content strategist and SEO writer for Aurtos Studio, a full-service digital agency based in Noida, India (website: ${SITE_URL}).

Your writing voice:
- Direct, practical, and data-backed
- Indian market context with real examples (mention Indian cities, businesses, rupee amounts)
- Never vague or padded — every paragraph earns its place
- Natural internal links to Aurtos service pages where genuinely relevant
- No AI buzzwords like "game-changing", "delve", "leverage" (the verb), "utilize", "in conclusion"

Internal linking opportunities (use sparingly, only when contextually natural):
- /services/seo — SEO services
- /services/digital-marketing — digital marketing
- /services/website-development — website development
- /services/app-development — app development
- /services/branding — branding services
- /services/automation — automation and AI
- /services/technical-cloud — cloud and technical services
- /contact — for CTAs

You must output ONLY a complete, valid MDX file — nothing before the opening --- and nothing after the last sentence. No explanation, no commentary.

MDX components you may use:
<Callout type="info">text</Callout>
<Callout type="tip">text</Callout>
<Callout type="warn">text</Callout>
<Callout type="success">text</Callout>`;

function buildUserPrompt(topic: BlogTopic, date: string): string {
  return `Write a complete MDX blog post for Aurtos Studio with the following spec:

**Title:** ${topic.title}
**Category:** ${topic.category}
**Tags:** ${topic.tags.join(', ')}
**Target keywords:** ${topic.keywords.join(', ')}
**Date:** ${date}
**Canonical URL:** ${SITE_URL}/blog/${topic.slug}

**Content outline (expand each bullet to 150–250 words, maintain logical flow):**
${topic.outline.map((o, i) => `${i + 1}. ${o}`).join('\n')}

**Requirements:**
- Total length: 1,600–2,200 words (body text, excluding frontmatter)
- Include a compelling intro paragraph that hooks the reader with a problem or surprising stat
- Use ## for H2 sections, ### for H3 sub-sections
- Include at least one <Callout> component where genuinely useful
- End with a conclusion paragraph + CTA linking to /contact
- ${buildFaqHint(topic)}

**Frontmatter template** (fill in accurately — description must be 150–160 chars):
---
title: "..."
description: "..."
date: "${date}"
author: "Aurtos Studio"
category: "${topic.category}"
tags: [${topic.tags.map((t) => `"${t}"`).join(', ')}]
keywords: [${topic.keywords.map((k) => `"${k}"`).join(', ')}]
cover: "/blog/${topic.slug}/cover.jpg"
canonical: "${SITE_URL}/blog/${topic.slug}"
draft: false
faqs:
  - question: "..."
    answer: "..."
  - question: "..."
    answer: "..."
  - question: "..."
    answer: "..."
  - question: "..."
    answer: "..."
---

Output the complete MDX file now.`;
}

export async function generateBlogPost(topic: BlogTopic): Promise<string> {
  const date = today();

  // Initialise lazily so env vars are always resolved at call-time (not module load)
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: buildUserPrompt(topic, date),
      },
    ],
  });

  const block = message.content[0];
  if (block.type !== 'text') {
    throw new Error(`Unexpected content block type: ${block.type}`);
  }

  const raw = block.text.trim();

  // Ensure the output starts with frontmatter
  if (!raw.startsWith('---')) {
    throw new Error('Generated content does not start with MDX frontmatter. Retrying not implemented.');
  }

  return raw;
}
