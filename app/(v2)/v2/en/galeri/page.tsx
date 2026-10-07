import { GalleryPage } from '@/components/v2/Pages';

export const metadata = { title: 'Gallery' };

export default function Page({ searchParams }: { searchParams: { cabang?: string } }) {
  return <GalleryPage lang="en" cabang={searchParams.cabang} />;
}
