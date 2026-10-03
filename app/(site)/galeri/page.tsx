import Gallery from '@/components/Gallery';
import CTA from '@/components/CTA';
import PageHeader from '@/components/ui/PageHeader';
import { getContent } from '@/lib/cms/get';
import { waLink } from '@/lib/cms/content';
export const metadata = { title: 'Galeri | Mooi Hair Studio & Beauty Bar' };

export default async function Page() {
  const c = await getContent();
  return (
    <>
      <PageHeader {...c.pages.galeri} />
      <Gallery c={c.gallery} />
      <CTA c={c.cta} wa={waLink(c.settings.whatsapp, c.settings.waGreeting)} />
    </>
  );
}
