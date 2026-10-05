import Gallery from '@/components/Gallery';
import CTA from '@/components/CTA';
import PageHeader from '@/components/ui/PageHeader';
import { getContent } from '@/lib/cms/get';
import { branchContacts } from '@/lib/cms/content';
export const metadata = { title: 'Galeri | Mooi Hair Studio & Beauty Bar' };

export default async function Page({ searchParams }: { searchParams: { cabang?: string } }) {
  const c = await getContent();
  return (
    <>
      <PageHeader {...c.pages.galeri} />
      <Gallery c={c.gallery} branches={c.branches.items} initial={searchParams.cabang} />
      <CTA c={c.cta} contacts={branchContacts(c)} greeting={c.settings.waGreeting} />
    </>
  );
}
