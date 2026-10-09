import { BookPage } from '@/components/v2/BookPage';

export const metadata = { title: 'Book' };

export default function Page({ searchParams }: { searchParams: { cabang?: string; stylist?: string } }) {
  return <BookPage lang="en" cabang={searchParams.cabang} stylist={searchParams.stylist} />;
}
