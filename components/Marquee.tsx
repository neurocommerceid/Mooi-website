const items = ['Hair Cut & Styling', 'Coloring', 'Smoothing & Keratin', 'Hair Spa', 'Beauty Bar', 'Bridal & Event'];

export default function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-line bg-ivory py-7">
      <div className="animate-marquee flex w-max items-center hover:[animation-play-state:paused]">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
            {row.map((t, i) => (
              <span key={`${k}-${i}`} className="flex items-center">
                <span className="px-8 font-serif text-3xl font-light italic text-ink/80 md:text-4xl">{t}</span>
                <span className="text-gold">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
