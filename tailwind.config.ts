import type { Config } from "tailwindcss";

// Tokens mirror design_port.md §2–6. Colours are CSS variables (RGB channels) so the
// light "paper" and dark themes swap without re-rendering. Components use these names only.
const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.ts", "./lib/**/*.ts"],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: v("bg"), 2: v("bg-2") },
        panel: { DEFAULT: v("panel"), 2: v("panel-2") },
        line: { DEFAULT: v("line"), strong: v("line-strong") },
        ink: { DEFAULT: v("ink"), 2: v("ink-2") },
        muted: v("muted"),
        faint: v("faint"),
        // Ember = the red accent. `ember` for text/lines, `ember-fill` (deeper red, white text ≥ 4.5:1) for fills.
        ember: { DEFAULT: v("ember"), hot: v("ember-hot"), fill: "#D92D32", deep: "#B42318" },
        // Signal: live data in a lighter coral red. `signal` for text/lines, `signal-fill` for fills with `signal-ink` text.
        signal: { DEFAULT: v("signal"), fill: "#FF6B6B", ink: "#1A0B0C", soft: v("signal-soft") },
        info: "#A193FF",
        teal: "#5CE1E6",
        danger: v("danger"),
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        modern: ["var(--font-modern)", "var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
        ml: ["var(--font-ml)", "var(--font-sans)", "system-ui", "sans-serif"],
        ur: ["var(--font-ur)", "var(--font-sans)", "serif"],
        jp: ["var(--font-jp)", "Hiragino Sans", "Yu Gothic", "system-ui", "sans-serif"],
      },
      fontSize: {
        hero: ["clamp(52px, 8.5vw, 124px)", { lineHeight: "0.95", letterSpacing: "-0.035em" }],
        h2: ["clamp(36px, 5vw, 64px)", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        micro: ["12px", { lineHeight: "1.4", letterSpacing: "0.08em" }],
      },
      maxWidth: { content: "1240px" },
      borderRadius: { sm: "3px", input: "4px", panel: "5px", bento: "6px" },
      spacing: { 22: "88px", 32: "128px", 40: "160px", 44: "176px" },
      transitionTimingFunction: {
        out: "cubic-bezier(.16, 1, .3, 1)",
        "in-out": "cubic-bezier(.65, 0, .35, 1)",
        inst: "cubic-bezier(.2, .8, .2, 1)",
      },
      transitionDuration: { 1: "150ms", 2: "350ms", 3: "700ms" },
      boxShadow: {
        hairline: "inset 0 1px 0 rgb(255 255 255 / 0.04)",
        // Hard offset shadows (poster / neo-brutalist)
        brut: "5px 5px 0 0 rgb(var(--line-strong))",
        "brut-red": "5px 5px 0 0 #D92D32",
        "brut-lg": "8px 8px 0 0 #D92D32",
        "ember-edge": "inset 0 1px 0 rgb(255 255 255 / 0.04), 0 0 0 1px rgb(229 56 59 / 0.12), 0 16px 48px -20px rgb(229 56 59 / 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
