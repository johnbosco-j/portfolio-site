import { profile } from "./profile";

export type Placement = { value: string; event: string; project?: string; href?: string };

export const placements: Placement[] = [
  { value: "7th", event: "Ctrl Alt Hack 2.0", project: "EyeGuard", href: "/work/eyeguard" },
  { value: "5th", event: "Buildathon 3.0" },
];

export const certifications = [
  { name: "Oracle Database Management Systems (DBMS)", issuer: "Oracle" },
  { name: "German Language I", issuer: "NPTEL" },
];

export const education = [
  {
    institution: profile.education.institution,
    short: profile.education.short,
    detail: `${profile.education.degree} · ${profile.education.year} · ${profile.education.status.toLowerCase()}`,
    value: profile.education.cgpa,
    valueLabel: `CGPA · ${profile.education.cgpaNote}`,
  },
  {
    institution: profile.school.name,
    short: "St. Joseph",
    detail: `${profile.school.resultLabel} · ${profile.school.place}`,
    value: profile.school.result,
    valueLabel: profile.school.resultLabel,
  },
];
