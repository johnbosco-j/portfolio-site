import { existsSync } from "node:fs";
import path from "node:path";
import { LINKS } from "@/content/profile";

export const resumePath = () => path.join(process.cwd(), "public", LINKS.resumeFile);

/** True when the public résumé PDF (no phone number) has been added to /public/resume. */
export const hasResume = () => existsSync(resumePath());
