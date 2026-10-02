import type { Metadata } from 'next';
import { Jost, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFab from '@/components/WhatsAppFab';

const jost = Jost({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-jost' });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});

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
    <html lang="id" className={`${jost.variable} ${cormorant.variable}`}>
      <body className="font-sans font-light">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
