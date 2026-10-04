/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' }],
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
