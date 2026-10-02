export const metadata = { title: 'Tentang Kami | Mooi Hair Studio & Beauty Bar' };

export default function Page() {
  return (
    <>
      <section className="bg-gradient-to-br from-cream-soft to-cream-deep px-6 py-14 text-center md:px-16 lg:px-20">
        <p className="kicker">Tentang Kami</p>
        <h1 className="mt-3 font-serif text-3xl text-ink md:text-5xl">Cerita di balik Mooi</h1>
      </section>

      <section className="section">
        <div className="mx-auto grid max-w-[1100px] items-center gap-10 lg:grid-cols-2">
          {/* Ganti dengan foto tim / interior */}
          <div className="h-[320px] rounded-2xl bg-gradient-to-br from-[#EBD2C5] to-[#C08E78]" />
          <div>
            <h2 className="font-serif text-3xl text-ink">Perawatan yang dikerjakan dengan teliti</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
              [Tulis cerita singkat berdirinya Mooi: tahun berdiri, latar belakang, dan nilai yang
              dipegang. Bagian ini diisi dari materi yang disediakan Mooi.]
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
              [Jelaskan standar layanan yang sama di ketiga cabang, pelatihan stylist, dan produk
              yang digunakan.]
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
