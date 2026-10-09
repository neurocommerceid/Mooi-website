// Kelola akun admin dari panel (hanya super admin).
// Kunci service role tersedia otomatis di Edge Function — tidak pernah dikirim ke browser.
import { createClient } from 'jsr:@supabase/supabase-js@2';

const PERMS = ['konten', 'cabang', 'harga', 'stylist', 'booking', 'reservasi', 'hapus_reservasi'];
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const url = Deno.env.get('SUPABASE_URL')!;
const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

async function findUserId(admin: ReturnType<typeof createClient>, email: string) {
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const hit = data.users.find((u) => (u.email ?? '').toLowerCase() === email);
    if (hit) return hit.id;
    if (data.users.length < 200) return null;
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Metode tidak didukung.' }, 405);

  // Pastikan pemanggil adalah super admin (dicek dengan token miliknya sendiri).
  const auth = req.headers.get('Authorization') ?? '';
  const caller = createClient(url, anonKey, { global: { headers: { Authorization: auth } } });
  const { data: me } = await caller.auth.getUser();
  const { data: isSuper } = await caller.rpc('is_super');
  if (!me.user || isSuper !== true) return json({ error: 'Hanya super admin yang boleh mengelola admin.' }, 403);
  const callerEmail = (me.user.email ?? '').toLowerCase();

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: 'Permintaan tidak valid.' }, 400); }
  const action = String(body.action ?? '');
  const email = String(body.email ?? '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Email tidak valid.' }, 400);

  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

  if (action === 'create') {
    const password = String(body.password ?? '');
    const role = body.role === 'super' ? 'super' : 'staff';
    const permissions = (Array.isArray(body.permissions) ? body.permissions : []).map(String).filter((p) => PERMS.includes(p));
    const branches = (Array.isArray(body.branches) ? body.branches : []).map(String).filter(Boolean).slice(0, 20);
    const name = String(body.name ?? '').trim().slice(0, 80) || null;
    if (password.length < 10) return json({ error: 'Password awal minimal 10 karakter.' }, 400);

    const { data: existing } = await admin.from('admins').select('email').eq('email', email).maybeSingle();
    if (existing) return json({ error: 'Email ini sudah terdaftar sebagai admin.' }, 409);

    // Buat akun login; bila akunnya sudah ada (mis. dibuat manual), cukup setel ulang password.
    const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    if (created.error) {
      const id = await findUserId(admin, email);
      if (!id) return json({ error: created.error.message }, 400);
      const upd = await admin.auth.admin.updateUserById(id, { password, email_confirm: true });
      if (upd.error) return json({ error: upd.error.message }, 400);
    }
    const { error } = await admin.from('admins').insert({ email, name, role, permissions: role === 'super' ? [] : permissions, branches: role === 'super' ? [] : branches, created_by: callerEmail });
    if (error) return json({ error: error.message }, 400);
    return json({ ok: true });
  }

  if (action === 'password') {
    const password = String(body.password ?? '');
    if (password.length < 10) return json({ error: 'Password minimal 10 karakter.' }, 400);
    const id = await findUserId(admin, email);
    if (!id) return json({ error: 'Akun tidak ditemukan.' }, 404);
    const { error } = await admin.auth.admin.updateUserById(id, { password });
    if (error) return json({ error: error.message }, 400);
    return json({ ok: true });
  }

  if (action === 'delete') {
    if (email === callerEmail) return json({ error: 'Tidak bisa menghapus akun sendiri.' }, 400);
    // Hapus hak admin dulu (pengaman "minimal satu super admin" ada di database).
    const { error } = await admin.from('admins').delete().eq('email', email);
    if (error) return json({ error: error.message }, 400);
    const id = await findUserId(admin, email);
    if (id) await admin.auth.admin.deleteUser(id);
    return json({ ok: true });
  }

  return json({ error: 'Aksi tidak dikenal.' }, 400);
});
