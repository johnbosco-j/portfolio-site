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
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0B0B0C", position: "relative", overflow: "hidden" }}>
        {/* red poster bar */}
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 190, background: "#D92D32", display: "flex" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 96, height: 3, background: "#3A3A3F", display: "flex" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 118, height: 3, background: "#3A3A3F", display: "flex" }} />
        <div style={{ position: "absolute", left: 76, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 22, color: "#9A9AA1", letterSpacing: 3, textTransform: "uppercase", display: "flex" }}>Founder · Riven · 3rd-year CSE · Chennai</div>
          <div style={{ marginTop: 28, fontSize: 116, color: "#F2F2F3", lineHeight: 0.95, letterSpacing: -4, display: "flex", ...(sans ? { fontFamily: "Instrument Sans" } : {}) }}>{profile.firstName}</div>
          <div style={{ fontSize: 104, color: "#CFCFD3", lineHeight: 1.05, display: "flex", ...(serif ? { fontFamily: "Instrument Serif", fontStyle: "italic" } : {}) }}>{profile.lastName}</div>
          <div style={{ marginTop: 32, fontSize: 28, color: "#E5383B", display: "flex", ...(sans ? { fontFamily: "Instrument Sans" } : {}) }}>Founder of Riven · Full-stack developer</div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
