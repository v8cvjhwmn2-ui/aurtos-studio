/**
 * Publishes a file to the GitHub repository via the REST API.
 *
 * Why GitHub API and not direct filesystem write?
 * Vercel's deployment filesystem is read-only after build — writing to
 * content/blog/ inside a serverless function would not persist. Committing
 * through the GitHub API ensures the file lands in the repo, triggers a
 * Vercel redeploy, and the new blog post goes live within ~60 seconds.
 *
 * Required env vars:
 *   GITHUB_TOKEN   — personal access token with `repo` scope (or fine-grained
 *                    with contents:write on this repo)
 *   GITHUB_REPO    — e.g. "keshavpc/aurtos-studio"
 *   GITHUB_BRANCH  — defaults to "main"
 */

export interface PublishResult {
  ok: boolean;
  commitSha?: string;
  commitUrl?: string;
  error?: string;
}

function base64Encode(str: string): string {
  // Node.js Buffer — available in Vercel Node runtime
  return Buffer.from(str, 'utf8').toString('base64');
}

async function githubApiRequest(
  path: string,
  method: 'GET' | 'PUT',
  body?: unknown,
): Promise<Response> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN env var is not set');

  const url = `https://api.github.com/repos/${path}`;
  return fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      'User-Agent': 'aurtos-studio-auto-blog/1.0',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

/** Returns the SHA of an existing file, or null if it doesn't exist */
async function getFileSha(repo: string, filePath: string, branch: string): Promise<string | null> {
  const res = await githubApiRequest(
    `${repo}/contents/${filePath}?ref=${branch}`,
    'GET',
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub GET file error ${res.status}: ${text}`);
  }
  const data = (await res.json()) as { sha: string };
  return data.sha;
}

/**
 * Creates or updates a file in the GitHub repository.
 *
 * @param filePath  Path relative to repo root, e.g. "content/blog/my-post.mdx"
 * @param content   UTF-8 string content of the file
 * @param message   Git commit message
 */
export async function publishToGitHub(
  filePath: string,
  content: string,
  message: string,
): Promise<PublishResult> {
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!repo) {
    return { ok: false, error: 'GITHUB_REPO env var is not set' };
  }

  try {
    // Check if file already exists (required for updates — need existing SHA)
    const existingSha = await getFileSha(repo, filePath, branch);

    const body: Record<string, unknown> = {
      message,
      content: base64Encode(content),
      branch,
    };
    if (existingSha) {
      body.sha = existingSha;
    }

    const res = await githubApiRequest(`${repo}/contents/${filePath}`, 'PUT', body);

    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `GitHub PUT error ${res.status}: ${text}` };
    }

    const data = (await res.json()) as {
      commit?: { sha: string; html_url: string };
    };

    return {
      ok: true,
      commitSha: data.commit?.sha,
      commitUrl: data.commit?.html_url,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Lists all files in a GitHub directory.
 * Used to determine which blog slugs already exist in the repo.
 */
export async function listGitHubDirectory(dirPath: string): Promise<string[]> {
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!repo || !process.env.GITHUB_TOKEN) return [];

  try {
    const res = await githubApiRequest(
      `${repo}/contents/${dirPath}?ref=${branch}`,
      'GET',
    );
    if (!res.ok) return [];
    const items = (await res.json()) as Array<{ name: string; type: string }>;
    return items
      .filter((i) => i.type === 'file')
      .map((i) => i.name);
  } catch {
    return [];
  }
}
