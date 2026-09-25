// Edit monthly. `updated` shows on the panel ("Updated September 2026").
export type NowItem = {
  label: "Building" | "Running" | "Studying" | "Playing";
  title: string;
  body: string;
  status?: { text: string; live: boolean };
};

export const now = {
  updated: "September 2026",
  items: [
    {
      label: "Building",
      title: "Clareo",
      body: "Detection engine v5, the desktop app, and launch prep.",
      status: { text: "Shipping", live: true },
    },
    {
      label: "Running",
      title: "RivenDevs",
      body: "The company site, client websites and AI work, registration and the domain.",
    },
    {
      label: "Studying",
      title: "3rd year, B.E. CSE",
      body: "At LICET, in progress — CGPA 8.09 so far.",
    },
    {
      label: "Playing",
      title: "Chess",
      body: "Chess, and getting ready for the next hackathon.",
    },
  ] satisfies NowItem[],
};
