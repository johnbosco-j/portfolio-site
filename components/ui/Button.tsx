import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "signal" | "ghost";

const base =
  "group inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-input px-5 font-mono text-[12px] uppercase tracking-[0.12em] whitespace-nowrap border-2 transition-[background-color,border-color,color,transform,box-shadow] duration-1 ease-out active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";

const variants: Record<Variant, string> = {
  // Ember fill — one per viewport (design_port.md §2.3)
  primary: "border-ember bg-ember-fill text-white shadow-brut hover:bg-[#E5383B]",
  secondary: "border-line-strong bg-panel text-ink shadow-brut hover:border-ember hover:text-ember",
  // Lime fill — only for "View live" on shipped products
  signal: "bg-signal-fill text-signal-ink hover:shadow-[0_8px_32px_-10px_rgb(255_107_107/0.5)]",
  ghost: "border-transparent px-2 text-muted hover:text-ink",
};

type Props = {
  href?: string;
  variant?: Variant;
  external?: boolean;
  download?: boolean;
  /** Label shown when `href` is missing (placeholder). The button renders disabled. */
  comingSoonLabel?: string;
  className?: string;
  children: ReactNode;
};

export function Button({ href, variant = "primary", external, download, comingSoonLabel, className = "", children }: Props) {
  if (!href) {
    return (
      <span aria-disabled="true" className={`${base} cursor-not-allowed border-dashed border-line-strong text-faint ${className}`}>
        {comingSoonLabel ?? children}
      </span>
    );
  }
  return (
    <a
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(download ? { download: "" } : {})}
    >
      {children}
      {external && <ExternalMark />}
    </a>
  );
}

/** Visible ↗ plus a screen-reader note for links that open a new tab. */
export function ExternalMark() {
  return (
    <>
      <span aria-hidden="true" className="inline-block transition-transform duration-1 group-hover:-translate-y-px group-hover:translate-x-px">
        ↗
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </>
  );
}

/** Inline text link; external ones open in a new tab with a visible ↗. */
export function TextLink({ href, external, className = "", children }: { href: string; external?: boolean; className?: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className={`group inline-flex min-h-11 items-center gap-1 text-ink underline decoration-line-strong underline-offset-[6px] transition-colors duration-1 hover:decoration-ember ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {external && <ExternalMark />}
    </a>
  );
}
