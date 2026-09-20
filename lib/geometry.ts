/** Round SVG coordinates so server and client trig results match exactly (no hydration diff). */
export const r3 = (n: number) => Math.round(n * 1000) / 1000;
