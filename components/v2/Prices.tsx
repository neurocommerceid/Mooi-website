'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Category } from '@/lib/cms/content';
import { rupiah } from '@/lib/booking';
import { btnDark, h2, muted, wrap } from './ui';

const SHOW = 4;

// Harga diambil apa adanya dari menu booking (price list resmi tiap cabang).
export default function Prices({ menus }: { menus: { branch: string; categories: Category[] }[] }) {
  const [i, setI] = useState(0);
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({});
  // Di HP kategori dilipat (kecuali yang pertama) agar halaman tidak memanjang.
  const [unfolded, setUnfolded] = useState<Record<string, boolean>>({});
  // Ikuti pilihan cabang terakhir pengunjung, bila ada.
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mooi-cabang');
      const idx = menus.findIndex((m) => m.branch === saved);
      if (idx >= 0) setI(idx);
    } catch {}
  }, [menus]);
  const pick = (idx: number) => {
    setI(idx);
    setOpenCats({});
    setUnfolded({});
    try { localStorage.setItem('mooi-cabang', menus[idx].branch); } catch {}
  };
  const cur = menus[i];
  if (!cur) return null;
  const cats = cur.categories.filter((c) => c.items?.length);

  return (
    <section id="harga" className="scroll-mt-20 bg-white/55 py-16 md:py-24">
      <div className={wrap}>
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h2 className={h2}>Harga layanan</h2>
            <p className={`mt-3 max-w-[36rem] ${muted}`}>
              Sesuai price list resmi. Harga bisa berbeda antar cabang — pilih cabang Anda. &ldquo;Mulai&rdquo; berarti
              tergantung panjang rambut atau stylist.
            </p>
          </div>
          <div role="tablist" aria-label="Pilih cabang" className="flex w-full gap-1 overflow-x-auto rounded-full bg-ivory-soft p-1 no-scrollbar md:w-auto">
            {menus.map((m, idx) => (
              <button key={m.branch} role="tab" aria-selected={idx === i} onClick={() => pick(idx)}
                className={`flex-1 whitespace-nowrap rounded-full px-4 py-2.5 text-[14px] font-medium transition-colors md:flex-none ${idx === i ? 'bg-espresso text-ivory' : 'text-ink/70 hover:text-ink'}`}>
                {m.branch.replace(/^Mooi\s+/i, '')}
              </button>
            ))}
          </div>
        </div>

        {cats.length === 0 ? (
          <p className={`mt-10 ${muted}`}>Daftar harga cabang ini belum tersedia di website. Tanyakan langsung via WhatsApp cabang.</p>
        ) : (
          <div className="mt-10 columns-1 gap-6 md:columns-2 lg:columns-3">
            {cats.map((cat, ci) => {
              const all = !!openCats[cat.name];
              const items = all ? cat.items : cat.items.slice(0, SHOW);
              const unfold = unfolded[cat.name] ?? ci === 0;
              const min = Math.min(...cat.items.map((x) => x.price).filter((x) => x > 0));
              return (
                <div key={cat.name} className="mb-3 break-inside-avoid rounded-2xl border border-line bg-ivory p-5 md:mb-6">
                  <h3>
                    <button type="button" aria-expanded={unfold} onClick={() => setUnfolded((u) => ({ ...u, [cat.name]: !unfold }))}
                      className="flex w-full items-center justify-between gap-4 text-left md:pointer-events-none md:cursor-default">
                      <span className="font-display text-[1.35rem] leading-tight">{cat.name}</span>
                      <span className="flex items-center gap-2 md:hidden">
                        {!unfold && Number.isFinite(min) && <span className={`whitespace-nowrap text-[13px] ${muted}`}>mulai {rupiah(min)}</span>}
                        <svg viewBox="0 0 24 24" className={`h-5 w-5 transition-transform ${unfold ? 'rotate-180' : ''}`} aria-hidden>
                          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      </span>
                    </button>
                  </h3>
                  <div className={`${unfold ? 'block' : 'hidden'} md:block`}>
                  <ul className="mt-3 divide-y divide-line/80">
                    {items.map((it) => (
                      <li key={it.name} className="py-3">
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="font-medium">{it.name}</span>
                          <span className="shrink-0 text-right tabular-nums">
                            {it.from && <span className={`mr-1 text-[13px] ${muted}`}>mulai</span>}
                            {rupiah(it.price)}
                          </span>
                        </div>
                        {it.note && <p className={`mt-1 text-[13px] leading-snug ${muted}`}>{it.note}</p>}
                      </li>
                    ))}
                  </ul>
                  {cat.items.length > SHOW && (
                    <button onClick={() => setOpenCats((o) => ({ ...o, [cat.name]: !all }))}
                      className="mt-2 text-[14px] font-medium text-[#8A543B] hover:underline">
                      {all ? 'Tampilkan lebih sedikit' : `+ ${cat.items.length - SHOW} layanan lainnya`}
                    </button>
                  )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Link href={`/booking?cabang=${encodeURIComponent(cur.branch)}`} className={btnDark}>
            Booking di {cur.branch.replace(/^Mooi\s+/i, '')}
          </Link>
        </div>
      </div>
    </section>
  );
}
