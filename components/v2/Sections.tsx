import Image from 'next/image';
import Link from 'next/link';
import type { Branch, Content, Img } from '@/lib/cms/content';
import { branchWa, safeUrl, waLink } from '@/lib/cms/content';
import { daysLabel, stylistsAt } from '@/lib/booking';
import BranchStrip, { StatusDot } from './BranchStatus';
import { P, btnDark, h2, link, muted, short, wrap } from './ui';

/** Foto asli interior cabang — bukan foto stok. */
export function Inside({ branches, title, sub }: { branches: Branch[]; title: string; sub: string }) {
  const lists = branches.map((b) => (b.gallery ?? []).map((g) => ({ img: g.image, branch: short(b.name) })).filter((x) => x.img?.src));
  const photos: { img: Img; branch: string }[] = [];
  for (let k = 0; photos.length < 9 && lists.some((l) => l[k]); k++) for (const l of lists) if (l[k] && photos.length < 9) photos.push(l[k]);
  if (photos.length < 3) return null;
  return (
    <section className="py-10 md:py-24">
      <div className={`${wrap} flex flex-wrap items-end justify-between gap-4`}>
        <div>
          <h2 className={h2}>{title}</h2>
          {sub && <p className={`mt-3 ${muted}`}>{sub}</p>}
        </div>
        <Link href={P('/galeri')} className={link}>Lihat galeri</Link>
      </div>
      <div className="mt-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2 no-scrollbar md:mx-auto md:mt-8 md:grid md:max-w-[1200px] md:grid-cols-4 md:gap-4 md:overflow-visible md:px-10">
        {photos.map((p, k) => (
          <figure key={p.img.src} className={`relative w-[40vw] shrink-0 snap-start overflow-hidden rounded-xl bg-pearl-deep sm:w-[30vw] md:w-auto md:rounded-2xl ${k === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
            <div className={`relative ${k === 0 ? 'aspect-[4/5] md:aspect-auto md:h-full' : 'aspect-[4/5]'}`}>
              <Image src={p.img.src} alt={p.img.alt} fill sizes="(min-width: 768px) 25vw, 72vw" className="object-cover" />
            </div>
            <figcaption className="absolute bottom-2 left-2 rounded-full bg-pearl/90 px-2 py-0.5 text-[10.5px] font-medium md:bottom-3 md:left-3 md:px-3 md:py-1 md:text-[12px]">{p.branch}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function Branches({ c, page = false }: { c: Content; page?: boolean }) {
  return (
    <section id="cabang" className="scroll-mt-20 pb-8 pt-10 md:pb-10 md:pt-24">
      <div className={wrap}>
        {page ? <h1 className={h2}>{c.home.pages.cabang.title}</h1> : <h2 className={h2}>{c.home.branches.title}</h2>}
        {page && c.home.pages.cabang.sub && <p className={`mt-2 ${muted}`}>{c.home.pages.cabang.sub}</p>}
        <div className="mt-5 grid gap-2.5 md:mt-8 md:grid-cols-3 md:gap-6">
          {c.branches.items.map((b) => {
            const wa = branchWa(b, c.settings.whatsapp);
            const maps = safeUrl(b.maps);
            const ig = safeUrl(b.instagram);
            // Hanya foto asli cabang: bila galeri cabang kosong, foto sampul dianggap foto stok.
            const photo = b.gallery?.length ? (b.image?.src ? b.image : b.gallery[0].image) : null;
            return (
              <article key={b.name} className="grid grid-cols-[92px_1fr] overflow-hidden rounded-2xl border border-pearl-line bg-white/55 md:flex md:flex-col">
                <div className="relative min-h-full bg-pearl-deep md:aspect-[16/10] md:min-h-0">
                  {photo?.src ? (
                    <Image src={photo.src} alt={photo.alt || b.name} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-pearl-soft to-pearl-deep">
                      <Image src="/logo.png" alt="" width={1061} height={618} className="h-10 w-auto opacity-90 md:h-20" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-3.5 md:p-5">
                  <h3 className="font-display text-[1.15rem] leading-tight md:text-[1.5rem]">{short(b.name)}</h3>
                  <div className="mt-1"><StatusDot b={b} /></div>
                  <p className={`mt-1.5 line-clamp-2 text-[12.5px] leading-snug md:mt-3 md:line-clamp-none md:text-[15px] ${muted}`}>{b.address}</p>
                  <p className="mt-1 whitespace-pre-line text-[12.5px] md:mt-2 md:text-[15px]">{b.hours}</p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-3 md:gap-2 md:pt-5">
                    <Link href={`${P('/booking')}?cabang=${encodeURIComponent(b.name)}`} className={`${btnDark} !px-3.5 !py-1.5 !text-[13px] md:!px-5 md:!py-2.5 md:!text-[14px]`}>Booking</Link>
                    {wa && <a href={waLink(wa, `${c.settings.waGreeting} (${b.name})`)} target="_blank" rel="noopener" className="rounded-full border border-cocoa/20 px-3 py-1.5 text-[13px] font-medium hover:border-cocoa md:px-4 md:py-2.5 md:text-[14px]">WhatsApp</a>}
                    {maps && <a href={maps} target="_blank" rel="noopener" className="rounded-full border border-cocoa/20 px-3 py-1.5 text-[13px] font-medium hover:border-cocoa md:px-4 md:py-2.5 md:text-[14px]">Petunjuk arah</a>}
                  </div>
                  {ig && <a href={ig} target="_blank" rel="noopener" className={`mt-2.5 text-[13px] md:mt-4 md:text-[14px] ${link}`}>Instagram {short(b.name)}</a>}
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
  const box = size === 'lg' ? 'h-16 w-16 text-[1.4rem] md:h-24 md:w-24 md:text-[2rem]' : 'h-12 w-12 text-[1.1rem] sm:h-16 sm:w-16 sm:text-[1.4rem]';
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
    <section id="stylist" className="scroll-mt-20 bg-pearl-soft py-10 md:py-24">
      <div className={wrap}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className={h2}>{c.home.stylists.title}</h2>
            {c.home.stylists.sub && <p className={`mt-2 max-w-[34rem] ${muted}`}>{c.home.stylists.sub}</p>}
          </div>
          <Link href={P('/stylist')} className={link}>Lihat semua stylist</Link>
        </div>
        {groups.map((g) => (
          <div key={g.branch} className="mt-5 md:mt-8">
            <p className="text-[13px] font-medium text-bronze-mid md:text-[14px]">{short(g.branch)}</p>
            <div className="mt-2.5 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
              {g.team.map((s) => (
                <Link key={s.name} href={`${P('/stylist')}#${encodeURIComponent(s.name)}`}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-pearl-line bg-white/70 p-3 text-center transition-shadow sm:flex-row sm:gap-4 sm:p-4 sm:text-left hover:shadow-[0_14px_30px_-20px_rgba(92,56,32,.5)]">
                  <Avatar s={s} size="sm" />
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium md:text-[16px]">{s.name}</p>
                    <p className={`text-[12px] leading-snug md:text-[14px] ${muted}`}>{[s.role, daysLabel(s)].filter(Boolean).join(' · ')}</p>
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
    <section className={`${wrap} py-8 md:py-16`}>
      <h1 className={h2}>{c.home.pages.stylist.title}</h1>
      {c.home.pages.stylist.sub && <p className={`mt-2 max-w-[36rem] ${muted}`}>{c.home.pages.stylist.sub}</p>}
      {groups.length === 0 && <p className={`mt-8 ${muted}`}>Profil stylist segera ditampilkan.</p>}
      {groups.map((g) => (
        <div key={g.branch} className="mt-6 md:mt-10">
          <h2 className="font-display text-[1.25rem] text-bronze-mid md:text-[1.6rem]">{short(g.branch)}</h2>
          <div className="mt-3 grid gap-2.5 md:mt-4 md:grid-cols-2 md:gap-4">
            {g.team.map((s) => {
              const days = daysLabel(s);
              return (
                <article key={s.name} id={s.name} className="scroll-mt-24 flex gap-3.5 rounded-2xl border border-pearl-line bg-white/70 p-3.5 md:gap-5 md:rounded-[22px] md:p-6">
                  <Avatar s={s} size="lg" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="font-display text-[1.15rem] leading-tight md:text-[1.5rem]">{s.name}</h3>
                    <p className={`text-[14px] ${muted}`}>{[s.role, s.years].filter(Boolean).join(' · ')}</p>
                    {days && <p className="mt-1 text-[14px] text-bronze-mid">{days}</p>}
                    {s.bio && <p className={`mt-3 text-[15px] ${muted}`}>{s.bio}</p>}
                    <Link href={`${P('/booking')}?cabang=${encodeURIComponent(g.branch)}&stylist=${encodeURIComponent(s.name)}`}
                      className={`${btnDark} mt-3 self-start !px-3.5 !py-1.5 !text-[13px] md:mt-5 md:!px-5 md:!py-2.5 md:!text-[14px]`}>
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
    <footer className="bg-cocoa-dark pb-28 pt-10 text-pearl/80 md:pb-14 md:pt-14">
      <div className={wrap}>
        <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <div>
            <Image src="/logo.png" alt="Mooi Hair Studio & Beauty Bar" width={1061} height={618} className="h-12 w-auto" />
            <p className="mt-4 max-w-[18rem] text-[15px] text-pearl/60">{c.settings.footerText}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 sm:gap-8">
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
    <section className="pt-10 md:pt-20">
      <div className={wrap}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className={h2}>{c.home.branches.title}</h2>
            {c.home.branches.sub && <p className={`mt-2 ${muted}`}>{c.home.branches.sub}</p>}
          </div>
          <Link href={P('/cabang')} className={link}>Alamat &amp; jam lengkap</Link>
        </div>
        <div className="mt-4 md:mt-6"><BranchStrip branches={c.branches.items} fallbackWa={c.settings.whatsapp} greeting={c.settings.waGreeting} /></div>
      </div>
    </section>
  );
}
