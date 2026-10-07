'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import WaChooser, { type Contact } from '@/components/ui/WaChooser';
import { P } from './ui';
import { WaIcon } from './BranchStatus';

/** Tombol utama selalu terjangkau jempol di HP. Disembunyikan di halaman booking (punya bar sendiri). */
export default function MobileBar({ contacts, greeting }: { contacts: Contact[]; greeting: string }) {
  if (usePathname()?.startsWith(P('/booking'))) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur md:hidden">
      <div className="flex gap-2">
        <Link href={P('/booking')} className="flex-[1.6] rounded-full bg-espresso py-3.5 text-center text-[15px] font-medium text-ivory">Booking</Link>
        <WaChooser contacts={contacts} greeting={greeting} placement="top-end" wrapClassName="relative flex flex-1"
          label={<><WaIcon className="h-[18px] w-[18px] text-[#1f9d55]" />WhatsApp</>}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-ink/20 bg-white/70 py-3.5 text-[15px] font-medium text-ink" />
      </div>
    </div>
  );
}
