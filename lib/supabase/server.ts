import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { AdminProfile } from '@/lib/access';

export function supabaseServer() {
  const store = cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Dipanggil dari Server Component: cookie diperbarui oleh middleware.
        }
      },
    },
  });
}

// Mengembalikan email admin yang sedang login, atau null.
export async function currentAdmin(): Promise<string | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  const sb = supabaseServer();
  const { data } = await sb.auth.getUser();
  if (!data.user) return null;
  const { data: ok } = await sb.rpc('is_admin');
  return ok ? data.user.email ?? null : null;
}

// Profil admin yang sedang login (peran, hak akses, cabang), atau null.
export async function adminProfile(): Promise<AdminProfile | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  const sb = supabaseServer();
  const { data: u } = await sb.auth.getUser();
  if (!u.user) return null;
  const { data } = await sb.rpc('current_admin');
  if (!data) return null;
  const d = data as Partial<AdminProfile>;
  return {
    email: d.email ?? u.user.email ?? '',
    name: d.name ?? null,
    role: d.role === 'super' ? 'super' : 'staff',
    permissions: (d.permissions ?? []) as AdminProfile['permissions'],
    branches: d.branches ?? [],
  };
}
