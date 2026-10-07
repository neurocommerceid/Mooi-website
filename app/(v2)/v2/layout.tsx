import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Nav from '@/components/v2/Nav';
import MobileBar from '@/components/v2/MobileBar';
import { Footer } from '@/components/v2/Sections';
import { getContent } from '@/lib/cms/get';
import { branchContacts } from '@/lib/cms/content';

// Font disimpan di repo (bukan diunduh dari Google saat build) supaya build
// tidak bergantung pada jaringan. Subset latin, variable font.
const fraunces = localFont({
  src: [{ path: '../../fonts/fraunces.woff2', weight: '100 900', style: 'normal' }],
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
  title: { default: 'Mooi Hair Studio & Beauty Bar', template: '%s | Mooi Hair Studio & Beauty Bar' },
  robots: { index: false, follow: false },
};
export const revalidate = 3600;

// Komponen lama yang dipakai ulang (mis. alur booking) memakai --font-cormorant
// dan --font-jost; di sini keduanya diarahkan ke font baru.
const remap = { '--font-cormorant': 'var(--font-fraunces)', '--font-jost': 'var(--font-jakarta)' } as React.CSSProperties;

export default async function V2Layout({ children }: { children: React.ReactNode }) {
  const c = await getContent();
  return (
    <div style={remap} className={`v2 ${fraunces.variable} ${jakarta.variable} min-h-screen bg-pearl font-body text-[16px] font-normal leading-relaxed text-cocoa antialiased`}>
      <Nav />
      <main>{children}</main>
      <Footer c={c} />
      <MobileBar contacts={branchContacts(c)} greeting={c.settings.waGreeting} />
    </div>
  );
}
