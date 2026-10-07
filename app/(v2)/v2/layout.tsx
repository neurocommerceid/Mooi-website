import { fontRemap, fraunces, jakarta } from '@/lib/fonts';

// Pembungkus semua halaman desain baru: font & palet. Navigasi, footer, dan
// metadata ada di layout per bahasa: (id)/layout.tsx dan en/layout.tsx.
export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={fontRemap} className={`v2 ${fraunces.variable} ${jakarta.variable} min-h-screen bg-pearl font-body text-[15px] font-normal leading-relaxed text-cocoa antialiased md:text-[16px]`}>
      {children}
    </div>
  );
}
