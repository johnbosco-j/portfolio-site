// What's next. Everything here is a PLAN. When it ships, move it to projects.ts or
// journey.ts and delete it here — never keep the same thing in both.
export type RoadmapStatus = "Planned" | "In progress";
export type RoadmapColumn = { id: string; title: string; accent?: boolean; items: { text: string; status: RoadmapStatus }[] };

export const roadmap: RoadmapColumn[] = [
  {
    id: "rivendevs",
    title: "Riven",
    items: [
      { text: "Secure the domain (rivendevs.in) and company email", status: "In progress" },
      { text: "Register the company", status: "In progress" },
      { text: "Take on the first client website and AI projects", status: "Planned" },
      { text: "Grow the domains from research to products", status: "Planned" },
    ],
  },
  {
    id: "clareo",
    title: "Clareo",
    items: [
      { text: "Public launch at clareo.rivendevs.in", status: "In progress" },
      { text: "Reach the first 200 weekly active users", status: "Planned" },
      { text: "Desktop app and Pro plan", status: "In progress" },
      { text: "Teams for companies", status: "Planned" },
      { text: "A published accuracy study", status: "Planned" },
      { text: "A mobile companion", status: "Planned" },
    ],
  },
  {
    id: "me",
    title: "Me",
    items: [
      { text: "Internships in full-stack, AI or systems roles", status: "In progress" },
      { text: "More hackathons", status: "Planned" },
      { text: "Deeper systems programming", status: "Planned" },
    ],
  },
];
