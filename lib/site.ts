// Alamat resmi website. Setel NEXT_PUBLIC_SITE_URL di Vercel ke domain Mooi
// (mis. https://www.namadomain.com). Dipakai untuk sitemap, robots, dan tautan Open Graph.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mooi-website-nu.vercel.app').replace(/\/+$/, '');
