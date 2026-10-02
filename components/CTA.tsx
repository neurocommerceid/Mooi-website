import Link from 'next/link';
import { waLink } from '@/lib/data';

export default function CTA() {
  return (
    <section className="section text-center">
      <h2 className="font-serif text-3xl text-ink md:text-[44px]">Siap tampil lebih percaya diri?</h2>
      <p className="mt-3 text-[15px] text-ink-muted md:text-[17px]">
        Reservasi sekarang dan pilih cabang terdekat dari lokasi Anda.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <a href={waLink()} target="_blank" rel="noopener" className="btn">Reservasi via WhatsApp</a>
        <Link href="/layanan" className="btn-ghost">Lihat Daftar Harga</Link>
      </div>
    </section>
  );
}
