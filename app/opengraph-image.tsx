import { ImageResponse } from "next/og";
import { profile, site } from "@/content/profile";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function googleFont(family: string, text: string) {
  // Falls back to the default font if offline at build.
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh) AppleWebKit/533 (KHTML) Safari/533" },
    }).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype|woff)'\)/)?.[1];
    return url ? await fetch(url).then((r) => r.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

export default async function OgImage() {
  const [sans, serif] = await Promise.all([
    googleFont("Instrument+Sans:wght@600", profile.firstName + "Founder of Riven · Full-stack developer"),
    googleFont("Instrument+Serif:ital@1", profile.lastName),
  ]);
  const fonts = [
    ...(sans ? [{ name: "Instrument Sans", data: sans, style: "normal" as const, weight: 600 as const }] : []),
    ...(serif ? [{ name: "Instrument Serif", data: serif, style: "italic" as const, weight: 400 as const }] : []),
  ];
  // Iga Night: a moon low on the right, a rooftop line along the bottom, torii red for the
  // identity. Satori supports a subset of CSS and no SVG elements, so the scenery is built
  // from positioned divs with border-radius and borders.
  const roof = (left: number, width: number, height: number, shade: string) => (
    <div
      key={left}
      style={{
        position: "absolute",
        left,
        bottom: 0,
        width,
        height,
        background: shade,
        borderTop: "3px solid #34407A",
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        display: "flex",
      }}
    />
  );

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#070A1F", position: "relative", overflow: "hidden" }}>
        {/* the moon, with a halo */}
        <div style={{ position: "absolute", right: 26, top: 12, width: 380, height: 380, borderRadius: 190, background: "radial-gradient(circle, rgba(255,231,168,0.26) 0%, rgba(255,231,168,0.08) 48%, rgba(255,231,168,0) 70%)", display: "flex" }} />
        <div style={{ position: "absolute", right: 126, top: 112, width: 180, height: 180, borderRadius: 90, background: "#FFE7A8", display: "flex" }} />
        <div style={{ position: "absolute", right: 196, top: 150, width: 42, height: 42, borderRadius: 21, background: "#EED496", opacity: 0.55, display: "flex" }} />
        <div style={{ position: "absolute", right: 148, top: 212, width: 26, height: 26, borderRadius: 13, background: "#EED496", opacity: 0.45, display: "flex" }} />

        {/* rooftops along the bottom */}
        {[roof(-30, 300, 96, "#10163A"), roof(250, 260, 64, "#0B1030"), roof(490, 320, 112, "#10163A"), roof(790, 280, 72, "#0B1030"), roof(1050, 300, 98, "#10163A")]}

        {/* torii gate */}
        <div style={{ position: "absolute", left: 898, bottom: 0, width: 16, height: 112, background: "#D62839", display: "flex" }} />
        <div style={{ position: "absolute", left: 999, bottom: 0, width: 16, height: 112, background: "#D62839", display: "flex" }} />
        <div style={{ position: "absolute", left: 884, bottom: 74, width: 146, height: 13, background: "#D62839", display: "flex" }} />
        {/* the kasagi overhangs the pillars, which is what makes it read as a gate */}
        <div style={{ position: "absolute", left: 866, bottom: 112, width: 182, height: 17, background: "#D62839", display: "flex" }} />

        {/* poster rules */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 96, height: 3, background: "#34407A", display: "flex" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 118, height: 3, background: "#34407A", opacity: 0.5, display: "flex" }} />

        <div style={{ position: "absolute", left: 76, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 22, color: "#9CA2C2", letterSpacing: 3, textTransform: "uppercase", display: "flex" }}>Founder · Riven · 3rd-year CSE · Chennai</div>
          <div style={{ marginTop: 28, fontSize: 116, color: "#F4EFE4", lineHeight: 0.95, letterSpacing: -4, display: "flex", ...(sans ? { fontFamily: "Instrument Sans" } : {}) }}>{profile.firstName}</div>
          <div style={{ fontSize: 104, color: "#D9D3C4", lineHeight: 1.05, display: "flex", ...(serif ? { fontFamily: "Instrument Serif", fontStyle: "italic" } : {}) }}>{profile.lastName}</div>
          <div style={{ marginTop: 32, fontSize: 28, color: "#FF5C66", display: "flex", ...(sans ? { fontFamily: "Instrument Sans" } : {}) }}>Founder of Riven · Full-stack developer</div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
