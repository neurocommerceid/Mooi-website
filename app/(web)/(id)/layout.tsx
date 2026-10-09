import { Shell, siteMetadata } from '@/components/v2/Pages';

export const revalidate = 3600;
export const generateMetadata = () => siteMetadata('id');

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Shell lang="id">{children}</Shell>;
}
