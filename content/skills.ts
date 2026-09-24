// Grouped skills. `usedIn` holds project slugs from projects.ts — the site links each one.
export type Skill = { name: string; usedIn?: string[] };
export type SkillGroup = { id: string; title: string; note?: string; skills: Skill[]; span: 4 | 6 | 8 | 12 };

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    title: "Languages",
    span: 6,
    skills: [
      { name: "Python", usedIn: ["eyeguard", "clareo"] },
      { name: "TypeScript", usedIn: ["clareo", "rivendevs-website"] },
      { name: "JavaScript", usedIn: ["stockfish-chess"] },
      { name: "SQL", usedIn: ["excelsior-erp", "clareo"] },
      { name: "C" },
      { name: "Java" },
      { name: "8086 Assembly" },
    ],
  },
  {
    id: "web",
    title: "Web & cloud",
    span: 6,
    skills: [
      { name: "React", usedIn: ["clareo", "stockfish-chess", "excelsior-erp"] },
      { name: "Next.js", usedIn: ["rivendevs-website"] },
      { name: "Tailwind CSS", usedIn: ["rivendevs-website"] },
      { name: "Supabase", usedIn: ["excelsior-erp"] },
      { name: "Firebase" },
      { name: "Vercel", usedIn: ["excelsior-erp", "rivendevs-website"] },
      { name: "REST APIs", usedIn: ["eyeguard", "clareo"] },
      { name: "WebAssembly", usedIn: ["stockfish-chess"] },
      { name: "FastAPI", usedIn: ["clareo", "eyeguard"] },
    ],
  },
  {
    id: "ai",
    title: "AI & vision",
    span: 4,
    skills: [
      { name: "MediaPipe", usedIn: ["clareo", "eyeguard"] },
      { name: "On-device computer vision", usedIn: ["clareo"] },
      { name: "LLM features (Claude)", usedIn: ["clareo"] },
    ],
  },
  {
    id: "core",
    title: "Core",
    span: 4,
    skills: [
      { name: "Data structures & algorithms" },
      { name: "DBMS", usedIn: ["excelsior-erp"] },
      { name: "Git & GitHub" },
      { name: "Linux / Ubuntu" },
      { name: "Agile / Scrum", usedIn: ["olearn"] },
    ],
  },
  {
    id: "learning",
    title: "Currently learning",
    note: "In progress",
    span: 4,
    skills: [{ name: "Systems programming" }],
  },
];
