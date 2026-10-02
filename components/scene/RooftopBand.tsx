import { NearRooftops, type Landmark } from "@/components/poster/Village";
import { Stage } from "@/components/scene/Stage";
import type { CharacterName, Pose } from "@/lib/scene/cast";

/**
 * A full-bleed strip of moonlit rooftops with one of the troupe standing on them.
 *
 * These sit between sections, where the page already wanted a divider. That is the whole
 * reason they work: a character tucked into the margin of a section fights the content for
 * room and loses on a narrow screen, whereas a band owns its own strip and can never
 * overlap anything. The rooftops are the same SVG as the hero's foreground, so the village
 * reads as one place seen repeatedly rather than as decoration reused.
 *
 * Entirely decorative — aria-hidden throughout, and the strip keeps its height whether or
 * not the scene ever loads, so nothing below it shifts.
 */
export function RooftopBand({
  who,
  side = "right",
  hold,
  onTap = "leap",
  landmark = "torii",
  flip = false,
  className = "",
}: {
  who: CharacterName;
  side?: "left" | "right";
  hold?: Pose;
  onTap?: Pose;
  /** What the street is built around, so no two bands on the page look alike. */
  landmark?: Landmark;
  flip?: boolean;
  className?: string;
}) {
  const dog = who === "shiro";
  return (
    <div aria-hidden="true" className={`relative h-[clamp(190px,21vw,400px)] overflow-hidden border-y-2 border-line-strong bg-bg-2/70 ${className}`}>
      {/* a wash of moonlight behind the ridge line */}
      <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_120%,rgb(255_231_168/0.09),transparent_62%)]" />
      <NearRooftops landmark={landmark} flip={flip} className="absolute inset-x-0 bottom-0 h-full" />
      <Stage
        cast={[{ name: who, x: 0, z: 0, hold, onTap }]}
        petals={false}
        camera={{ y: dog ? 0.75 : 1.15, z: dog ? 4.2 : 5.4, look: dog ? 0.5 : 0.9 }}
        action="Play the scene"
        className={`pointer-events-auto absolute bottom-[8%] h-[88%] w-[min(340px,46vw)] ${side === "right" ? "right-[6%]" : "left-[6%]"}`}
      />
    </div>
  );
}
