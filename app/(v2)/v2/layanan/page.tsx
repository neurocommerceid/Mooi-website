import Prices from '@/components/v2/Prices';
import { getContent } from '@/lib/cms/get';
import { menuFor } from '@/lib/booking';

export const metadata = { title: 'Harga Layanan' };

export default async function Page() {
  const c = await getContent();
  const menus = c.branches.items.map((b) => ({ branch: b.name, categories: menuFor(c.booking, b.name) }));
  return <Prices menus={menus} full />;
}
