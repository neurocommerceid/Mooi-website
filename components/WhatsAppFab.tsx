import { waLink } from '@/lib/data';

export default function WhatsAppFab() {
  return (
    <a href={waLink()} target="_blank" rel="noopener"
      className="fixed inset-x-5 bottom-4 z-50 rounded-full bg-[#25D366] py-3.5 text-center text-[15px] font-semibold text-white shadow-lg lg:inset-x-auto lg:right-6 lg:bottom-6 lg:px-7">
      Reservasi via WhatsApp
    </a>
  );
}
