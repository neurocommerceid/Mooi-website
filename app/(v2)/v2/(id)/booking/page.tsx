import { BookPage } from '@/components/v2/Pages';

export const metadata = { title: 'Booking' };

export default function Page({ searchParams }: { searchParams: { cabang?: string; stylist?: string } }) {
  return <BookPage lang="id" cabang={searchParams.cabang} stylist={searchParams.stylist} />;
}
