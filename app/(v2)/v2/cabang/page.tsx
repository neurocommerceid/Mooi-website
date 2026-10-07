import { Branches } from '@/components/v2/Sections';
import { getContent } from '@/lib/cms/get';

export const metadata = { title: 'Cabang' };

export default async function Page() {
  return <Branches c={await getContent()} page />;
}
