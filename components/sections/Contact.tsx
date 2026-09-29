"use client";

import { Mail } from "lucide-react";
import { useState } from "react";
import { SectionHeader } from "@/components/ui/AccentHeading";
import { ExternalMark } from "@/components/ui/Button";
import { InstrumentPanel } from "@/components/ui/InstrumentPanel";
import { LINKS, site } from "@/content/profile";
import { ContactForm } from "./ContactForm";
import { RivCameo } from "./RivCameo";

export function Contact() {
  const c = site.contact;
  const [waves, setWaves] = useState(0);
  const links = [
    { label: "GitHub", href: LINKS.github, handle: "johnbosco-j" },
    ...(LINKS.linkedin ? [{ label: "LinkedIn", href: LINKS.linkedin, handle: "Profile" }] : []),
    { label: "Riven", href: LINKS.rivendevs, handle: LINKS.rivendevs.replace(/^https?:\/\//, "") },
  ];
  return (
    <section id="contact" aria-labelledby="contact-title" className="fade-divider section-y relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/3 -z-10 size-[70vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(229_56_59/0.12),transparent)] opacity-[var(--glow-strength)]" />
      <div className="container-x">
        <SectionHeader heading={c.heading} intro={c.intro} id="contact-title" word={c.word} />
        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7" data-reveal="tile">
            <InstrumentPanel title={c.panelTitle} status="Online">
              <ContactForm topics={c.topics} success={c.success} onSent={() => setWaves((w) => w + 1)} />
            </InstrumentPanel>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div data-reveal="tile" style={{ ["--i" as string]: 1 }}>
              <RivCameo waves={waves} />
            </div>
            <div data-reveal="tile" style={{ ["--i" as string]: 2 }} className="tile p-6">
              <p className="micro">{c.emailLabel}</p>
              <a href={`mailto:${LINKS.email}`} className="mt-3 inline-flex min-h-11 items-center gap-3 font-serif text-[28px] italic text-ink transition-colors hover:text-ember">
                <Mail size={20} strokeWidth={1.5} aria-hidden="true" className="text-ember" />
                {LINKS.email}
              </a>
              <ul className="mt-4 divide-y divide-line border-t border-line">
                {links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="group flex min-h-12 items-center justify-between gap-4 py-2 text-[15px] transition-colors hover:text-ember">
                      <span>{l.label}</span>
                      <span className="flex items-center gap-2 font-mono text-[12px] text-faint group-hover:text-ember">
                        {l.handle}
                        <ExternalMark />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
