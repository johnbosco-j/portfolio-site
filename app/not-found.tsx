import type { Metadata } from "next";
import { RooftopBand } from "@/components/scene/RooftopBand";
import { Button } from "@/components/ui/Button";

// Without this the tab carries the site's default title, which makes a 404 look like a
// page that loaded correctly.
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <section className="container-x flex min-h-[62svh] flex-col items-start justify-center pt-32">
        <p className="micro">404 · Not found</p>
        <h1 className="mt-4 text-h2">
          This page isn’t <em className="accent text-ember">here</em>.
        </h1>
        <p className="mt-4 max-w-[40ch] text-muted">It may have moved, or it was never shipped. The work is one click away.</p>
        <div className="mt-8">
          <Button href="/#work">See my work</Button>
        </div>
      </section>
      {/* Kiku, up on the rooftops, looking for it too. */}
      <RooftopBand who="kiku" side="right" landmark="none" className="mt-16" />
    </>
  );
}
