import Hero from '@/components/v2/Hero';
import Prices from '@/components/v2/Prices';
import { BranchSummary, Inside, Stylists } from '@/components/v2/Sections';
import { getContent } from '@/lib/cms/get';
import { menuFor } from '@/lib/booking';

export default async function V2() {
  const c = await getContent();
  const menus = c.branches.items.map((b) => ({ branch: b.name, categories: menuFor(c.booking, b.name) }));
  return (
    <>
      <Hero c={c} />
      <Prices menus={menus} />
      <Stylists c={c} />
      <BranchSummary c={c} />
      <Inside branches={c.branches.items} />
    </>
  );
}
