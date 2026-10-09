import { notFound } from 'next/navigation';
import { adminProfile, supabaseServer } from '@/lib/supabase/server';
import { defaults, sectionKeys, type SectionKey } from '@/lib/cms/content';
import { schema } from '@/lib/cms/schema';
import { bookingFieldAllowed, canEditSection, isSuper } from '@/lib/access';
import Editor from '@/components/admin/Editor';

export default async function EditSection({ params }: { params: { key: string } }) {
  const key = params.key as SectionKey;
  if (!sectionKeys.includes(key)) notFound();

  const admin = await adminProfile();
  if (!canEditSection(admin, key)) {
    return (
      <div className="max-w-3xl">
        <h1 className="font-serif text-4xl">{schema[key].title}</h1>
        <p className="mt-4 text-ink-muted">Akun Anda tidak punya akses ke bagian ini. Hubungi super admin bila perlu.</p>
      </div>
    );
  }

  const sb = supabaseServer();
  const [{ data }, { data: br }] = await Promise.all([
    sb.from('site_content').select('data').eq('key', key).maybeSingle(),
    sb.from('site_content').select('data').eq('key', 'branches').maybeSingle(),
  ]);
  const value = { ...(defaults[key] as object), ...((data?.data as object) ?? {}) };
  const branches = ((br?.data as { items?: { name: string }[] })?.items ?? defaults.branches.items).map((b) => b.name).filter(Boolean);
  // Bagian Booking: tampilkan hanya kolom sesuai hak akses (database juga menolak perubahan di luar hak).
  const fields = key === 'booking' ? schema[key].fields.filter((f) => bookingFieldAllowed(admin, f.key)) : schema[key].fields;

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-4xl">{schema[key].title}</h1>
      <p className="mt-2 text-ink-muted">{schema[key].desc}</p>
      <Editor sectionKey={key} fields={fields} initial={value} branchNames={branches} allowReset={isSuper(admin)} />
    </div>
  );
}
