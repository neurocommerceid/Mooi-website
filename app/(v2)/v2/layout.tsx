import type { Metadata } from 'next';
import { fontRemap, fraunces, jakarta } from '@/lib/fonts';
import Nav from '@/components/v2/Nav';
import MobileBar from '@/components/v2/MobileBar';
import { Footer } from '@/components/v2/Sections';
import { getContent } from '@/lib/cms/get';
import { branchContacts } from '@/lib/cms/content';

// Judul & deskripsi dari Pengaturan Umum. Pratinjau: tidak diindeks sampai disetujui.
export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getContent();
  return {
    title: { default: settings.siteTitle, template: '%s | Mooi Hair Studio & Beauty Bar' },
    description: settings.siteDescription,
    openGraph: { title: settings.siteTitle, description: settings.siteDescription, type: 'website', locale: 'id_ID' },
    robots: { index: false, follow: false },
  };
}
export const revalidate = 3600;


export default async function V2Layout({ children }: { children: React.ReactNode }) {
  const c = await getContent();
  return (
    <div style={fontRemap} className={`v2 ${fraunces.variable} ${jakarta.variable} min-h-screen bg-pearl font-body text-[15px] font-normal leading-relaxed md:text-[16px] text-cocoa antialiased`}>
      <Nav />
      <main>{children}</main>
      <Footer c={c} />
      <MobileBar contacts={branchContacts(c)} greeting={c.settings.waGreeting} />
    </div>
  );
}
