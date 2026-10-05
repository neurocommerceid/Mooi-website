import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFab from '@/components/WhatsAppFab';
import { getContent } from '@/lib/cms/get';
import { branchContacts } from '@/lib/cms/content';

// Halaman dibangun ulang paling lambat tiap jam, dan seketika saat admin menyimpan.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getContent();
  return {
    title: settings.siteTitle,
    description: settings.siteDescription,
    openGraph: { title: 'Mooi Hair Studio & Beauty Bar', description: settings.siteDescription, type: 'website', locale: 'id_ID' },
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const c = await getContent();
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer c={c} />
      <WhatsAppFab contacts={branchContacts(c)} greeting={c.settings.waGreeting} />
    </>
  );
}
