import type { Content } from '@/lib/cms/content';
import { safeUrl } from '@/lib/cms/content';
import { h2, muted, short, wrap } from './ui';

const Star = ({ on }: { on: boolean }) => (
  <svg viewBox="0 0 24 24" className={`h-4 w-4 ${on ? 'text-champagne-deep' : 'text-pearl-line'}`} aria-hidden>
    <path fill="currentColor" d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
  </svg>
);

/** Ulasan asli pelanggan dari admin. Tidak tampil bila belum ada ulasan. */
export default function Reviews({ c }: { c: Content }) {
  const reviews = (c.testimonial.reviews ?? []).filter((r) => r.name?.trim() && r.text?.trim());
  if (!reviews.length) return null;
  const maps = c.branches.items.map((b) => ({ name: short(b.name), url: safeUrl(b.maps) })).filter((m) => m.url);
  return (
    <section className="py-16 md:py-24">
      <div className={wrap}>
        <h2 className={h2}>Kata pelanggan</h2>
        <p className={`mt-2 ${muted}`}>Ulasan asli dari Google Maps.</p>
      </div>
      <div className="mt-8 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-3 no-scrollbar md:scroll-px-10 md:px-10 xl:scroll-px-[calc((100vw-1200px)/2+40px)] xl:px-[calc((100vw-1200px)/2+40px)]">
        {reviews.map((r, i) => {
          const stars = Math.max(0, Math.min(5, Math.round(Number(r.rating) || 5)));
          return (
            <figure key={`${r.name}-${i}`} className="price-card flex w-[80vw] max-w-[340px] shrink-0 snap-start flex-col rounded-[22px] border border-pearl-line bg-white/70 p-6 sm:w-[340px]">
              <div className="flex gap-0.5" aria-label={`${stars} dari 5 bintang`}>
                {[1, 2, 3, 4, 5].map((n) => <Star key={n} on={n <= stars} />)}
              </div>
              <blockquote className="mt-4 line-clamp-[8] text-[15px] leading-relaxed">&ldquo;{r.text.trim()}&rdquo;</blockquote>
              <figcaption className="mt-auto pt-5 text-[14px]">
                <span className="font-medium">{r.name}</span>
                <span className={muted}>{[r.branch && short(r.branch), r.date].filter(Boolean).map((x) => ` · ${x}`).join('')}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
      {maps.length > 0 && (
        <p className={`${wrap} mt-4 text-[14px] ${muted}`}>
          Baca semua ulasan di Google Maps:{' '}
          {maps.map((m, i) => (
            <span key={m.name}>
              {i > 0 && ' · '}
              <a href={m.url!} target="_blank" rel="noopener" className="font-medium text-bronze-mid underline decoration-bronze-mid/30 underline-offset-4">{m.name}</a>
            </span>
          ))}
        </p>
      )}
    </section>
  );
}
