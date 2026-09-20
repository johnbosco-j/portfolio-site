import { LINKS, site } from "@/content/profile";

/** The big red "open to work" block, poster style, between Work and Journey. */
export function OpenToWork({ hasResume }: { hasResume: boolean }) {
  const o = site.open;
  return (
    <section aria-labelledby="open-title" className="container-x py-14 md:py-20">
      <div className="relative border-2 border-ember bg-ember-fill px-6 py-12 text-center shadow-brut-lg md:px-10 md:py-16" data-reveal="tile">
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(45deg,transparent_0_10px,rgb(0_0_0/0.35)_10px_12px)]" />
        <p id="open-title" className="display relative text-[clamp(56px,12vw,140px)] text-white">
          {o.title}
        </p>
        <p className="relative mt-2 font-mono text-[12px] uppercase tracking-[0.18em] text-white/90 md:text-[13px]">{o.subtitle}</p>
        <p className="relative mx-auto mt-4 max-w-[46ch] text-[16px] text-white/85">{o.body}</p>
        <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#contact"
            className="inline-flex h-11 items-center gap-2 rounded-input border-2 border-white bg-white px-5 font-mono text-[12px] uppercase tracking-[0.12em] text-[#8d1418] shadow-[5px_5px_0_0_rgb(0_0_0/0.35)] transition-transform duration-1 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            {o.cta}
          </a>
          {hasResume && (
            <a
              href={LINKS.resume}
              className="inline-flex h-11 items-center gap-2 rounded-input border-2 border-white/80 px-5 font-mono text-[12px] uppercase tracking-[0.12em] text-white transition-colors hover:bg-white/10"
            >
              {o.secondary}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
