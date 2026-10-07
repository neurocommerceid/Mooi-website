import type { Metadata } from 'next';
import { fontRemap, fraunces, jakarta } from '@/lib/fonts';

export const metadata: Metadata = { title: 'Admin · Mooi', robots: { index: false, follow: false } };

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  // .skin: palet & font desain baru untuk komponen admin (lihat globals.css).
  return (
    <div style={fontRemap} className={`skin ${fraunces.variable} ${jakarta.variable} min-h-screen bg-pearl-soft font-body text-cocoa`}>
      {children}
    </div>
  );
}
