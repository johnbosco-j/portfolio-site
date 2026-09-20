import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/profile";
import { caseStudies } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...caseStudies.map((p) => ({ url: `${SITE_URL}/work/${p.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
