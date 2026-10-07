import type { Metadata } from 'next';
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google';

// Pratinjau desain baru — tidak diindeks sampai disetujui.
const fraunces = Fraunces({ subsets: ['latin'], axes: ['opsz', 'SOFT'], style: ['normal', 'italic'], variable: '--font-fraunces' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-jakarta' });

export const metadata: Metadata = {
  title: 'Mooi Hair Studio & Beauty Bar — pratinjau desain',
  robots: { index: false, follow: false },
};
export const revalidate = 3600;

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${fraunces.variable} ${jakarta.variable} min-h-screen bg-ivory font-body font-normal text-[16px] leading-relaxed text-ink antialiased`}>
      {children}
    </div>
  );
}
