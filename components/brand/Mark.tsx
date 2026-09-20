/** Personal mark: a printed red badge with the "J" monogram and a notched corner. */
export function Mark({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <rect x="2" y="2" width="60" height="60" rx="3" className="fill-ember-fill" />
      <path d="M46 2h16v16z" className="fill-bg" />
      <path
        d="M40 15v22c0 7-4.4 11.5-11 11.5-5 0-8.7-2.6-10.2-7"
        fill="none"
        stroke="#fff"
        strokeWidth="6.5"
        strokeLinecap="square"
      />
      <rect x="2" y="2" width="60" height="60" rx="3" fill="none" className="stroke-line-strong" strokeWidth="2" />
    </svg>
  );
}
