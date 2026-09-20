import type { Metadata, Viewport } from "next";
import { Archivo, DM_Mono, Geist, Instrument_Sans, Instrument_Serif, Noto_Nastaliq_Urdu, Noto_Sans_JP, Noto_Sans_Malayalam } from "next/font/google";
import { NavBar } from "@/components/nav/NavBar";
import { AmbientBackground } from "@/components/parallax/AmbientBackground";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { StatusBar } from "@/components/ui/StatusBar";
import { SpotlightTracker } from "@/components/ui/SpotlightTracker";
import { Footer } from "@/components/sections/Footer";
import { LINKS, SITE_URL, profile, site } from "@/content/profile";
import { getLatestPush } from "@/lib/github";
import "./globals.css";

const sans = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-sans", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const modern = Geist({ subsets: ["latin"], weight: ["300", "400"], variable: "--font-modern", display: "swap" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });
// Poster display: heavy, slightly extended, italic — the big name and section titles.
const display = Archivo({ subsets: ["latin"], weight: "variable", style: ["normal", "italic"], axes: ["wdth"], variable: "--font-display", display: "swap" });
// Malayalam, Urdu (Nastaliq) and Japanese, for the poster line and the vertical rails.
const malayalam = Noto_Sans_Malayalam({ subsets: ["malayalam"], weight: ["500", "600"], variable: "--font-ml", display: "swap" });
const urdu = Noto_Nastaliq_Urdu({ subsets: ["arabic"], weight: ["500", "600"], variable: "--font-ur", display: "swap" });
// CJK families are served as unicode-range slices; don't preload, the rails are decorative.
const japanese = Noto_Sans_JP({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-jp", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: site.title, template: `%s — ${profile.name}` },
  description: site.description,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: SITE_URL }],
  alternates: { canonical: "/" },
  openGraph: { type: "profile", url: "/", siteName: profile.name, title: site.title, description: site.description, locale: "en_IN", firstName: profile.firstName, lastName: profile.lastName },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#0B0B0C", colorScheme: "dark" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: SITE_URL,
  jobTitle: profile.jobTitle,
  description: site.description,
  address: { "@type": "PostalAddress", addressLocality: profile.city, addressCountry: "IN" },
  worksFor: { "@type": "Organization", name: "Jovora", url: LINKS.jovora },
  // A current student (3rd year) — affiliation, not alumniOf.
  affiliation: { "@type": "CollegeOrUniversity", name: profile.education.institution, address: { "@type": "PostalAddress", addressLocality: "Chennai", addressCountry: "IN" } },
  knowsAbout: profile.knowsAbout,
  knowsLanguage: profile.languages.map((l) => l.name),
  sameAs: [LINKS.github, LINKS.linkedin, LINKS.jovora].filter(Boolean),
};


export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const push = await getLatestPush();
  return (
    <html lang="en-IN" suppressHydrationWarning className={`${sans.variable} ${serif.variable} ${mono.variable} ${modern.variable} ${display.variable} ${malayalam.variable} ${urdu.variable} ${japanese.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-ember-fill focus:text-white focus:px-5 focus:py-3 focus:font-medium "
        >
          Skip to content
        </a>
        <AmbientBackground />
        <SpotlightTracker />
        <RevealObserver />
        <div className="relative z-[1]">
          <NavBar />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </div>
        <StatusBar push={push} />
        <div className="grain" aria-hidden="true" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
