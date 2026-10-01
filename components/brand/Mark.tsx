/**
 * Personal mark (Iga Night): a torii-red hanko seal with a thin inner line and a serif
 * italic "J", sitting inside a brush-drawn ensō ring. Original artwork, drawn as paths so
 * it needs no font at runtime.
 */
export function Mark({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={className}>
      {/* ensō: an open brush ring, thick at the start and tapering away */}
      <path
        d="M48.5 14.5a24 24 0 1 0 6.2 14.8"
        fill="none"
        className="stroke-ink"
        strokeOpacity="0.5"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* hanko: the seal block */}
      <rect x="15" y="15" width="34" height="34" rx="2" className="fill-ember-fill" />
      <rect x="18.5" y="18.5" width="27" height="27" rx="1" fill="none" stroke="#F4EFE4" strokeOpacity="0.55" strokeWidth="1.2" />
      {/* the J, cut out of the seal */}
      <text
        x="32"
        y="42"
        textAnchor="middle"
        fontFamily="var(--font-serif), Georgia, serif"
        fontStyle="italic"
        fontSize="26"
        fill="#F4EFE4"
      >
        J
      </text>
    </svg>
  );
}
