import { gallery } from '@/lib/data';

export default function Gallery() {
  return (
    <section className="section border-y border-line bg-white">
      <div className="mx-auto max-w-[1440px]">
        <div className="text-center">
          <p className="kicker">Portofolio</p>
          <h2 className="mt-3 font-serif text-3xl text-ink md:text-[42px]">Hasil kerja kami</h2>
          <p className="mt-3 text-[15px] text-ink-muted">Before &amp; after dari pelanggan Mooi di tiga cabang.</p>
        </div>

        {/* Ganti setiap blok dengan foto hasil kerja */}
        <div className="mt-11 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {gallery.map((g) => (
            <div key={g.label}
              className="flex h-40 items-end rounded-xl p-4 text-[11.5px] tracking-widest text-white lg:h-[250px]"
              style={{ backgroundImage: `linear-gradient(150deg, ${g.from}, ${g.to})` }}>
              {g.label.toUpperCase()}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
