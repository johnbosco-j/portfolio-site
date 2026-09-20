import { readFile } from "node:fs/promises";
import { hasResume, resumePath } from "@/lib/resume";

// Serves the PUBLIC résumé (no phone number) from /public/resume.
export async function GET() {
  if (!hasResume()) {
    return new Response("The résumé will be available here soon.", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
  const pdf = await readFile(resumePath());
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="Johnbosco-J-Elanjikal-Resume.pdf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
