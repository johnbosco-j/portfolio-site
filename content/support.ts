// "Buy me a chai" — optional support from people who like the work.
// Every method is off until its value is set (env var or here). Nothing fake is ever shown.

const env = (value: string | undefined) => (value && value.trim().length > 0 ? value.trim() : undefined);

export type SupportMethod = {
  id: "upi" | "bmc" | "sponsors" | "razorpay" | "kofi";
  label: string;
  note: string;
  href?: string;
};

const upiId = env(process.env.NEXT_PUBLIC_UPI_ID);
const upiName = "Johnbosco J Elanjikal";
const upiLink = (amount?: number) =>
  upiId ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&cu=INR${amount ? `&am=${amount}` : ""}&tn=${encodeURIComponent("Support Johnbosco's work")}` : undefined;

export const support = {
  label: "Support",
  word: "Support",
  heading: { before: "Fuel the next", accent: "build", after: "." },
  intro:
    "If something I built helped you — or you just like where it’s going — you can buy me a chai. It helps pay for servers, domains and the next build. Any amount, no pressure.",
  upiId,
  /** Optional QR image: public/support/upi-qr.png (shown on laptops, where UPI links can't open an app). */
  qr: { src: "/support/upi-qr.png", alt: "UPI QR code to support Johnbosco" },
  tiers: [
    { amount: 50, label: "A chai", note: "A small thank-you." },
    { amount: 150, label: "A coffee", note: "For a late-night build." },
    { amount: 500, label: "Fuel a build", note: "Towards servers and domains." },
  ],
  upiLink,
  methods: [
    { id: "upi", label: "UPI", note: "GPay · PhonePe · Paytm — India", href: upiLink() },
    { id: "razorpay", label: "Razorpay", note: "Cards, netbanking, UPI", href: env(process.env.NEXT_PUBLIC_RAZORPAY_URL) },
    { id: "bmc", label: "Buy Me a Coffee", note: "International cards", href: env(process.env.NEXT_PUBLIC_BMC_URL) },
    { id: "kofi", label: "Ko-fi", note: "International cards & PayPal", href: env(process.env.NEXT_PUBLIC_KOFI_URL) },
    { id: "sponsors", label: "GitHub Sponsors", note: "Monthly or one-time", href: env(process.env.NEXT_PUBLIC_GITHUB_SPONSORS_URL) },
  ] satisfies SupportMethod[],
  soon: "Support links open soon.",
};
