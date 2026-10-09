import { GalleryPage } from '@/components/v2/GalleryPage';

export const metadata = { title: 'Galeri' };

export default function Page({ searchParams }: { searchParams: { cabang?: string } }) {
  return <GalleryPage lang="id" cabang={searchParams.cabang} />;
}
