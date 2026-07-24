export default function BrandLoader({ fullScreen = true }: { fullScreen?: boolean }) {
  return (
    <div className={`brand-loader ${fullScreen ? 'brand-loader--full' : ''}`} role="status" aria-live="polite">
      <div className="brand-loader__orb">
        <span className="brand-loader__ring" aria-hidden="true" />
        <span className="brand-loader__ring brand-loader__ring--delay" aria-hidden="true" />
        <svg
          className="brand-loader__tree"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M32 8C32 8 18 26 18 36c0 6.6 5.4 10 14 10s14-3.4 14-10C46 26 32 8 32 8Z"
            fill="url(#treeGrad)"
          />
          <path
            d="M32 22c0 0-8 12-8 18c0 3.9 3.2 6 8 6s8-2.1 8-6c0-6-8-18-8-18Z"
            fill="#81c784"
            opacity="0.9"
          />
          <rect x="29" y="44" width="6" height="12" rx="2" fill="#0d5c0d" />
          <circle cx="26" cy="30" r="2" fill="#e8f5e9" opacity="0.85" />
          <circle cx="36" cy="34" r="1.6" fill="#e8f5e9" opacity="0.75" />
          <defs>
            <linearGradient id="treeGrad" x1="18" y1="8" x2="46" y2="46" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4caf50" />
              <stop offset="1" stopColor="#0d5c0d" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <p className="brand-loader__brand">Dikim Rock Garden</p>
      <p className="brand-loader__tag">A Feel Of Nature</p>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
