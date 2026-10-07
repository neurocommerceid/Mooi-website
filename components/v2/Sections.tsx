import Image from 'next/image';
import Link from 'next/link';
import type { Branch, Content, Img } from '@/lib/cms/content';
import { branchWa, safeUrl, waLink } from '@/lib/cms/content';
import { daysLabel, stylistsAt } from '@/lib/booking';
import { StatusDot } from './BranchStatus';
import { btnDark, h2, link, muted, wrap } from './ui';

const short = (name: string) => name.replace(/^Mooi\s+/i, '');

/** Foto asli interior cabang — bukan foto stok. */
export function Inside({ branches }: { branches: Branch[] }) {
  const lists = branches.map((b) => (b.gallery ?? []).map((g) => ({ img: g.image, branch: short(b.name) })).filter((x) => x.img?.src));
  const photos: { img: Img; branch: string }[] = [];
  for (let k = 0; photos.length < 8 && lists.some((l) => l[k]); k++) for (const l of lists) if (l[k] && photos.length < 8) photos.push(l[k]);
  if (photos.length < 3) return null;
  return (
    <section className="py-16 md:py-24">
      <div className={`${wrap} flex flex-wrap items-end justify-between gap-4`}>
        <div>
          <h2 className={h2}>Di dalam Mooi</h2>
          <p className={`mt-3 ${muted}`}>Foto asli dari cabang kami.</p>
        </div>
        <Link href="/galeri" className={link}>Lihat galeri</Link>
      </div>
      <div className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 no-scrollbar md:mx-auto md:grid md:max-w-[1200px] md:grid-cols-4 md:gap-4 md:overflow-visible md:px-10">
        {photos.map((p, k) => (
          <figure key={p.img.src} className={`relative w-[72vw] shrink-0 snap-start overflow-hidden rounded-2xl bg-ivory-deep sm:w-[44vw] md:w-auto ${k === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
            <div className={`relative ${k === 0 ? 'aspect-[4/5] md:aspect-auto md:h-full' : 'aspect-[4/5]'}`}>
              <Image src={p.img.src} alt={p.img.alt} fill sizes="(min-width: 768px) 25vw, 72vw" className="object-cover" />
            </div>
            <figcaption className="absolute bottom-3 left-3 rounded-full bg-ivory/90 px-3 py-1 text-[12px] font-medium">{p.branch}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function Branches({ c }: { c: Content }) {
  return (
    <section id="cabang" className="scroll-mt-20 pb-8 pt-16 md:pb-10 md:pt-24">
      <div className={wrap}>
        <h2 className={h2}>Tiga cabang</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {c.branches.items.map((b) => {
            const wa = branchWa(b, c.settings.whatsapp);
            const maps = safeUrl(b.maps);
            const ig = safeUrl(b.instagram);
            // Hanya foto asli cabang: bila galeri cabang kosong, foto sampul dianggap foto stok.
            const photo = b.gallery?.length ? (b.image?.src ? b.image : b.gallery[0].image) : null;
            return (
              <article key={b.name} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white/55">
                <div className="relative aspect-[16/10] bg-ivory-deep">
                  {photo?.src ? (
                    <Image src={photo.src} alt={photo.alt || b.name} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center bg-espresso">
                      <Image src="/logo.png" alt="" width={1061} height={618} className="h-20 w-auto opacity-90" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-[1.5rem] leading-tight">{short(b.name)}</h3>
                  <div className="mt-1"><StatusDot b={b} /></div>
                  <p className={`mt-3 text-[15px] ${muted}`}>{b.address}</p>
                  <p className="mt-2 whitespace-pre-line text-[15px]">{b.hours}</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-5">
                    <Link href={`/booking?cabang=${encodeURIComponent(b.name)}`} className={`${btnDark} !px-5 !py-2.5 text-[14px]`}>Booking</Link>
                    {wa && <a href={waLink(wa, `${c.settings.waGreeting} (${b.name})`)} target="_blank" rel="noopener" className="rounded-full border border-ink/20 px-4 py-2.5 text-[14px] font-medium hover:border-ink">WhatsApp</a>}
                    {maps && <a href={maps} target="_blank" rel="noopener" className="rounded-full border border-ink/20 px-4 py-2.5 text-[14px] font-medium hover:border-ink">Petunjuk arah</a>}
                  </div>
                  {ig && <a href={ig} target="_blank" rel="noopener" className={`mt-4 text-[14px] ${link}`}>Instagram {short(b.name)}</a>}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Stylists({ c }: { c: Content }) {
  const groups = c.branches.items
    .map((b) => ({ branch: b.name, team: stylistsAt(c.booking.stylists, b.name).filter((s) => (s.branches ?? []).some((x) => x?.trim())) }))
    .filter((g) => g.team.length);
  if (!groups.length) return null;
  return (
    <section id="stylist" className="scroll-mt-20 bg-espresso py-16 text-ivory md:py-24">
      <div className={wrap}>
        <h2 className={h2}>Pilih stylist Anda</h2>
        <p className="mt-3 max-w-[34rem] text-ivory/70">Saat booking, Anda bisa memilih stylist atau serahkan pada kami.</p>
        {groups.map((g) => (
          <div key={g.branch} className="mt-10">
            <p className="text-[14px] font-medium text-gold-light">{short(g.branch)}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {g.team.map((s) => {
                const days = daysLabel(s);
                return (
                  <div key={s.name} className="flex items-center gap-4 rounded-2xl bg-espresso-soft p-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-espresso-line">
                      {s.photo?.src ? (
                        <Image src={s.photo.src} alt={s.name} fill sizes="64px" className="object-cover" />
                      ) : (
                        <span className="absolute inset-0 grid place-items-center font-display text-[1.4rem] text-gold-light" aria-hidden>
                          {s.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('')}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium">{s.name}</p>
                      <p className="text-[14px] text-ivory/60">{[s.role, days].filter(Boolean).join(' · ')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <Link href="/booking" className="mt-10 inline-flex rounded-full bg-ivory px-6 py-3.5 text-[15px] font-medium text-espresso hover:bg-white">
          Booking dengan stylist pilihan
        </Link>
      </div>
    </section>
  );
}

export function About({ c }: { c: Content }) {
  const shelf = c.branches.items.flatMap((b) => b.gallery ?? []).find((g) => /produk|rak/i.test(g.image?.alt ?? ''))?.image;
  const img = shelf ?? c.intro.image;
  return (
    <section className="py-16 md:py-24">
      <div className={`${wrap} grid gap-10 md:grid-cols-2 md:items-center md:gap-16`}>
        {img?.src && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-ivory-deep md:aspect-[4/5]">
            <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        )}
        <div>
          <h2 className={h2}>Sejak 17 Agustus 2019.</h2>
          <p className={`mt-5 text-[17px] ${muted}`}>
            Berawal dari fokus pada rambut dan beauty, Mooi kini hadir di tiga cabang — Kedoya, Alam Sutera, dan
            Kelapa Gading. Kami bekerja dengan produk profesional seperti Kérastase, Milbon, dan Davines.
          </p>
          <blockquote className="mt-8 border-l-2 border-gold pl-5">
            <p className="font-display text-[1.35rem] leading-snug">&ldquo;{c.testimonial.quote}&rdquo;</p>
            {c.testimonial.author && <footer className={`mt-2 text-[14px] ${muted}`}>{c.testimonial.author}</footer>}
          </blockquote>
          <Link href="/tentang" className={`mt-8 inline-block ${link}`}>Cerita lengkap Mooi</Link>
        </div>
      </div>
    </section>
  );
}

export function Footer({ c }: { c: Content }) {
  return (
    <footer className="bg-espresso pb-28 pt-14 text-ivory/80 md:pb-14">
      <div className={wrap}>
        <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <div>
            <Image src="/logo.png" alt="Mooi Hair Studio & Beauty Bar" width={1061} height={618} className="h-12 w-auto" />
            <p className="mt-4 max-w-[18rem] text-[15px] text-ivory/60">{c.settings.footerText}</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {c.branches.items.map((b) => {
              const wa = branchWa(b, c.settings.whatsapp);
              return (
                <div key={b.name} className="text-[14px]">
                  <p className="font-medium text-ivory">{short(b.name)}</p>
                  <p className="mt-2 text-ivory/60">{b.address}</p>
                  <p className="mt-2 whitespace-pre-line">{b.hours}</p>
                  {wa && <a href={waLink(wa, `${c.settings.waGreeting} (${b.name})`)} target="_blank" rel="noopener" className="mt-2 inline-block text-gold-light hover:underline">WhatsApp</a>}
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-4 border-t border-espresso-line pt-6 text-[13px] text-ivory/50">
          <p>© {new Date().getFullYear()} Mooi Hair Studio &amp; Beauty Bar</p>
          <nav className="flex flex-wrap gap-5">
            {[['Layanan', '/layanan'], ['Galeri', '/galeri'], ['Tentang', '/tentang'], ['Kontak', '/kontak']].map(([l, h]) => (
              <Link key={h} href={h} className="hover:text-ivory">{l}</Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
