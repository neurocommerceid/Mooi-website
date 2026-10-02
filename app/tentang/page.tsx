import Intro from '@/components/Intro';
import CTA from '@/components/CTA';
import PageHeader from '@/components/ui/PageHeader';
import Reveal from '@/components/ui/Reveal';
export const metadata = { title: 'Tentang Kami | Mooi Hair Studio & Beauty Bar' };

const values = [
  ['Konsultasi dulu', 'Kami memahami kebutuhan dan kondisi rambut Anda sebelum memulai tindakan apa pun.'],
  ['Produk pilihan', '[Sebutkan merek/produk yang digunakan Mooi.]'],
  ['Satu standar', 'Pelatihan dan prosedur yang sama di setiap cabang, agar hasilnya konsisten.'],
];

export default function Page() {
  return (
    <>
      <PageHeader kicker="Tentang Kami" title="Cerita di balik Mooi" />
      <Intro />
      <section className="section bg-ivory-soft">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-3">
          {values.map(([t, d], i) => (
            <Reveal key={t} delay={i * 150} className="border-t border-gold/40 pt-8">
              <p className="font-serif text-lg italic text-gold">0{i + 1}</p>
              <h3 className="mt-2 font-serif text-3xl font-light text-ink">{t}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">{d}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
