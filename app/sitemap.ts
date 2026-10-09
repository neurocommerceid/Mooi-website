import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { getContent } from '@/lib/cms/get';
import { articles } from '@/components/v2/Articles';

const pages = ['', '/layanan', '/stylist', '/cabang', '/galeri', '/tentang', '/artikel', '/booking'];

// Setiap halaman tersedia dalam bahasa Indonesia (/) dan Inggris (/en).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = articles(await getContent(), 'id').map((a) => ({ path: `/artikel/${a.key}`, date: a.date }));
  return [...pages.map((path) => ({ path, date: '' })), ...posts].flatMap(({ path: p, date }) => {
    const languages = { id: `${SITE_URL}${p || '/'}`, en: `${SITE_URL}/en${p}` };
    const lastModified = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(date) : new Date();
    return [
      { url: languages.id, lastModified, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.8, alternates: { languages } },
      { url: languages.en, lastModified, changeFrequency: 'weekly' as const, priority: p === '' ? 0.9 : 0.7, alternates: { languages } },
    ];
  });
}
