import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin · Mooi', robots: { index: false, follow: false } };

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-ivory-soft text-ink">{children}</div>;
}
