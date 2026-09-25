// Timeline milestones. Fill `date` with the exact month when known ("Mar 2025") —
// never guess. While a date is missing, the timeline shows the `phase` label instead.
export type JourneyType = "education" | "project" | "hackathon" | "venture" | "launch" | "plan";

export type Milestone = {
  /** TODO: add exact months (see README → assets to supply). */
  date?: string;
  phase: string;
  type: JourneyType;
  title: string;
  accent?: string;
  body: string;
  /** Ember milestone dot (hackathons, founding RivenDevs, Clareo). */
  milestone?: boolean;
  href?: string;
};

export const journey: Milestone[] = [
  {
    phase: "School",
    type: "education",
    title: "St. Joseph Matriculation HSS",
    body: "Finished Class 12 at St. Joseph, Ambattur, with 89%.",
  },
  {
    phase: "College",
    type: "education",
    title: "Joined LICET",
    body: "Started a B.E. in Computer Science & Engineering at Loyola-ICAM College of Engineering and Technology, Chennai — now in my third year.",
  },
  {
    phase: "Project",
    type: "project",
    title: "Built oLearn",
    body: "Led a 4-member team through a 14-day sprint to ship an e-learning platform.",
    href: "#work-olearn",
  },
  {
    phase: "Project",
    type: "project",
    title: "Built Excelsior ERP",
    body: "A role-based institutional ERP on Supabase with Row-Level Security and Vercel CI/CD.",
    href: "/work/excelsior-erp",
  },
  {
    phase: "Hackathon",
    type: "hackathon",
    title: "EyeGuard at Ctrl Alt Hack 2.0",
    accent: "7th place",
    body: "A real-time fatigue-detection API, built and deployed in one hackathon.",
    milestone: true,
    href: "/work/eyeguard",
  },
  {
    phase: "Hackathon",
    type: "hackathon",
    title: "Buildathon 3.0",
    accent: "5th place",
    body: "Another build sprint, another placement.",
    milestone: true,
  },
  {
    date: "2026",
    phase: "Venture",
    type: "venture",
    title: "Founded RivenDevs",
    body: "A multi-domain technology company — and a place to ship things properly.",
    milestone: true,
    href: "#ventures",
  },
  {
    phase: "Launch",
    type: "launch",
    title: "EyeGuard grows into Clareo",
    body: "Rebuilt to run fully on-device, with detection engine v5, a desktop app and analytics.",
    milestone: true,
    href: "/work/clareo",
  },
  {
    phase: "Next",
    type: "plan",
    title: "See the roadmap",
    body: "What comes next, clearly labelled as plans.",
    href: "#roadmap",
  },
];
