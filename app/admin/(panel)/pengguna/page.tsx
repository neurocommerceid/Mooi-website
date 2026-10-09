import { adminProfile, supabaseServer } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { canManageAdmins, type AdminProfile } from '@/lib/access';
import { getContent } from '@/lib/cms/get';
import AdminUsers from '@/components/admin/AdminUsers';

export const metadata = { title: 'Kelola Admin' };

export default async function Pengguna() {
  const me = await adminProfile();
  if (!canManageAdmins(me)) notFound();
  const sb = supabaseServer();
  const [{ data }, content] = await Promise.all([
    sb.from('admins').select('email, name, role, permissions, branches, created_at, created_by').order('created_at'),
    getContent(),
  ]);
  const branches = content.branches.items.map((b) => b.name).filter(Boolean);
  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-4xl">Kelola Admin</h1>
      <p className="mt-2 text-ink-muted">
        Tambah admin baru dan tentukan apa saja yang boleh mereka ubah. Pembatasan dijaga oleh database — admin terbatas tidak bisa
        mengubah bagian di luar haknya meskipun mencoba lewat cara lain.
      </p>
      <AdminUsers me={me!.email} initial={(data ?? []) as (AdminProfile & { created_at: string; created_by: string | null })[]} branches={branches} />
    </div>
  );
}
