import type { Metadata } from 'next';
import { Poppins, Lora } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFab from '@/components/WhatsAppFab';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-poppins',
});
const lora = Lora({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-lora' });

export const metadata: Metadata = {
  title: 'Mooi Hair Studio & Beauty Bar | Kedoya · Alam Sutera · Kelapa Gading',
  description:
    'Hair studio dan beauty bar dengan tiga cabang di Jakarta & Tangerang. Hair cut, coloring, smoothing, hair spa, dan beauty bar oleh stylist profesional.',
  openGraph: {
    title: 'Mooi Hair Studio & Beauty Bar',
    description: 'Perawatan rambut dan kecantikan oleh tim profesional. Tiga cabang di Jakarta & Tangerang.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${poppins.variable} ${lora.variable}`}>
      <body className="font-sans">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
