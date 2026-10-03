import Ornament from './Ornament';

import type { PageHead } from '@/lib/cms/content';

export default function PageHeader({ kicker, title, sub }: PageHead) {
  return (
    <section className="grain relative overflow-hidden bg-espresso px-6 pb-20 pt-40 text-center text-ivory md:px-16 md:pb-28 md:pt-48 lg:px-24">
      <Ornament className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 opacity-40" />
      <div className="relative">
        <p className="kicker justify-center">{kicker}</p>
        <h1 className="mt-6 font-serif text-5xl font-light leading-[1.05] md:text-7xl">
          <span className="line-mask"><span>{title}</span></span>
        </h1>
        {sub && (
          <p className="mx-auto mt-6 max-w-xl text-[15px] font-light leading-relaxed text-ivory/65">{sub}</p>
        )}
      </div>
    </section>
  );
}
