'use client';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Category } from '@/lib/cms/content';
import { rupiah } from '@/lib/booking';
import { P, h2, muted, short, wrap } from './ui';

type Menu = { branch: string; categories: Category[] };

const Sparkle = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path fill="currentColor" d="M12 0c.6 5.7 2.3 9.4 12 12-9.7 2.6-11.4 6.3-12 12-.6-5.7-2.3-9.4-12-12C9.7 9.4 11.4 5.7 12 0Z" />
  </svg>
);

/**
 * Harga per cabang, diambil apa adanya dari menu booking (price list resmi).
 * Kartu digeser ke samping; chip kategori mengikuti posisi geser.
 * `full` menambahkan daftar lengkap di bawah carousel (halaman Harga).
 */
export default function Prices({ menus, full = false }: { menus: Menu[]; full?: boolean }) {
  const [bi, setBi] = useState(0);
  const [active, setActive] = useState(0); // kartu paling kiri yang terlihat
  const [progress, setProgress] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const idx = menus.findIndex((m) => m.branch === localStorage.getItem('mooi-cabang'));
      if (idx >= 0) setBi(idx);
    } catch {}
  }, [menus]);

  const cur = menus[bi];
  const cats = useMemo(() => (cur?.categories ?? []).filter((c) => c.items?.length), [cur]);
  const cards = useMemo(() => cats.flatMap((c) => c.items.map((it) => ({ cat: c.name, it }))), [cats]);
  const firstOf = useMemo(() => cats.map((c) => cards.findIndex((x) => x.cat === c.name)), [cats, cards]);

  const pick = (idx: number) => {
    setBi(idx);
    try { localStorage.setItem('mooi-cabang', menus[idx].branch); } catch {}
    track.current?.scrollTo({ left: 0 });
  };

  const onScroll = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
    const kids = Array.from(el.children) as HTMLElement[];
    const left = el.getBoundingClientRect().left;
    const i = kids.findIndex((k) => k.getBoundingClientRect().right - left > 40);
    setActive(Math.max(0, i));
  }, []);
  useEffect(() => { onScroll(); }, [bi, onScroll]);

  const jump = (cardIdx: number) => {
    const el = track.current;
    const kid = el?.children[cardIdx] as HTMLElement | undefined;
    if (el && kid) el.scrollTo({ left: kid.offsetLeft - el.offsetLeft, behavior: 'smooth' });
  };
  const page = (dir: number) => track.current?.scrollBy({ left: dir * (track.current.clientWidth * 0.85), behavior: 'smooth' });

  if (!cur) return null;
  const activeCat = cards[active]?.cat;
  const bookHref = `${P('/booking')}?cabang=${encodeURIComponent(cur.branch)}`;

  return (
    <section id="harga" className="scroll-mt-20 py-14 md:py-20">
      <div className={wrap}>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            {full
              ? <h1 className={h2}>Harga layanan</h1>
              : <h2 className={h2}>Harga layanan</h2>}
            <p className={`mt-2 max-w-[34rem] ${muted}`}>Sesuai price list resmi tiap cabang. Geser untuk melihat semua.</p>
          </div>
          <div role="tablist" aria-label="Pilih cabang" className="flex w-full gap-1 overflow-x-auto rounded-full bg-ivory-soft p-1 no-scrollbar sm:w-auto">
            {menus.map((m, idx) => (
              <button key={m.branch} role="tab" aria-selected={idx === bi} onClick={() => pick(idx)}
                className={`flex-1 whitespace-nowrap rounded-full px-4 py-2.5 text-[14px] font-medium transition-colors sm:flex-none ${idx === bi ? 'bg-espresso text-ivory' : 'text-ink/70 hover:text-ink'}`}>
                {short(m.branch)}
              </button>
            ))}
          </div>
        </div>

        {cats.length > 0 && (
          <div className="mt-6 flex items-center gap-3">
            <div className="flex flex-1 gap-2 overflow-x-auto no-scrollbar">
              {cats.map((c, ci) => (
                <button key={c.name} onClick={() => jump(firstOf[ci])}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-[14px] transition-colors ${activeCat === c.name ? 'border-gold-deep bg-gold/10 text-ink' : 'border-line text-ink/65 hover:text-ink'}`}>
                  {c.name}
                </button>
              ))}
            </div>
            <div className="hidden shrink-0 gap-2 md:flex">
              {[-1, 1].map((d) => (
                <button key={d} onClick={() => page(d)} aria-label={d < 0 ? 'Sebelumnya' : 'Berikutnya'}
                  className="grid h-11 w-11 place-items-center rounded-full border border-ink/20 transition-colors hover:border-ink hover:bg-white">
                  <svg viewBox="0 0 24 24" className={`h-5 w-5 ${d < 0 ? 'rotate-180' : ''}`} aria-hidden><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {cats.length === 0 ? (
        <p className={`${wrap} mt-8 ${muted}`}>Daftar harga cabang ini belum tersedia di website. Tanyakan langsung via WhatsApp cabang.</p>
      ) : (
        <>
          <div ref={track} onScroll={onScroll} key={cur.branch}
            className="mt-6 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 no-scrollbar md:scroll-px-10 md:px-10 xl:scroll-px-[calc((100vw-1200px)/2+40px)] xl:px-[calc((100vw-1200px)/2+40px)]">
            {cards.map(({ cat, it }, k) => (
              <article key={`${cat}-${it.name}`} style={{ animationDelay: `${Math.min(k, 6) * 60}ms` }}
                className={`price-card group flex min-h-[250px] w-[74vw] max-w-[280px] shrink-0 snap-start flex-col rounded-[22px] border bg-white/70 p-6 sm:w-[280px] ${k === active ? 'is-active border-gold/60' : 'border-line'}`}>
                <p className="text-[13px] text-[#8A543B]">{cat}</p>
                <h3 className="mt-2 font-display text-[1.4rem] leading-tight">{it.name}</h3>
                {it.note && <p className={`mt-2 line-clamp-3 text-[13px] leading-snug ${muted}`}>{it.note}</p>}
                <div className="mt-auto pt-6">
                  <div className="relative inline-block">
                    {it.from && <span className={`block text-[13px] ${muted}`}>mulai</span>}
                    <span className="font-display text-[1.9rem] leading-none tabular-nums">{rupiah(it.price)}</span>
                    <span className="sparkles pointer-events-none absolute -right-7 -top-4 h-11 w-9 text-gold-deep" aria-hidden>
                      <Sparkle className="twinkle absolute right-0 top-0 h-4 w-4" />
                      <Sparkle className="twinkle absolute right-5 top-4 h-2.5 w-2.5 [animation-delay:.6s]" />
                      <Sparkle className="twinkle absolute right-1 top-7 h-3 w-3 [animation-delay:1.2s]" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className={`${wrap} mt-2`}>
            <div className="h-[2px] w-full overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-gold-deep transition-[width] duration-200" style={{ width: `${Math.max(8, progress * 100)}%` }} />
            </div>
          </div>
        </>
      )}

      {full && cats.length > 0 && (
        <div className={`${wrap} mt-16`}>
          <h2 className="font-display text-[1.75rem] leading-tight">Daftar lengkap · {short(cur.branch)}</h2>
          <div className="mt-6 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {cats.map((c) => (
              <div key={c.name}>
                <h3 className="border-b border-ink/80 pb-2 text-[15px] font-semibold">{c.name}</h3>
                <ul>
                  {c.items.map((it) => (
                    <li key={it.name} className="border-b border-line py-3">
                      <div className="flex items-baseline justify-between gap-4">
                        <span>{it.name}</span>
                        <span className="shrink-0 tabular-nums">{it.from && <span className={`mr-1 text-[13px] ${muted}`}>mulai</span>}{rupiah(it.price)}</span>
                      </div>
                      {it.note && <p className={`mt-1 text-[13px] leading-snug ${muted}`}>{it.note}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Link href={bookHref} className="mt-10 hidden rounded-full md:inline-flex bg-espresso px-6 py-3.5 text-[15px] font-medium text-ivory hover:bg-[#3A2C27]">
            Booking di {short(cur.branch)}
          </Link>
        </div>
      )}
    </section>
  );
}
