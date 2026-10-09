import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

const pages = ['', '/layanan', '/stylist', '/cabang', '/galeri', '/tentang', '/booking'];

// Setiap halaman tersedia dalam bahasa Indonesia (/) dan Inggris (/en).
export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((p) => {
    const languages = { id: `${SITE_URL}${p || '/'}`, en: `${SITE_URL}/en${p}` };
    return [
      { url: languages.id, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.8, alternates: { languages } },
      { url: languages.en, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: p === '' ? 0.9 : 0.7, alternates: { languages } },
    ];
  });
}
