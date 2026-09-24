import { LINKS } from "@/content/profile";

export type Repo = { name: string; html_url: string; language: string | null; pushed_at: string; fork: boolean };

const USER = LINKS.github.split("/").pop();
const headers = { Accept: "application/vnd.github+json", "User-Agent": "johnbosco-portfolio" };

/**
 * Public repos, most recently pushed first, plus the public repo count.
 * Fetched at build and refreshed daily (ISR). Returns null if GitHub can't be reached,
 * so every caller can simply render nothing.
 */
export async function getGitHub(): Promise<{ repos: Repo[]; total: number } | null> {
  try {
    const [reposRes, userRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USER}/repos?sort=pushed&per_page=12`, { headers, next: { revalidate: 86400 } }),
      fetch(`https://api.github.com/users/${USER}`, { headers, next: { revalidate: 86400 } }),
    ]);
    if (!reposRes.ok || !userRes.ok) return null;
    const repos = ((await reposRes.json()) as Repo[]).filter((r) => !r.fork);
    const { public_repos } = (await userRes.json()) as { public_repos: number };
    return { repos, total: public_repos };
  } catch {
    return null;
  }
}

/** The most recent public push (repo name + date), for the status bar. */
export async function getLatestPush(): Promise<{ name: string; url: string; pushedAt: string } | null> {
  const data = await getGitHub();
  const latest = data?.repos[0];
  return latest ? { name: latest.name, url: latest.html_url, pushedAt: latest.pushed_at } : null;
}
