import type { Metadata } from 'next';
import localFont from 'next/font/local';

// Font disimpan di repo (bukan diunduh dari Google saat build) supaya build
// tidak bergantung pada jaringan. Subset latin, variable font.
const fraunces = localFont({
  src: [
    { path: '../../fonts/fraunces.woff2', weight: '100 900', style: 'normal' },
  ],
  variable: '--font-fraunces',
  display: 'swap',
});
const jakarta = localFont({
  src: [{ path: '../../fonts/plus-jakarta-sans.woff2', weight: '400 600', style: 'normal' }],
  variable: '--font-jakarta',
  display: 'swap',
});

// Pratinjau desain baru — tidak diindeks sampai disetujui.

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
