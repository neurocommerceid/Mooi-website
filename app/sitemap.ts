import type { MetadataRoute } from 'next';

const base = 'https://mooihairstudio.com'; // ganti dengan domain final

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/booking', '/tentang', '/layanan', '/galeri', '/lokasi', '/kontak'].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: p === '' ? 1 : 0.8,
  }));
}
