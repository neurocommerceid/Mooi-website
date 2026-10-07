import localFont from 'next/font/local';

// Font desain baru, disimpan di repo (bukan diunduh dari Google saat build)
// supaya build tidak bergantung pada jaringan. Subset latin, variable font.
export const fraunces = localFont({
  src: [{ path: '../app/fonts/fraunces.woff2', weight: '100 900', style: 'normal' }],
  variable: '--font-fraunces',
  display: 'swap',
});
export const jakarta = localFont({
  src: [{ path: '../app/fonts/plus-jakarta-sans.woff2', weight: '400 600', style: 'normal' }],
  variable: '--font-jakarta',
  display: 'swap',
});

// Komponen lama memakai --font-cormorant / --font-jost; di area desain baru
// (website v2 & panel admin) keduanya diarahkan ke font baru.
export const fontRemap = { '--font-cormorant': 'var(--font-fraunces)', '--font-jost': 'var(--font-jakarta)' } as React.CSSProperties;
