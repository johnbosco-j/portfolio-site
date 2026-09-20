import { LINKS } from "@/content/profile";

/** Resolves symbolic link keys used in content ("jovora", "github", "resume"…) to URLs. */
export function resolveHref(href: string): { href?: string; external: boolean } {
  if (href.startsWith("#") || href.startsWith("/")) return { href, external: false };
  if (href === "jovora") return { href: LINKS.jovora, external: true };
  if (href === "clareo") return { href: LINKS.clareo, external: true };
  if (href === "github") return { href: LINKS.github, external: true };
  if (href === "linkedin") return { href: LINKS.linkedin, external: true };
  if (href === "resume") return { href: LINKS.resume, external: false };
  return { href, external: /^https?:\/\//.test(href) };
}

/** On the home page "#work" works; on /work/* pages the same link needs "/#work". */
export const homeHref = (hash: `#${string}`, onHome: boolean) => (onHome ? hash : `/${hash}`);
