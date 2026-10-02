import ReservationForm from '@/components/ReservationForm';
import { branches, waLink } from '@/lib/data';
export const metadata = { title: 'Kontak & Reservasi | Mooi Hair Studio & Beauty Bar' };

export default function Page() {
  return (
    <>
      <section className="bg-gradient-to-br from-cream-soft to-cream-deep px-6 py-14 text-center md:px-16 lg:px-20">
        <p className="kicker">Kontak</p>
        <h1 className="mt-3 font-serif text-3xl text-ink md:text-5xl">Reservasi</h1>
      </section>

      <section className="section">
        <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl text-ink">Isi formulir</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Tim kami akan menghubungi via WhatsApp untuk konfirmasi jadwal.
            </p>
            <div className="mt-5"><ReservationForm /></div>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-ink">Atau langsung hubungi cabang</h2>
            <div className="mt-5 space-y-4">
              {branches.map((b) => (
                <div key={b.slug} className="card">
                  <h3 className="font-serif text-lg text-ink">{b.name}</h3>
                  <p className="mt-1.5 text-sm text-ink-muted">{b.address}<br />{b.hours}</p>
                  <a href={waLink(`Halo Mooi ${b.name}, saya mau reservasi.`)} target="_blank" rel="noopener"
                    className="mt-3 inline-block rounded-full border border-[#E3C9BD] px-4 py-2 text-[12.5px] text-rose-deep">
                    WhatsApp cabang ini
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
