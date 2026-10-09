// Alamat resmi website (bisa ditimpa lewat NEXT_PUBLIC_SITE_URL).
// Dipakai untuk sitemap, robots, dan tautan Open Graph.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mooihairstudio.com').replace(/\/+$/, '');
