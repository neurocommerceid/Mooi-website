import { StylistPage } from '@/components/v2/Sections';
import { getContent } from '@/lib/cms/get';

export const metadata = { title: 'Stylist' };

export default async function Page() {
  return <StylistPage c={await getContent()} />;
}
