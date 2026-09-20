import Image from "next/image";
import { Coffee, Heart } from "lucide-react";
import { SectionHeader } from "@/components/ui/AccentHeading";
import { ExternalMark } from "@/components/ui/Button";
import { InstrumentPanel } from "@/components/ui/InstrumentPanel";
import { support } from "@/content/support";
import { publicFileExists } from "@/lib/assets";

/** "Buy me a chai": UPI tiers (deep links open the payment app on phones) + other platforms. */
export function Support() {
  const s = support;
  const methods = s.methods.filter((m) => m.href);
  const hasQr = publicFileExists(s.qr.src);
  const live = methods.length > 0;
  return (
    <section id="support" aria-labelledby="support-title" className="fade-divider section-y relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-10 -z-10 size-[520px] rounded-full bg-[radial-gradient(closest-side,rgb(229_56_59/0.12),transparent)]" />
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeader heading={s.heading} intro={s.intro} id="support-title" word={s.word} />
        </div>
        <div className="lg:col-span-7" data-reveal="tile">
          <InstrumentPanel title="Support · buy me a chai" status={live ? "Open" : "Soon"} live={live} bodyClassName="p-6 md:p-8">
            <ul className="grid gap-3 sm:grid-cols-3">
              {s.tiers.map((t, i) => {
                const href = s.upiLink(t.amount);
                const inner = (
                  <>
                    <span className="flex items-center justify-between">
                      <Coffee size={18} strokeWidth={1.5} className="text-ember" aria-hidden="true" />
                      <span className="font-mono text-[12px] text-faint">{String(i + 1).padStart(2, "0")}</span>
                    </span>
                    <span className="mt-6 block font-mono text-[32px] font-medium leading-none tracking-[-0.03em] text-ink">₹{t.amount}</span>
                    <span className="mt-2 block font-serif text-[20px] italic text-ink-2">{t.label}</span>
                    <span className="mt-1 block text-[13px] text-muted">{t.note}</span>
                  </>
                );
                return (
                  <li key={t.amount}>
                    {href ? (
                      <a href={href} className="block h-full rounded-panel border border-line bg-panel-2 p-5 transition-[border-color,transform] duration-2 hover:-translate-y-1 hover:border-ember">
                        {inner}
                        <span className="sr-only"> — pay ₹{t.amount} by UPI</span>
                      </a>
                    ) : (
                      <div className="h-full rounded-panel border border-dashed border-line-strong bg-panel-2/50 p-5 opacity-70">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 grid gap-6 border-t border-line pt-6 sm:grid-cols-[1fr_auto]">
              <div>
                <p className="micro">Other ways · any amount</p>
                {live ? (
                  <ul className="mt-3 divide-y divide-line">
                    {methods.map((m) => (
                      <li key={m.id}>
                        <a
                          href={m.href}
                          className="group flex min-h-12 items-center justify-between gap-4 py-2 text-[15px] transition-colors hover:text-ember"
                          {...(m.id === "upi" ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                        >
                          <span>{m.label}</span>
                          <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.04em] text-faint group-hover:text-ember">
                            {m.note}
                            {m.id !== "upi" && <ExternalMark />}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 flex items-center gap-2 text-[15px] text-muted">
                    <Heart size={16} strokeWidth={1.5} className="text-ember" aria-hidden="true" />
                    {s.soon}
                  </p>
                )}
                {s.upiId && <p className="mt-4 font-mono text-[12px] text-faint">UPI ID · <span className="select-all text-ink-2">{s.upiId}</span></p>}
              </div>
              {hasQr && (
                <figure className="hidden flex-col items-center gap-2 sm:flex">
                  <Image src={s.qr.src} alt={s.qr.alt} width={132} height={132} className="rounded-lg border border-line bg-white p-1.5" />
                  <figcaption className="font-mono text-[10px] uppercase tracking-[0.06em] text-faint">Scan to pay</figcaption>
                </figure>
              )}
            </div>
          </InstrumentPanel>
        </div>
      </div>
    </section>
  );
}
