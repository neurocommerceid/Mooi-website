'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { PERMS, permLabel, type AdminProfile, type Perm } from '@/lib/access';

type Row = AdminProfile & { created_at: string; created_by: string | null };
type Draft = { name: string; email: string; password: string; role: 'super' | 'staff'; permissions: Perm[]; branches: string[] };

const blank: Draft = { name: '', email: '', password: '', role: 'staff', permissions: [], branches: [] };
const input = 'mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-gold';

/** Saran password acak yang kuat (14 karakter). */
function suggestPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  const a = new Uint32Array(14);
  crypto.getRandomValues(a);
  return Array.from(a, (n) => chars[n % chars.length]).join('');
}

async function callFn(body: Record<string, unknown>) {
  const { data, error } = await supabaseBrowser().functions.invoke('admin-users', { body });
  if (error) {
    // Pesan dari function ada di body respons.
    const ctx = (error as { context?: Response }).context;
    const msg = ctx ? await ctx.json().then((j) => j.error).catch(() => '') : '';
    throw new Error(msg || error.message);
  }
  return data;
}

function AccessPicker({ value, onChange, branches }: { value: Pick<Draft, 'role' | 'permissions' | 'branches'>; onChange: (v: Pick<Draft, 'role' | 'permissions' | 'branches'>) => void; branches: string[] }) {
  const toggle = (p: Perm) =>
    onChange({ ...value, permissions: value.permissions.includes(p) ? value.permissions.filter((x) => x !== p) : [...value.permissions, p] });
  const toggleBranch = (b: string) =>
    onChange({ ...value, branches: value.branches.includes(b) ? value.branches.filter((x) => x !== b) : [...value.branches, b] });
  const hasRes = value.permissions.includes('reservasi') || value.permissions.includes('hapus_reservasi');
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {(['staff', 'super'] as const).map((r) => (
          <button key={r} type="button" onClick={() => onChange({ ...value, role: r })}
            className={`rounded-full border px-4 py-2 text-[14px] ${value.role === r ? 'border-espresso bg-espresso text-ivory' : 'border-line bg-white text-ink-muted'}`}>
            {r === 'super' ? 'Super admin (akses penuh)' : 'Admin terbatas'}
          </button>
        ))}
      </div>
      {value.role === 'super' ? (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[13px] text-amber-900">
          Super admin bisa mengubah semua hal, termasuk harga, serta menambah dan menghapus admin lain.
        </p>
      ) : (
        <div className="mt-4 grid gap-2">
          {PERMS.map((p) => (
            <label key={p.key} className={`flex cursor-pointer gap-3 rounded-xl border p-3 ${value.permissions.includes(p.key) ? 'border-gold bg-[#FBF4EA]' : 'border-line bg-white'}`}>
              <input type="checkbox" className="mt-1 h-4 w-4 accent-[#5C3820]" checked={value.permissions.includes(p.key)} onChange={() => toggle(p.key)} />
              <span>
                <span className="block font-medium">{p.label}</span>
                <span className="block text-[13px] text-ink-muted">{p.desc}</span>
                {p.warn && value.permissions.includes(p.key) && <span className="mt-1 block text-[13px] text-amber-800">⚠ {p.warn}</span>}
              </span>
            </label>
          ))}
          {hasRes && (
            <div className="rounded-xl border border-line bg-white p-3">
              <p className="text-[14px] font-medium">Reservasi cabang mana?</p>
              <p className="text-[13px] text-ink-muted">Tidak dicentang sama sekali = semua cabang.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {branches.map((b) => (
                  <label key={b} className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] ${value.branches.includes(b) ? 'border-gold bg-[#FBF4EA]' : 'border-line'}`}>
                    <input type="checkbox" className="accent-[#5C3820]" checked={value.branches.includes(b)} onChange={() => toggleBranch(b)} />
                    {b.replace(/^Mooi\s+/, '')}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminUsers({ me, initial, branches }: { me: string; initial: Row[]; branches: string[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(blank);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editVal, setEditVal] = useState<Pick<Draft, 'role' | 'permissions' | 'branches'>>({ role: 'staff', permissions: [], branches: [] });

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (draft.role === 'staff' && draft.permissions.length === 0) {
      setMsg({ ok: false, text: 'Pilih minimal satu hak akses untuk admin terbatas.' });
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      await callFn({ action: 'create', ...draft });
      setMsg({ ok: true, text: `Admin ${draft.email} dibuat. Berikan email & password awal kepadanya secara pribadi (bukan di grup).` });
      setDraft(blank);
      router.refresh();
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : 'Gagal membuat admin.' });
    } finally {
      setBusy(false);
    }
  }

  async function saveAccess(email: string) {
    setBusy(true);
    setMsg(null);
    const v = editVal;
    const { error } = await supabaseBrowser().from('admins')
      .update({ role: v.role, permissions: v.role === 'super' ? [] : v.permissions, branches: v.role === 'super' ? [] : v.branches })
      .eq('email', email);
    setBusy(false);
    if (error) return setMsg({ ok: false, text: error.message });
    setEditing(null);
    setMsg({ ok: true, text: `Hak akses ${email} diperbarui. Berlaku saat ia membuka halaman berikutnya.` });
    router.refresh();
  }

  async function resetPassword(email: string) {
    const pw = prompt(`Password baru untuk ${email} (minimal 10 karakter):`, suggestPassword());
    if (!pw) return;
    setBusy(true);
    setMsg(null);
    try {
      await callFn({ action: 'password', email, password: pw });
      setMsg({ ok: true, text: `Password ${email} diganti. Sampaikan password baru kepadanya secara pribadi.` });
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : 'Gagal mengganti password.' });
    } finally {
      setBusy(false);
    }
  }

  async function remove(email: string) {
    if (!confirm(`Hapus akun admin ${email}? Ia tidak akan bisa login lagi.`)) return;
    setBusy(true);
    setMsg(null);
    try {
      await callFn({ action: 'delete', email });
      setMsg({ ok: true, text: `Akun ${email} dihapus.` });
      router.refresh();
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : 'Gagal menghapus admin.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-8 grid gap-10">
      {msg && <p className={`rounded-xl px-4 py-3 text-sm ${msg.ok ? 'bg-emerald-50 text-emerald-900' : 'bg-red-50 text-red-800'}`}>{msg.text}</p>}

      <section>
        <h2 className="font-serif text-2xl">Daftar admin ({initial.length})</h2>
        <div className="mt-4 grid gap-3">
          {initial.map((a) => (
            <article key={a.email} className="rounded-2xl border border-line bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">{a.name || a.email}{a.email === me && <span className="ml-2 text-[12px] text-ink-faint">(Anda)</span>}</p>
                  {a.name && <p className="text-[13px] text-ink-muted">{a.email}</p>}
                  <p className="mt-2 text-[13px]">
                    {a.role === 'super'
                      ? <span className="rounded-full bg-espresso px-2.5 py-1 text-ivory">Super admin</span>
                      : <span className="text-ink-muted">{a.permissions.map(permLabel).join(' · ') || 'Belum ada akses'}{a.branches.length > 0 && ` — cabang: ${a.branches.map((b) => b.replace(/^Mooi\s+/, '')).join(', ')}`}</span>}
                  </p>
                </div>
                {a.email !== me && (
                  <div className="flex flex-wrap gap-2 text-[13px]">
                    <button disabled={busy} onClick={() => { setEditing(editing === a.email ? null : a.email); setEditVal({ role: a.role, permissions: a.permissions, branches: a.branches }); }}
                      className="rounded-full border border-line px-3 py-1.5 hover:border-gold">{editing === a.email ? 'Tutup' : 'Ubah akses'}</button>
                    <button disabled={busy} onClick={() => resetPassword(a.email)} className="rounded-full border border-line px-3 py-1.5 hover:border-gold">Ganti password</button>
                    <button disabled={busy} onClick={() => remove(a.email)} className="rounded-full border border-line px-3 py-1.5 text-red-700 hover:border-red-300">Hapus</button>
                  </div>
                )}
              </div>
              {editing === a.email && (
                <div className="mt-4 border-t border-line pt-4">
                  <AccessPicker value={editVal} onChange={setEditVal} branches={branches} />
                  <button disabled={busy || (editVal.role === 'staff' && !editVal.permissions.length)} onClick={() => saveAccess(a.email)} className="btn mt-4 !py-2.5 disabled:opacity-40">
                    Simpan akses
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl">Tambah admin baru</h2>
        <form onSubmit={create} className="mt-4 grid gap-4 rounded-2xl border border-line bg-white p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm">Nama
              <input className={input} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Mis. Admin Kedoya" />
            </label>
            <label className="text-sm">Email login
              <input className={input} type="email" required value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} placeholder="nama@gmail.com" />
            </label>
          </div>
          <label className="text-sm">Password awal
            <div className="flex gap-2">
              <input className={input} required minLength={10} value={draft.password} onChange={(e) => setDraft({ ...draft, password: e.target.value })} placeholder="Minimal 10 karakter" />
              <button type="button" onClick={() => setDraft({ ...draft, password: suggestPassword() })} className="mt-1.5 shrink-0 rounded-lg border border-line px-3 text-[13px] hover:border-gold">Buat acak</button>
            </div>
            <span className="mt-1 block text-[12px] text-ink-faint">Catat dan berikan secara pribadi. Super admin bisa menggantinya kapan saja.</span>
          </label>
          <div>
            <p className="text-sm">Hak akses</p>
            <div className="mt-2"><AccessPicker value={draft} onChange={(v) => setDraft({ ...draft, ...v })} branches={branches} /></div>
          </div>
          <button disabled={busy} className="btn justify-self-start disabled:opacity-50">{busy ? 'Memproses…' : 'Buat admin'}</button>
        </form>
      </section>
    </div>
  );
}
