import { services } from '@/lib/data';

export default function Services({ limit }: { limit?: number }) {
  const list = limit ? services.slice(0, limit) : services;
  return (
    <section className="section">
      <div className="mx-auto max-w-[1440px]">
        <div className="text-center">
          <p className="kicker">Layanan Kami</p>
          <h2 className="mt-3 font-serif text-3xl text-ink md:text-[42px]">Dirawat dengan teliti</h2>
          <p className="mt-3 text-[15px] text-ink-muted">
            Setiap layanan dikerjakan oleh stylist berpengalaman dengan produk pilihan.
          </p>
        </div>

        <div className="mt-11 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <article key={s.name} className="card">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#F3DCD1] to-cream-deep text-xl">
                {s.icon}
              </div>
              <h3 className="mt-4 font-serif text-xl text-ink">{s.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.desc}</p>
              <p className="mt-4 text-sm font-semibold text-rose">{s.price}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
