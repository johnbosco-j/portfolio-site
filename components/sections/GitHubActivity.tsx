import { getGitHub } from "@/lib/github";
import { ExternalMark } from "@/components/ui/Button";

/**
 * Live proof of work: the most recently pushed public repos (see lib/github.ts).
 * Renders nothing if GitHub can't be reached.
 */
const fmt = new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric", timeZone: "Asia/Kolkata" });

export async function GitHubActivity() {
  const data = await getGitHub();
  if (!data || data.repos.length === 0) return null;
  const repos = data.repos.slice(0, 5);
  return (
    <div className="tile p-6 md:p-7" data-reveal="tile">
      <div className="flex items-center justify-between gap-3">
        <p className="micro flex items-center gap-2 text-ink-2">
          <span className="pulse-dot size-1.5 rounded-full bg-signal" aria-hidden="true" />
          GitHub · recently pushed
        </p>
        <span className="font-mono text-[12px] text-faint">{data.total} public repos</span>
      </div>
      <ul className="mt-5 divide-y divide-line">
        {repos.map((r) => (
          <li key={r.name}>
            <a href={r.html_url} target="_blank" rel="noopener noreferrer" className="group flex min-h-12 items-center justify-between gap-4 py-2.5">
              <span className="truncate font-mono text-[14px] text-ink transition-colors group-hover:text-ember">
                <span className="text-faint">johnbosco-j/</span>
                {r.name}
              </span>
              <span className="flex flex-none items-center gap-3 font-mono text-[11px] uppercase tracking-[0.04em] text-faint">
                {r.language && <span className="hidden sm:inline">{r.language}</span>}
                <time dateTime={r.pushed_at}>{fmt.format(new Date(r.pushed_at))}</time>
                <ExternalMark />
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.06em] text-faint">Source · GitHub API, refreshed daily</p>
    </div>
  );
}
