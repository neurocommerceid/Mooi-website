import Image from 'next/image';
import Link from 'next/link';
import { Inside } from '@/components/v2/Sections';
import { getContent } from '@/lib/cms/get';
import { P, btnDark, h2, muted, wrap } from '@/components/v2/ui';

export const metadata = { title: 'Tentang Mooi' };

const cols = ['', 'md:grid-cols-1', 'md:grid-cols-2', 'md:grid-cols-3'];

export default async function Page() {
  const c = await getContent();
  const paras = (c.intro.body ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
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
          <Link href={P('/booking')} className={`mt-8 ${btnDark}`}>Booking sekarang</Link>
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
                <h2 className="font-display text-[1.5rem] leading-tight">{v.title}</h2>
                <p className={`mt-3 ${muted}`}>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      <Inside branches={c.branches.items} title={c.home.inside.title} sub={c.home.inside.sub} />
    </>
  );
}
