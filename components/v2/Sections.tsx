import Image from 'next/image';
import Link from 'next/link';
import type { Branch, Content, Img } from '@/lib/cms/content';
import { branchWa, safeUrl, waLink } from '@/lib/cms/content';
import { daysLabel, stylistsAt } from '@/lib/booking';
import BranchStrip, { StatusDot } from './BranchStatus';
import { P, btnDark, h2, link, muted, short, wrap } from './ui';

/** Foto asli interior cabang — bukan foto stok. */
export function Inside({ branches }: { branches: Branch[] }) {
  const lists = branches.map((b) => (b.gallery ?? []).map((g) => ({ img: g.image, branch: short(b.name) })).filter((x) => x.img?.src));
  const photos: { img: Img; branch: string }[] = [];
  for (let k = 0; photos.length < 9 && lists.some((l) => l[k]); k++) for (const l of lists) if (l[k] && photos.length < 9) photos.push(l[k]);
  if (photos.length < 3) return null;
  return (
    <section className="py-16 md:py-24">
      <div className={`${wrap} flex flex-wrap items-end justify-between gap-4`}>
        <div>
          <h2 className={h2}>Di dalam Mooi</h2>
          <p className={`mt-3 ${muted}`}>Foto asli dari cabang kami.</p>
        </div>
        <Link href={P('/galeri')} className={link}>Lihat galeri</Link>
      </div>
      <div className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 no-scrollbar md:mx-auto md:grid md:max-w-[1200px] md:grid-cols-4 md:gap-4 md:overflow-visible md:px-10">
        {photos.map((p, k) => (
          <figure key={p.img.src} className={`relative w-[72vw] shrink-0 snap-start overflow-hidden rounded-2xl bg-pearl-deep sm:w-[44vw] md:w-auto ${k === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
            <div className={`relative ${k === 0 ? 'aspect-[4/5] md:aspect-auto md:h-full' : 'aspect-[4/5]'}`}>
              <Image src={p.img.src} alt={p.img.alt} fill sizes="(min-width: 768px) 25vw, 72vw" className="object-cover" />
            </div>
            <figcaption className="absolute bottom-3 left-3 rounded-full bg-pearl/90 px-3 py-1 text-[12px] font-medium">{p.branch}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function Branches({ c, page = false }: { c: Content; page?: boolean }) {
  return (
    <section id="cabang" className="scroll-mt-20 pb-8 pt-16 md:pb-10 md:pt-24">
      <div className={wrap}>
        {page ? <h1 className={h2}>Cabang Mooi</h1> : <h2 className={h2}>Tiga cabang</h2>}
        {page && <p className={`mt-2 ${muted}`}>Alamat, jam buka, dan kontak tiap cabang.</p>}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {c.branches.items.map((b) => {
            const wa = branchWa(b, c.settings.whatsapp);
            const maps = safeUrl(b.maps);
            const ig = safeUrl(b.instagram);
            // Hanya foto asli cabang: bila galeri cabang kosong, foto sampul dianggap foto stok.
            const photo = b.gallery?.length ? (b.image?.src ? b.image : b.gallery[0].image) : null;
            return (
              <article key={b.name} className="flex flex-col overflow-hidden rounded-2xl border border-pearl-line bg-white/55">
                <div className="relative aspect-[16/10] bg-pearl-deep">
                  {photo?.src ? (
                    <Image src={photo.src} alt={photo.alt || b.name} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-pearl-soft to-pearl-deep">
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
                    <Link href={`${P('/booking')}?cabang=${encodeURIComponent(b.name)}`} className={`${btnDark} !px-5 !py-2.5 text-[14px]`}>Booking</Link>
                    {wa && <a href={waLink(wa, `${c.settings.waGreeting} (${b.name})`)} target="_blank" rel="noopener" className="rounded-full border border-cocoa/20 px-4 py-2.5 text-[14px] font-medium hover:border-cocoa">WhatsApp</a>}
                    {maps && <a href={maps} target="_blank" rel="noopener" className="rounded-full border border-cocoa/20 px-4 py-2.5 text-[14px] font-medium hover:border-cocoa">Petunjuk arah</a>}
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

type StylistRow = ReturnType<typeof stylistsAt>[number];

function Avatar({ s, size }: { s: StylistRow; size: 'sm' | 'lg' }) {
  const box = size === 'lg' ? 'h-24 w-24 text-[2rem]' : 'h-16 w-16 text-[1.4rem]';
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-champagne-light to-champagne ${box}`}>
      {s.photo?.src ? (
        <Image src={s.photo.src} alt={s.name} fill sizes={size === 'lg' ? '96px' : '64px'} className="object-cover" />
      ) : (
        <span className="absolute inset-0 grid place-items-center font-display text-bronze" aria-hidden>
          {s.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('')}
        </span>
      )}
    </div>
  );
}

const stylistGroups = (c: Content) =>
  c.branches.items
    .map((b) => ({ branch: b.name, team: stylistsAt(c.booking.stylists, b.name).filter((s) => (s.branches ?? []).some((x) => x?.trim())) }))
    .filter((g) => g.team.length);

/** Ringkasan stylist di beranda. */
export function Stylists({ c }: { c: Content }) {
  const groups = stylistGroups(c);
  if (!groups.length) return null;
  return (
    <section id="stylist" className="scroll-mt-20 bg-pearl-soft py-16 md:py-24">
      <div className={wrap}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className={h2}>Stylist kami</h2>
            <p className={`mt-2 max-w-[34rem] ${muted}`}>Pilih stylist favorit Anda saat booking, atau serahkan pada kami.</p>
          </div>
          <Link href={P('/stylist')} className={link}>Lihat semua stylist</Link>
        </div>
        {groups.map((g) => (
          <div key={g.branch} className="mt-8">
            <p className="text-[14px] font-medium text-bronze-mid">{short(g.branch)}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {g.team.map((s) => (
                <Link key={s.name} href={`${P('/stylist')}#${encodeURIComponent(s.name)}`}
                  className="flex items-center gap-4 rounded-2xl border border-pearl-line bg-white/70 p-4 transition-shadow hover:shadow-[0_14px_30px_-20px_rgba(92,56,32,.5)]">
                  <Avatar s={s} size="sm" />
                  <div className="min-w-0">
                    <p className="font-medium">{s.name}</p>
                    <p className={`text-[14px] ${muted}`}>{[s.role, daysLabel(s)].filter(Boolean).join(' · ')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Halaman Stylist: profil lengkap + booking langsung dengan stylist tsb. */
export function StylistPage({ c }: { c: Content }) {
  const groups = stylistGroups(c);
  return (
    <section className={`${wrap} py-12 md:py-16`}>
      <h1 className={h2}>Stylist Mooi</h1>
      <p className={`mt-2 max-w-[36rem] ${muted}`}>Kenali tim kami, lalu booking langsung dengan stylist pilihan Anda.</p>
      {groups.length === 0 && <p className={`mt-8 ${muted}`}>Profil stylist segera ditampilkan.</p>}
      {groups.map((g) => (
        <div key={g.branch} className="mt-10">
          <h2 className="font-display text-[1.6rem] text-bronze-mid">{short(g.branch)}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {g.team.map((s) => {
              const days = daysLabel(s);
              return (
                <article key={s.name} id={s.name} className="scroll-mt-24 flex gap-5 rounded-[22px] border border-pearl-line bg-white/70 p-5 md:p-6">
                  <Avatar s={s} size="lg" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="font-display text-[1.5rem] leading-tight">{s.name}</h3>
                    <p className={`text-[14px] ${muted}`}>{[s.role, s.years].filter(Boolean).join(' · ')}</p>
                    {days && <p className="mt-1 text-[14px] text-bronze-mid">{days}</p>}
                    {s.bio && <p className={`mt-3 text-[15px] ${muted}`}>{s.bio}</p>}
                    <Link href={`${P('/booking')}?cabang=${encodeURIComponent(g.branch)}&stylist=${encodeURIComponent(s.name)}`}
                      className={`${btnDark} mt-5 self-start !px-5 !py-2.5 text-[14px]`}>
                      Booking dengan {s.name.split(/\s+/)[0]}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}

export function Footer({ c }: { c: Content }) {
  return (
    <footer className="bg-cocoa-dark pb-28 pt-14 text-pearl/80 md:pb-14">
      <div className={wrap}>
        <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <div>
            <Image src="/logo.png" alt="Mooi Hair Studio & Beauty Bar" width={1061} height={618} className="h-12 w-auto" />
            <p className="mt-4 max-w-[18rem] text-[15px] text-pearl/60">{c.settings.footerText}</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {c.branches.items.map((b) => {
              const wa = branchWa(b, c.settings.whatsapp);
              return (
                <div key={b.name} className="text-[14px]">
                  <p className="font-medium text-pearl">{short(b.name)}</p>
                  <p className="mt-2 text-pearl/60">{b.address}</p>
                  <p className="mt-2 whitespace-pre-line">{b.hours}</p>
                  {wa && <a href={waLink(wa, `${c.settings.waGreeting} (${b.name})`)} target="_blank" rel="noopener" className="mt-2 inline-block text-champagne hover:underline">WhatsApp</a>}
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-4 border-t border-cocoa-line pt-6 text-[13px] text-pearl/50">
          <p>© {new Date().getFullYear()} Mooi Hair Studio &amp; Beauty Bar</p>
          <nav className="flex flex-wrap gap-5">
            {[['Harga', '/layanan'], ['Cabang', '/cabang'], ['Galeri', '/galeri'], ['Tentang', '/tentang'], ['Booking', '/booking']].map(([l, h]) => (
              <Link key={h} href={P(h)} className="hover:text-pearl">{l}</Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

export function BranchSummary({ c }: { c: Content }) {
  return (
    <section className="pt-14 md:pt-20">
      <div className={wrap}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className={h2}>Cabang</h2>
          <Link href={P('/cabang')} className={link}>Alamat &amp; jam lengkap</Link>
        </div>
        <div className="mt-6"><BranchStrip branches={c.branches.items} fallbackWa={c.settings.whatsapp} greeting={c.settings.waGreeting} /></div>
      </div>
    </section>
  );
}
