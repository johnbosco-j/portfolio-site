import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Moments } from "@/components/sections/Moments";
import { OpenToWork } from "@/components/sections/OpenToWork";
import { Support } from "@/components/sections/Support";
import { Journey } from "@/components/sections/Journey";
import { Now } from "@/components/sections/Now";
import { Recognition } from "@/components/sections/Recognition";
import { Roadmap } from "@/components/sections/Roadmap";
import { Stack } from "@/components/sections/Stack";
import { Ventures } from "@/components/sections/Ventures";
import { Work } from "@/components/sections/Work";
import { RooftopBand } from "@/components/scene/RooftopBand";
import { Marquee } from "@/components/ui/Marquee";
import { site } from "@/content/profile";
import { hasResume } from "@/lib/resume";

export default function Home() {
  return (
    <>
      <Hero hasResume={hasResume()} />
      <About />
      <Now />
      {/* Two bands between sections, plus the footer's. Every character still appears —
          Shiro sits beside Kuro in the hero and Gen keeps the gate at Contact — but five
          full-width scenes down one page was decoration crowding out the work. */}
      <RooftopBand who="kiku" side="left" landmark="festival" />
      <Ventures />
      <Work />
      <div className="border-y-2 border-line-strong py-8" aria-label="Shipped work">
        <Marquee items={site.ticker} />
      </div>
      <RooftopBand who="beni" side="right" landmark="pagoda" />
      <OpenToWork hasResume={hasResume()} />
      <Journey />
      <Moments />
      <Stack />
      <Recognition />
      <Roadmap />
      <Support />
      <Contact />
    </>
  );
}
