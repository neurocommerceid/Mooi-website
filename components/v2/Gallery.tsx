'use client';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import type { Img } from '@/lib/cms/content';
import { short } from './ui';

const ratio = ['aspect-[4/5]', 'aspect-square', 'aspect-[3/4]', 'aspect-[4/5]', 'aspect-[3/4]', 'aspect-square', 'aspect-[4/5]', 'aspect-[3/4]'];

export default function Gallery({ branches, initial }: { branches: { name: string; photos: Img[] }[]; initial?: string }) {
  const list = branches.filter((b) => b.photos.length);
  const [active, setActive] = useState(list.find((b) => b.name === initial)?.name ?? list[0]?.name ?? '');
  const [zoom, setZoom] = useState<number | null>(null);
  const photos = (list.find((b) => b.name === active) ?? list[0])?.photos.slice(0, 8) ?? [];

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
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = ''; };
  }, [zoom, step]);

  if (!list.length) return <p className="text-[#6B5A52]">Foto segera ditambahkan.</p>;
  const z = zoom === null ? null : photos[zoom];

  return (
    <>
      {list.length > 1 && (
        <div role="tablist" className="flex gap-2 overflow-x-auto no-scrollbar">
          {list.map((b) => (
            <button key={b.name} role="tab" aria-selected={b.name === active} onClick={() => setActive(b.name)}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors ${b.name === active ? 'bg-espresso text-ivory' : 'border border-line text-ink/70 hover:text-ink'}`}>
              {short(b.name)} <span className="opacity-60">({b.photos.length > 8 ? 8 : b.photos.length})</span>
            </button>
          ))}
        </div>
      )}
      <div key={active} className="mt-6 columns-2 gap-3 md:columns-3 md:gap-4">
        {photos.map((p, i) => (
          <button key={p.src} onClick={() => setZoom(i)} style={{ animationDelay: `${i * 70}ms` }}
            className={`price-card group relative mb-3 block w-full overflow-hidden rounded-2xl bg-ivory-deep md:mb-4 ${ratio[i % ratio.length]}`}
            aria-label={`Perbesar: ${p.alt}`}>
            <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
          </button>
        ))}
      </div>
      {z && (
        <div role="dialog" aria-modal="true" aria-label={z.alt} className="fixed inset-0 z-50 flex flex-col bg-espresso/95 text-ivory" onClick={() => setZoom(null)}>
          <div className="flex items-center justify-between px-5 py-4 text-[14px]">
            <span>{(zoom ?? 0) + 1} / {photos.length}</span>
            <button onClick={() => setZoom(null)} className="rounded-full border border-ivory/30 px-4 py-2">Tutup</button>
          </div>
          <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
            <Image src={z.src} alt={z.alt} fill sizes="100vw" className="object-contain" />
            {photos.length > 1 && [-1, 1].map((d) => (
              <button key={d} onClick={() => step(d)} aria-label={d < 0 ? 'Foto sebelumnya' : 'Foto berikutnya'}
                className={`absolute top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-ivory/15 backdrop-blur hover:bg-ivory/25 ${d < 0 ? 'left-3' : 'right-3'}`}>
                <svg viewBox="0 0 24 24" className={`h-5 w-5 ${d < 0 ? 'rotate-180' : ''}`} aria-hidden><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
            ))}
          </div>
          <p className="px-5 py-4 text-center text-[14px] text-ivory/70">{z.alt}</p>
        </div>
      )}
    </>
  );
}
