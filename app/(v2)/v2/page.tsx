import Nav from '@/components/v2/Nav';
import Hero from '@/components/v2/Hero';
import Prices from '@/components/v2/Prices';
import MobileBar from '@/components/v2/MobileBar';
import { About, Branches, Footer, Inside, Stylists } from '@/components/v2/Sections';
import { getContent } from '@/lib/cms/get';
import { branchContacts } from '@/lib/cms/content';
import { menuFor } from '@/lib/booking';

export default async function V2() {
  const c = await getContent();
  const menus = c.branches.items.map((b) => ({ branch: b.name, categories: menuFor(c.booking, b.name) }));
  return (
    <>
      <Nav />
      <main>
        <Hero c={c} />
        <Prices menus={menus} />
        <Inside branches={c.branches.items} />
        <Stylists c={c} />
        <Branches c={c} />
        <About c={c} />
      </main>
      <Footer c={c} />
      <MobileBar contacts={branchContacts(c)} greeting={c.settings.waGreeting} />
    </>
  );
}
