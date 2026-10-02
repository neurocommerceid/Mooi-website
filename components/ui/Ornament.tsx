// Cincin rose-gold yang menggemakan lingkaran pada logo Mooi.
export default function Ornament({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" aria-hidden className={className}>
      <defs>
        <linearGradient id="og" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E6C3A8" />
          <stop offset=".5" stopColor="#C08A6C" />
          <stop offset="1" stopColor="#9E6449" />
        </linearGradient>
      </defs>
      <g className="animate-spin-slow" style={{ transformOrigin: '200px 200px' }}>
        <circle cx="200" cy="200" r="196" stroke="url(#og)" strokeWidth=".8" strokeDasharray="1 7" />
        <path d="M200 30a170 170 0 1 1-120 50" stroke="url(#og)" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="80" cy="80" r="3" fill="#E6C3A8" />
      </g>
      <g className="animate-spin-slower" style={{ transformOrigin: '200px 200px' }}>
        <circle cx="200" cy="200" r="140" stroke="url(#og)" strokeWidth=".6" opacity=".6" />
        <path d="M200 52l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#E6C3A8" />
      </g>
    </svg>
  );
}
