import { Jost, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const jost = Jost({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-jost' });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${jost.variable} ${cormorant.variable}`}>
      <body className="font-sans font-light">{children}</body>
    </html>
  );
}
