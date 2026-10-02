import { branches, waLink } from '@/lib/data';

export default function Branches() {
  return (
    <section className="section">
      <div className="mx-auto max-w-[1440px]">
        <div className="text-center">
          <p className="kicker">Lokasi</p>
          <h2 className="mt-3 font-serif text-3xl text-ink md:text-[42px]">Tiga cabang, satu standar</h2>
          <p className="mt-3 text-[15px] text-ink-muted">
            Kunjungi cabang terdekat atau reservasi lebih dulu via WhatsApp.
          </p>
        </div>

        <div className="mt-11 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {branches.map((b) => (
            <article key={b.slug} className="overflow-hidden rounded-2xl border border-line bg-white">
              {/* Ganti dengan foto cabang */}
              <div className="h-40 bg-gradient-to-br from-[#EBD2C5] to-[#C08E78]" />
              <div className="p-6">
                <h3 className="font-serif text-xl text-ink">{b.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {b.address}
                  <br />
                  {b.hours}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a href={waLink(`Halo Mooi ${b.name}, saya mau reservasi.`)} target="_blank" rel="noopener"
                    className="rounded-full border border-[#E3C9BD] px-4 py-2 text-[12.5px] text-rose-deep">WhatsApp</a>
                  {b.maps !== '#' && (
                    <a href={b.maps} target="_blank" rel="noopener"
                      className="rounded-full border border-[#E3C9BD] px-4 py-2 text-[12.5px] text-rose-deep">Google Maps</a>
                  )}
                  <a href={b.ig} target="_blank" rel="noopener"
                    className="rounded-full border border-[#E3C9BD] px-4 py-2 text-[12.5px] text-rose-deep">Instagram</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
