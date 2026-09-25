// Who he is, site-wide copy and links. Change URLs here or via env vars — never in components.

const env = (value: string | undefined) => (value && value.trim().length > 0 ? value.trim() : undefined);

export const SITE_URL = env(process.env.NEXT_PUBLIC_SITE_URL) ?? "https://johnbosco.rivendevs.in";
export const RIVENDEVS_URL = env(process.env.NEXT_PUBLIC_RIVENDEVS_URL) ?? "https://rivendevs.in";
export const CLAREO_URL = env(process.env.NEXT_PUBLIC_CLAREO_URL) ?? "https://clareo.rivendevs.in";

export const LINKS = {
  rivendevs: RIVENDEVS_URL,
  clareo: CLAREO_URL,
  github: "https://github.com/johnbosco-j",
  /** Hidden everywhere while unset. */
  linkedin: env(process.env.NEXT_PUBLIC_LINKEDIN_URL),
  /** Company inbox. Never the personal Gmail, never a phone number. */
  email: "hello@rivendevs.in",
  /** Public résumé (no phone number). Served by app/resume/route.ts from /public/resume. */
  resume: "/resume",
  resumeFile: "resume/Johnbosco-J-Elanjikal-Resume.pdf",
} as const;

export type Heading = { before: string; accent: string; after: string };
export type NavItem = { label: string; href: `#${string}` };

export const profile = {
  name: "Johnbosco J Elanjikal",
  firstName: "Johnbosco",
  lastName: "J Elanjikal",
  role: "Founder of RivenDevs · Full-stack developer",
  jobTitle: "Founder",
  location: "Chennai, India",
  city: "Chennai",
  monogram: "J",
  /**
   * The name and role in Malayalam and Arabic, used for the poster line and the vertical
   * side rails. TODO: have a native reader check both spellings before launch.
   */
  /**
   * The name across writing systems, for the scrolling strip under the header.
   * Decorative, but it is still his name — TODO: have native readers check these before
   * launch, and delete any line you are not sure about rather than leaving it wrong.
   */
  nameIn: [
    { lang: "English", code: "en", text: "Johnbosco" },
    { lang: "Malayalam", code: "ml", text: "ജോൺ ബോസ്കോ" },
    { lang: "Tamil", code: "ta", text: "ஜான் போஸ்கோ" },
    { lang: "Hindi", code: "hi", text: "जॉनबॉस्को" },
    { lang: "Nepali", code: "ne", text: "जोनबोस्को" },
    { lang: "Bengali", code: "bn", text: "জনবস্কো" },
    { lang: "Telugu", code: "te", text: "జాన్‌బాస్కో" },
    { lang: "Kannada", code: "kn", text: "ಜಾನ್‌ಬಾಸ್ಕೊ" },
    { lang: "Gujarati", code: "gu", text: "જૉનબૉસ્કો" },
    { lang: "Punjabi", code: "pa", text: "ਜਾਨਬੋਸਕੋ" },
    { lang: "Odia", code: "or", text: "ଜନବୋସ୍କୋ" },
    { lang: "Sinhala", code: "si", text: "ජොන්බොස්කෝ" },
    { lang: "Urdu", code: "ur", text: "جان بوسکو" },
    { lang: "Arabic", code: "ar", text: "جون بوسكو" },
    { lang: "Hebrew", code: "he", text: "ג׳ונבוסקו" },
    { lang: "Greek", code: "el", text: "Τζονμπόσκο" },
    { lang: "Russian", code: "ru", text: "Джонбоско" },
    { lang: "Serbian", code: "sr", text: "Џонбоско" },
    { lang: "Mongolian", code: "mn", text: "Жонбоско" },
    { lang: "Georgian", code: "ka", text: "ჯონბოსკო" },
    { lang: "Armenian", code: "hy", text: "Ջոնբոսկո" },
    { lang: "Amharic", code: "am", text: "ጆንቦስኮ" },
    { lang: "Thai", code: "th", text: "จอห์นบอสโก" },
    { lang: "Lao", code: "lo", text: "ຈອນບອສໂກ" },
    { lang: "Burmese", code: "my", text: "ဂျွန်ဘော့စကို" },
    { lang: "Japanese", code: "ja", text: "ジョンボスコ" },
    { lang: "Korean", code: "ko", text: "존보스코" },
    { lang: "Chinese", code: "zh", text: "约翰博斯科" },
    { lang: "Vietnamese", code: "vi", text: "Gioan Bosco" },
    { lang: "Turkish", code: "tr", text: "Conbosko" },
    { lang: "Braille", code: "en", text: "⠚⠕⠓⠝⠃⠕⠎⠉⠕" },
    { lang: "Runic", code: "non", text: "ᛃᛟᚻᚾᛒᛟᛋᚲᛟ" },
  ],
  scripts: {
    ml: { name: "ജോൺ ബോസ്കോ", role: "ഫുൾ-സ്റ്റാക്ക് ഡെവലപ്പർ", work: "പ്രവൃത്തികൾ", wins: "നേട്ടങ്ങൾ" },
    ur: { name: "جان بوسکو", role: "فل اسٹیک ڈویلپر", about: "تعارف" },
    jp: { name: "ジョンボスコ", role: "フルスタック開発者", work: "作品", wins: "実績" },
  },
  /** Handwritten-style sign-off on the poster. */
  signature: "J. Elanjikal ’26",

  education: {
    degree: "B.E. Computer Science & Engineering",
    institution: "Loyola-ICAM College of Engineering and Technology",
    short: "LICET",
    city: "Chennai",
    year: "3rd year",
    /** Current student — never write graduate / alumnus. */
    status: "In progress",
    /** TODO: confirm the expected graduation year (don't guess). */
    expectedGraduation: undefined as string | undefined,
    cgpa: "8.09",
    cgpaNote: "so far, through the 4th semester",
  },
  school: {
    name: "St. Joseph Matriculation Higher Secondary School",
    place: "Ambattur",
    result: "89%",
    resultLabel: "Class 12",
  },
  languages: [
    { name: "English", level: "Fluent" },
    { name: "Tamil", level: "Native" },
    { name: "Malayalam", level: "Basic" },
  ],
  interests: ["Developer tools", "Competitive hackathons", "Chess", "Systems programming", "Long drives"],
  knowsAbout: [
    "Full-stack web development",
    "Computer vision",
    "Real-time APIs",
    "React",
    "Next.js",
    "TypeScript",
    "Python",
    "FastAPI",
    "Supabase",
    "MediaPipe",
    "Systems programming",
  ],
} as const;

export const site = {
  title: "Johnbosco J Elanjikal — Founder of RivenDevs · Full-stack developer",
  description:
    "Third-year Computer Science student in Chennai and founder of RivenDevs. I build full-stack platforms, real-time APIs and on-device computer vision, from hackathon prototypes to products like Clareo.",

  nav: [
    { label: "Work", href: "#work" },
    { label: "Ventures", href: "#ventures" },
    { label: "Journey", href: "#journey" },
    { label: "Stack", href: "#stack" },
    { label: "Contact", href: "#contact" },
  ] satisfies NavItem[],
  /** Can become "Work with me". */
  navCta: { label: "Hire me", href: "#contact" as const },

  hero: {
    status: { label: "Open to internships & client projects", open: true },
    headline: { before: "I build", accent: "clear", after: "software — and a company to ship it." } satisfies Heading,
    intro:
      "I’m a third-year Computer Science student in Chennai and the founder of RivenDevs. I build full-stack platforms, real-time APIs and on-device computer vision, and I take them from a hackathon weekend to a product people use.",
    primary: { label: "See my work", href: "#work" },
    resume: { label: "Download résumé", soon: "Résumé — coming soon" },
    rivendevs: "Visit RivenDevs",
    motionPrompt: "Tap · move it with your phone",
    scrollCue: "Scroll for work",
    /** The two tilted ribbon bands under the poster. */
    ribbons: {
      motto: ["Build", "Ship", "Iterate", "Measure", "Win hackathons", "Repeat"],
      stack: ["React", "Next.js", "TypeScript", "Python", "FastAPI", "MediaPipe", "Supabase", "WebAssembly", "Postgres"],
    },
    scroll: "Scroll",
  },

  ticker: ["Clareo", "Excelsior ERP", "EyeGuard", "oLearn", "Stockfish Chess", "RivenDevs website"],

  now: {
    label: "Now",
    word: "Now",
    heading: { before: "What I’m doing", accent: "now", after: "." } satisfies Heading,
    panelTitle: "Now · this month",
  },

  ventures: {
    label: "Ventures",
    word: "Ventures",
    heading: { before: "What I’m", accent: "building", after: "." } satisfies Heading,
    intro: "One company, one live product, and a clear list of what comes next. Tap a planet to read about it.",
    sourceNote: "Clareo engine test suite / DETECTION_ENGINE.md",
  },

  work: {
    label: "Work",
    word: "Projects",
    heading: { before: "Things I’ve", accent: "shipped", after: "." } satisfies Heading,
    intro: "Every tile is something that runs. Status, role and stack on each — case studies for the big ones.",
  },

  journey: {
    label: "Journey",
    word: "Career",
    heading: { before: "How I", accent: "got", after: " here." } satisfies Heading,
    intro: "School, college, two hackathon placements, a company, and a product that grew out of a weekend.",
  },

  stack: {
    label: "Stack",
    word: "Stack",
    heading: { before: "Tools I", accent: "reach", after: " for." } satisfies Heading,
    intro: "No percentages, no bars. Each tool links to the work I used it in.",
  },

  recognition: {
    label: "Recognition",
    word: "Achievements",
    heading: { before: "Placements, certificates,", accent: "grades", after: "." } satisfies Heading,
  },

  roadmap: {
    label: "What’s next",
    word: "Next",
    heading: { before: "The", accent: "roadmap", after: "." } satisfies Heading,
    intro: "Plans, not promises. When something ships, it moves up to Work.",
  },

  contact: {
    label: "Contact",
    word: "Contact",
    heading: { before: "Let’s build something", accent: "clear", after: "." } satisfies Heading,
    intro: "An internship, a website or AI system you need built, a hackathon team, or just hello — tell me and I’ll reply.",
    topics: ["Internship", "Client project", "Collaboration", "Hackathon team", "Just saying hi"],
    success: "Thanks — your message is in. I’ll get back to you soon.",
    emailLabel: "Or write to",
    panelTitle: "Message · secure form",
  },

  /** The big red "open to work" block between Work and Journey. */
  open: {
    title: "Open",
    subtitle: "Open to internships & client projects",
    body: "Looking for a developer, or hiring an intern? Tell me what you need built.",
    cta: "Get in touch",
    secondary: "See the résumé",
  },

  riv: {
    name: "Riv",
    role: "The RivenDevs robot",
    idle: "Say hi and I’ll wave.",
    sent: "Message received — waving it through!",
    status: { idle: "Standing by", waving: "Waving", loading: "Waking up", offline: "Offline" },
  },

  footer: {
    tagline: "Built by Johnbosco J Elanjikal · Chennai",
    links: [
      { label: "Work", href: "/#work" },
      { label: "Ventures", href: "/#ventures" },
      { label: "Résumé", href: "resume" },
      { label: "RivenDevs", href: "rivendevs" },
      { label: "Clareo", href: "clareo" },
      { label: "Support", href: "/#support" },
      { label: "GitHub", href: "github" },
    ],
    legal: "© 2026 Johnbosco J Elanjikal",
    watermark: "Johnbosco",
  },
} as const;
