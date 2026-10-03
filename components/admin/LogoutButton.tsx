'use client';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/browser';

export default function LogoutButton({ className = '' }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      className={className}
      onClick={async () => {
        await supabaseBrowser().auth.signOut();
        router.replace('/admin/login');
        router.refresh();
      }}
    >
      Keluar
    </button>
  );
}
