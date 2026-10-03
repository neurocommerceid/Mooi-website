import Branches from '@/components/Branches';
import CTA from '@/components/CTA';
import PageHeader from '@/components/ui/PageHeader';
import { getContent } from '@/lib/cms/get';
import { waLink } from '@/lib/cms/content';
export const metadata = { title: 'Lokasi Cabang | Mooi Hair Studio & Beauty Bar' };

export default async function Page() {
  const c = await getContent();
  return (
    <>
      <PageHeader {...c.pages.lokasi} />
      <Branches c={c.branches} whatsapp={c.settings.whatsapp} />
      <CTA c={c.cta} wa={waLink(c.settings.whatsapp, c.settings.waGreeting)} />
    </>
  );
}
