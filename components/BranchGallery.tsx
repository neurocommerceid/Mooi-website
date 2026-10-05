'use client';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import type { Img } from '@/lib/cms/content';

export type BranchPhotos = { name: string; photos: Img[] };

// Tata letak editorial berulang untuk maksimal 8 foto.
const layout = [
  'col-span-2 md:col-span-7 md:row-span-2 aspect-[4/5] md:aspect-auto',
  'md:col-span-5 aspect-[4/5]',
  'md:col-span-5 aspect-[4/5]',
  'md:col-span-4 aspect-[3/4]',
  'md:col-span-4 aspect-[3/4]',
  'md:col-span-4 aspect-[3/4]',
  'md:col-span-6 aspect-[4/5]',
  'md:col-span-6 aspect-[4/5]',
];

export default function BranchGallery({ branches, initial }: { branches: BranchPhotos[]; initial?: string }) {
  const list = branches.filter((b) => b.photos.length);
  const [active, setActive] = useState(list.find((b) => b.name === initial)?.name ?? list[0]?.name ?? '');
  const [zoom, setZoom] = useState<number | null>(null);
  const cur = list.find((b) => b.name === active) ?? list[0];
  const photos = (cur?.photos ?? []).slice(0, 8);

  const step = useCallback((d: number) => setZoom((z) => (z === null ? z : (z + d + photos.length) % photos.length)), [photos.length]);
  useEffect(() => {
    if (zoom === null) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoom(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', key);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', key);
      document.body.style.overflow = '';
    };
  }, [zoom, step]);

  if (!cur) return null;

  return (
    <div>
      {list.length > 1 && (
        <div className="mt-12 flex flex-wrap justify-center gap-2" role="tablist">
          {list.map((b) => (
            <button key={b.name} role="tab" aria-selected={b.name === cur.name} onClick={() => setActive(b.name)}
              className={`rounded-full border px-6 py-2.5 text-[12px] uppercase tracking-[0.2em] transition duration-300 ${b.name === cur.name ? 'border-espresso bg-espresso text-ivory' : 'border-line bg-white/60 text-ink-muted hover:text-ink'}`}>
              {b.name.replace(/^Mooi\s+/, '')}
            </button>
          ))}
        </div>
      )}

      <div key={cur.name} className="step-in mt-12 grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-5">
        {photos.map((p, i) => (
          <button key={p.src + i} type="button" onClick={() => setZoom(i)} aria-label={`Perbesar: ${p.alt}`}
            className={`group relative overflow-hidden rounded-sm bg-ivory-deep ${layout[i % layout.length]}`}>
            <Image src={p.src} alt={p.alt} fill sizes="(min-width:768px) 50vw, 50vw"
              className="object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.05]" />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
          </button>
        ))}
      </div>

      {zoom !== null && photos[zoom] && (
        <div role="dialog" aria-modal="true" aria-label={photos[zoom].alt} onClick={() => setZoom(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-espresso/95 p-4 backdrop-blur-sm">
          <div className="relative h-full max-h-[88vh] w-full max-w-[min(90vw,66vh)]" onClick={(e) => e.stopPropagation()}>
            <Image src={photos[zoom].src} alt={photos[zoom].alt} fill sizes="90vw" className="object-contain" priority />
          </div>
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-[13px] text-ivory/70">
            {photos[zoom].alt} · {zoom + 1}/{photos.length}
          </p>
          {photos.length > 1 && (
            <>
              <button aria-label="Sebelumnya" onClick={(e) => { e.stopPropagation(); step(-1); }}
                className="absolute left-3 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full border border-ivory/30 text-2xl text-ivory hover:bg-white/10">‹</button>
              <button aria-label="Berikutnya" onClick={(e) => { e.stopPropagation(); step(1); }}
                className="absolute right-3 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full border border-ivory/30 text-2xl text-ivory hover:bg-white/10">›</button>
            </>
          )}
          <button aria-label="Tutup" onClick={() => setZoom(null)}
            className="absolute right-4 top-4 h-11 w-11 rounded-full border border-ivory/30 text-xl text-ivory hover:bg-white/10">✕</button>
        </div>
      )}
    </div>
  );
}
