import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: 'https://mooihairstudio.com/sitemap.xml', // ganti dengan domain final
  };
}
