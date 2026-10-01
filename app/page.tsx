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
      {/* The troupe reappears between sections, each on the same rooftops as the hero. */}
      <RooftopBand who="kiku" side="left" />
      <Ventures />
      <Work />
      <div className="border-y-2 border-line-strong py-8" aria-label="Shipped work">
        <Marquee items={site.ticker} />
      </div>
      <RooftopBand who="beni" side="right" />
      <OpenToWork hasResume={hasResume()} />
      <Journey />
      <Moments />
      <Stack />
      <Recognition />
      <RooftopBand who="shiro" side="left" hold="run" onTap="leap" />
      <Roadmap />
      <Support />
      <RooftopBand who="gen" side="right" onTap="bow" />
      <Contact />
    </>
  );
}
