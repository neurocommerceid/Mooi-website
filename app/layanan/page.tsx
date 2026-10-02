import Services from '@/components/Services';
import CTA from '@/components/CTA';
import PageHeader from '@/components/ui/PageHeader';
export const metadata = { title: 'Layanan & Harga | Mooi Hair Studio & Beauty Bar' };

export default function Page() {
  return (
    <>
      <PageHeader
        kicker="Layanan"
        title="Layanan & Harga"
        sub="Harga dapat berbeda sesuai panjang rambut dan kondisi. Konsultasi sebelum setiap tindakan."
      />
      <Services />
      <CTA />
    </>
  );
}
