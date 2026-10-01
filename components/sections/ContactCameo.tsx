"use client";

import { Stage } from "@/components/scene/Stage";
import { Corners } from "@/components/ui/InstrumentPanel";
import { site } from "@/content/profile";

/**
 * Gen keeping the gate beside the contact form. He bows each time `sends` increases,
 * which the form bumps after a message goes through.
 *
 * This replaced a cameo of Riv, the Riven robot, which came from a stock three.js sample
 * model and looked exactly like what it was in a moonlit village. Using one of the troupe
 * means the whole site draws its characters from one place, and the 456KB .glb is gone.
 */
export function ContactCameo({ sends }: { sends: number }) {
  const c = site.cameo;
  const sent = sends > 0;
  return (
    <div className="spotlight relative overflow-hidden rounded-bento border border-line bg-panel/60 shadow-hairline">
      <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_60%,black_20%,transparent_75%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_at_50%_100%,rgb(255_200_87/0.14),transparent_65%)]" />
      <Corners />

      <div className="relative z-10 flex items-center justify-between gap-3 px-5 pt-4 font-mono text-micro uppercase">
        <span className="text-ink-2">
          {c.name} <span className="text-faint">· {c.role}</span>
        </span>
        <span className="flex items-center gap-2 text-faint" aria-live="polite">
          <span className="pulse-dot size-1.5 rounded-full bg-signal" aria-hidden="true" />
          {sent ? c.status.greeting : c.status.idle}
        </span>
      </div>

      <p
        key={sends}
        className="bubble-in relative z-10 mx-auto mt-4 w-fit max-w-[28ch] rounded-2xl border border-line bg-panel-2/90 px-4 py-2 text-center text-[14px] text-ink"
        role="status"
      >
        {sent ? c.sent : c.idle}
      </p>

      <Stage
        cast={[{ name: "gen", onTap: "bow" }]}
        petals={false}
        cue={sends}
        cuePose="bow"
        action={`Make ${c.name} bow`}
        camera={{ y: 1.1, z: 5.2, look: 0.85 }}
        className="relative h-[240px] w-full cursor-pointer touch-manipulation md:h-[280px]"
      />
    </div>
  );
}
