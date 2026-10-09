/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' }],
  },
  // Alamat lama tetap berfungsi: pratinjau /v2 dan halaman desain lama.
  async redirects() {
    return [
      { source: '/v2', destination: '/', permanent: true },
      { source: '/v2/:path*', destination: '/:path*', permanent: true },
      { source: '/lokasi', destination: '/cabang', permanent: true },
      { source: '/kontak', destination: '/cabang', permanent: true },
      { source: '/en/lokasi', destination: '/en/cabang', permanent: true },
      { source: '/en/kontak', destination: '/en/cabang', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        // Alamat bawaan Vercel (*.vercel.app) adalah pratinjau: jangan diindeks
        // Google. Domain resmi Mooi tidak terkena aturan ini.
        source: '/:path*',
        has: [{ type: 'host', value: '(?<sub>.*)\\.vercel\\.app' }],
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/admin/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
};
export default nextConfig;
