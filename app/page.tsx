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
import { Marquee } from "@/components/ui/Marquee";
import { site } from "@/content/profile";
import { hasResume } from "@/lib/resume";

export default function Home() {
  return (
    <>
      <Hero hasResume={hasResume()} />
      <About />
      <Now />
      <Ventures />
      <Work />
      <div className="border-y-2 border-line-strong py-8" aria-label="Shipped work">
        <Marquee items={site.ticker} />
      </div>
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
