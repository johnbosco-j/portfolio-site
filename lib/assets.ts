import { existsSync } from "node:fs";
import path from "node:path";

/** True when a file referenced as "/x/y.jpg" exists in /public (checked at build). */
export const publicFileExists = (src: string) => existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));
