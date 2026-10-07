'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import WaChooser, { type Contact } from '@/components/ui/WaChooser';
import { ui, type Lang } from '@/lib/i18n';
import { P } from './ui';
import { WaIcon } from './BranchStatus';

/** Tombol utama selalu terjangkau jempol di HP. Disembunyikan di halaman booking (punya bar sendiri). */
export default function MobileBar({ contacts, greeting, lang }: { contacts: Contact[]; greeting: string; lang: Lang }) {
  const t = ui[lang];
  if (usePathname()?.startsWith(P('/booking', lang))) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-pearl-line bg-pearl/95 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur md:hidden">
      <div className="flex gap-2">
        <Link href={P('/booking', lang)} className="btn-bronze flex-[1.6] rounded-full py-3.5 text-center text-[15px] font-medium text-pearl">{t.nav.book}</Link>
        <WaChooser contacts={contacts} greeting={greeting} placement="top-end" wrapClassName="relative flex flex-1"
          heading={t.chatWith} pickLabel={t.chatPick}
          label={<><WaIcon className="h-[18px] w-[18px] text-[#1f9d55]" />WhatsApp</>}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-cocoa/20 bg-white/70 py-3.5 text-[15px] font-medium text-cocoa" />
      </div>
    </div>
  );
}
