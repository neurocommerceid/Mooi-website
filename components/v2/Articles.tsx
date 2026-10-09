// Halaman Artikel: daftar (/artikel) dan isi (/artikel/[slug]), bahasa Indonesia & Inggris.
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getContent } from '@/lib/cms/get';
import type { Article, Content } from '@/lib/cms/content';
import { dateFmt, ui, type Lang } from '@/lib/i18n';
import { load } from './Pages';
import { P, btnDark, h2, link, muted, wrap } from './ui';

const filled = (s: string | undefined) => !!s?.trim();

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

type Shown = Article & { href: string; key: string; inLang: Lang };

/** Artikel yang tayang, terbaru dulu, dengan slug unik dan teks sesuai bahasa. */
export function articles(c: Content, lang: Lang): Shown[] {
  const seen = new Set<string>();
  return (c.artikel?.items ?? [])
    .filter((a) => a.published && filled(a.title) && filled(a.body))
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .map((a) => {
      let key = slugify(a.slug || a.title) || 'artikel';
      for (let i = 2; seen.has(key); i++) key = `${slugify(a.slug || a.title)}-${i}`;
      seen.add(key);
      const en = lang === 'en' && filled(a.bodyEn);
      return {
        ...a,
        key,
        href: P(`/artikel/${key}`, lang),
        inLang: en ? 'en' : 'id',
        title: lang === 'en' && filled(a.titleEn) ? a.titleEn : a.title,
        excerpt: lang === 'en' && filled(a.excerptEn) ? a.excerptEn : a.excerpt,
        body: en ? a.bodyEn : a.body,
      } as Shown;
    });
}

const isDate = (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d);
const when = (d: string, lang: Lang) => (isDate(d) ? dateFmt(d, lang, { day: 'numeric', month: 'long', year: 'numeric' }) : '');
const minutes = (body: string) => Math.max(1, Math.round(body.split(/\s+/).length / 200));

function Meta({ a, lang }: { a: Shown; lang: Lang }) {
  const d = when(a.date, lang);
  return (
    <p className={`text-[13px] ${muted}`}>
      {d && <time dateTime={a.date}>{d}</time>}
      {d && ' · '}
      {ui[lang].articles.minutes(minutes(a.body))}
    </p>
  );
}

// **tebal** di dalam teks.
function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={i} className="font-semibold text-cocoa">{part.slice(2, -2)}</strong> : part,
  );
}

/** Format sederhana: paragraf dipisah baris kosong, "## " subjudul, "- " daftar. */
function Body({ text }: { text: string }) {
  const blocks = text.split(/\r?\n\s*\r?\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className={`space-y-5 text-[16px] leading-[1.8] md:text-[17px] ${muted}`}>
      {blocks.map((b, i) => {
        if (b.startsWith('## ')) {
          return <h2 key={i} className="!mt-10 font-display text-[1.3rem] leading-snug text-cocoa md:text-[1.55rem]">{b.slice(3)}</h2>;
        }
        const lines = b.split(/\r?\n/);
        if (lines.every((l) => /^\s*-\s+/.test(l))) {
          return (
            <ul key={i} className="list-disc space-y-1.5 pl-5 marker:text-bronze-light">
              {lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*-\s+/, ''))}</li>)}
            </ul>
          );
        }
        return <p key={i}>{inline(lines.join(' '))}</p>;
      })}
    </div>
  );
}

export async function ArticlesPage({ lang }: { lang: Lang }) {
  const c = await load(lang);
  const list = articles(c, lang);
  const t = ui[lang].articles;
  const head = c.home.pages.artikel;
  return (
    <section className={`${wrap} py-8 md:py-16`}>
      <h1 className={h2}>{head.title}</h1>
      {head.sub && <p className={`mt-2 max-w-xl ${muted}`}>{head.sub}</p>}
      {list.length === 0 ? (
        <p className={`mt-8 ${muted}`}>{t.none}</p>
      ) : (
        <div className="mt-6 grid gap-5 md:mt-10 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {list.map((a) => (
            <Link key={a.key} href={a.href} className="group flex gap-4 md:block">
              <div className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-xl bg-pearl-deep md:aspect-[16/10] md:w-full md:rounded-2xl">
                {a.cover?.src && (
                  <Image src={a.cover.src} alt={a.cover.alt || ''} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 112px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                )}
              </div>
              <div className="min-w-0 md:mt-4">
                <Meta a={a} lang={lang} />
                <h2 className="mt-1 font-display text-[1.1rem] leading-snug text-cocoa md:text-[1.35rem]">{a.title}</h2>
                {a.excerpt && <p className={`mt-1.5 line-clamp-2 text-[14px] md:line-clamp-3 md:text-[15px] ${muted}`}>{a.excerpt}</p>}
                <span className={`mt-2 hidden text-[14px] md:inline-block ${link}`}>{t.read}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

async function find(slug: string, lang: Lang) {
  return articles(await load(lang), lang).find((a) => a.key === slug);
}

export async function articleParams() {
  const c = await getContent();
  return articles(c, 'id').map((a) => ({ slug: a.key }));
}

export async function articleMetadata(slug: string, lang: Lang): Promise<Metadata> {
  const a = await find(slug, lang);
  if (!a) return {};
  return {
    title: a.title,
    description: a.excerpt,
    openGraph: {
      title: a.title, description: a.excerpt, type: 'article', publishedTime: isDate(a.date) ? a.date : undefined,
      images: a.cover?.src ? [a.cover.src] : undefined,
    },
    alternates: { languages: { id: P(`/artikel/${a.key}`, 'id'), en: P(`/artikel/${a.key}`, 'en') } },
  };
}

export async function ArticlePage({ slug, lang }: { slug: string; lang: Lang }) {
  const a = await find(slug, lang);
  if (!a) notFound();
  const t = ui[lang].articles;
  return (
    <article className="pb-4 pt-6 md:pt-12">
      <div className="mx-auto w-full max-w-[720px] px-4">
        <Link href={P('/artikel', lang)} className={`text-[14px] ${link}`}>← {t.back}</Link>
        <h1 className="mt-5 font-display text-[1.75rem] leading-[1.15] tracking-[-0.015em] text-cocoa md:text-[2.6rem]">{a.title}</h1>
        <div className="mt-3"><Meta a={a} lang={lang} /></div>
        {lang === 'en' && a.inLang === 'id' && t.onlyId && <p className={`mt-2 text-[13px] italic ${muted}`}>{t.onlyId}</p>}
      </div>
      {a.cover?.src && (
        <div className="mx-auto mt-6 w-full max-w-[960px] px-4 md:mt-10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-pearl-deep md:rounded-[28px]">
            <Image src={a.cover.src} alt={a.cover.alt || ''} fill priority sizes="(min-width: 960px) 960px, 100vw" className="object-cover" />
          </div>
        </div>
      )}
      <div className="mx-auto mt-8 w-full max-w-[720px] px-4 md:mt-12" lang={a.inLang}>
        <Body text={a.body} />
      </div>
      <div className="mx-auto mt-12 w-full max-w-[720px] px-4">
        <div className="rounded-2xl bg-white/70 p-6 md:p-8">
          <p className="font-display text-[1.25rem] text-cocoa md:text-[1.45rem]">{t.ctaTitle}</p>
          <p className={`mt-1.5 text-[15px] ${muted}`}>{t.ctaSub}</p>
          <Link href={P('/booking', lang)} className={`mt-5 ${btnDark}`}>{ui[lang].bookNow}</Link>
        </div>
      </div>
    </article>
  );
}
