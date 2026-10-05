'use client';
import { usePathname } from 'next/navigation';
import WaChooser, { type Contact } from './ui/WaChooser';

export default function WhatsAppFab({ contacts, greeting }: { contacts: Contact[]; greeting: string }) {
  // Di halaman booking, bar bawah sudah memuat tombol utama — jangan ditutupi.
  if (usePathname()?.startsWith('/booking')) return null;
  return (
    <WaChooser
      variant="fab"
      contacts={contacts}
      greeting={greeting}
      label="WhatsApp"
      className="group flex items-center gap-3 rounded-full border border-gold/40 bg-espresso/90 p-3.5 text-ivory shadow-[0_18px_50px_-15px_rgba(0,0,0,.7)] backdrop-blur-md transition-all duration-500 hover:border-gold lg:pr-6"
    />
  );
}
