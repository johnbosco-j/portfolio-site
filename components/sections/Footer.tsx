import Link from "next/link";
import { Mark } from "@/components/brand/Mark";
import { ExternalMark } from "@/components/ui/Button";
import { site } from "@/content/profile";
import { resolveHref } from "@/lib/links";
import { hasResume } from "@/lib/resume";

export function Footer() {
  const f = site.footer;
  return (
    <footer className="fade-divider relative overflow-hidden bg-bg-2/60 pb-8 pt-20">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
          <div>
            <Link href="/#top" className="inline-flex min-h-11 items-center gap-3 rounded-full" aria-label="Johnbosco — back to top">
              <Mark size={40} />
              <span className="text-[22px] font-semibold tracking-[-0.02em]">Johnbosco</span>
            </Link>
            <p className="mt-4 max-w-[34ch] text-muted">{f.tagline}</p>
          </div>
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-1 sm:grid-cols-3">
              {f.links.map((l) => {
                const { href, external } = resolveHref(l.href);
                if (!href || (l.href === "resume" && !hasResume())) return null;
                return (
                  <li key={l.label}>
                    <a
                      href={href}
                      className="group inline-flex min-h-11 items-center gap-1 text-[15px] text-muted transition-colors hover:text-ink"
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {l.label}
                      {external && <ExternalMark />}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        <div className="fade-divider mt-14 flex flex-col justify-between gap-2 pt-6 font-mono text-[12px] text-faint sm:flex-row">
          <p>{f.legal}</p>
          <p>Chennai, India</p>
        </div>
      </div>
      <p aria-hidden="true" className="watermark pointer-events-none mt-8 select-none whitespace-nowrap text-center font-sans text-[21vw] font-semibold leading-[0.8] tracking-[-0.05em]">
        {f.watermark}
        <span className="font-serif font-normal italic tracking-[-0.02em]">.</span>
      </p>
    </footer>
  );
}
