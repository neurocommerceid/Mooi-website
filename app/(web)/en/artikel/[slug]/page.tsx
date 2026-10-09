import { ArticlePage, articleMetadata, articleParams } from '@/components/v2/Articles';

export const generateStaticParams = articleParams;
export const generateMetadata = ({ params }: { params: { slug: string } }) => articleMetadata(params.slug, 'en');

export default function Page({ params }: { params: { slug: string } }) {
  return <ArticlePage slug={params.slug} lang="en" />;
}
