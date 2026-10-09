// Isi tiap halaman desain baru, dipakai rute bahasa Indonesia (/v2/...) dan Inggris (/v2/en/...).
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import Hero from './Hero';
import Prices from './Prices';
import Reviews from './Reviews';
import Nav from './Nav';
import MobileBar from './MobileBar';
import { BranchSummary, Branches, Footer, Inside, StylistPage, Stylists } from './Sections';
import { getContent } from '@/lib/cms/get';
import { localize } from '@/lib/cms/localize';
import { branchContacts } from '@/lib/cms/content';
import { menuFor } from '@/lib/booking';
import type { Lang } from '@/lib/i18n';
import { P, btnDark, h2, muted, wrap } from './ui';
import { SITE_URL } from '@/lib/site';

export const load = async (lang: Lang) => localize(await getContent(), lang);
const menusOf = (c: Awaited<ReturnType<typeof load>>) => c.branches.items.map((b) => ({ branch: b.name, categories: menuFor(c.booking, b.name) }));

/** Judul & deskripsi dari Pengaturan Umum / bagian EN. Alamat *.vercel.app tetap noindex (next.config). */
export async function siteMetadata(lang: Lang): Promise<Metadata> {
  const { settings } = await load(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: settings.siteTitle, template: '%s | Mooi Hair Studio & Beauty Bar' },
    description: settings.siteDescription,
    openGraph: { title: settings.siteTitle, description: settings.siteDescription, type: 'website', locale: lang === 'en' ? 'en_US' : 'id_ID' },
    alternates: { languages: { id: P('/', 'id'), en: P('/', 'en') } },
  };
}

export async function Shell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const c = await load(lang);
  return (
    <div lang={lang}>
      <Nav lang={lang} />
      <main>{children}</main>
      <Footer c={c} lang={lang} />
      <MobileBar contacts={branchContacts(c)} greeting={c.settings.waGreeting} lang={lang} />
    </div>
  );
}

export async function HomePage({ lang }: { lang: Lang }) {
  const c = await load(lang);
  return (
    <>
      <Hero c={c} lang={lang} />
      <Prices menus={menusOf(c)} title={c.home.prices.title} sub={c.home.prices.sub} lang={lang} terms={c.en.terms} />
      <Stylists c={c} lang={lang} />
      <Reviews c={c} lang={lang} />
      <BranchSummary c={c} lang={lang} />
      <Inside branches={c.branches.items} title={c.home.inside.title} sub={c.home.inside.sub} lang={lang} />
    </>
  );
}

export async function PricesPage({ lang }: { lang: Lang }) {
  const c = await load(lang);
  return <Prices menus={menusOf(c)} full title={c.home.pages.layanan.title} sub={c.home.pages.layanan.sub} lang={lang} terms={c.en.terms} />;
}

export async function BranchesPage({ lang }: { lang: Lang }) {
  return <Branches c={await load(lang)} page lang={lang} />;
}

export async function StylistsPage({ lang }: { lang: Lang }) {
  return <StylistPage c={await load(lang)} lang={lang} />;
}


const cols = ['', 'md:grid-cols-1', 'md:grid-cols-2', 'md:grid-cols-3'];

export async function AboutPage({ lang }: { lang: Lang }) {
  const c = await load(lang);
  const paras = (c.intro.body ?? '').split(/\r?\n\s*\r?\n/).map((p) => p.trim()).filter(Boolean);
  const photos = c.branches.items.flatMap((b) => (b.gallery ?? []).map((g) => g.image)).filter((i) => i?.src);
  const pic = photos.find((i) => /produk|rak/i.test(i.alt)) ?? photos[0];
  // Nilai yang masih berisi placeholder [..] tidak ditampilkan.
  const values = (c.about.values ?? []).filter((v) => v.title && v.desc && !/\[.*\]/.test(v.desc)).slice(0, 3);
  return (
    <>
      <section className={`${wrap} grid gap-6 py-8 md:grid-cols-2 md:items-start md:gap-16 md:py-16`}>
        <div>
          {c.home.pages.tentang.eyebrow && <p className={`text-[14px] ${muted}`}>{c.home.pages.tentang.eyebrow}</p>}
          <h1 className={`mt-2 ${h2}`}>{c.home.pages.tentang.title}</h1>
          <div className={`mt-4 space-y-4 text-[15px] leading-[1.75] md:mt-6 md:space-y-5 md:text-[17px] md:leading-[1.8] ${muted}`}>
            {paras.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <Link href={P('/booking', lang)} className={`mt-8 ${btnDark}`}>{lang === 'en' ? 'Book now' : 'Booking sekarang'}</Link>
        </div>
        {pic && (
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-pearl-deep md:sticky md:top-24 md:aspect-[4/5] md:rounded-[28px]">
            <Image src={pic.src} alt={pic.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        )}
      </section>
      {values.length > 0 && (
        <section className="bg-white/55 py-10 md:py-20">
          <div className={`${wrap} grid gap-8 ${cols[values.length]}`}>
            {values.map((v) => (
              <div key={v.title} className="border-t border-cocoa/80 pt-5">
                <h2 className="font-display text-[1.35rem] leading-tight md:text-[1.5rem]">{v.title}</h2>
                <p className={`mt-3 ${muted}`}>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      <Inside branches={c.branches.items} title={c.home.inside.title} sub={c.home.inside.sub} lang={lang} />
    </>
  );
}

