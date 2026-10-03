'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { defaults, type SectionKey } from '@/lib/cms/content';
import type { Field } from '@/lib/cms/schema';
import { FieldList } from './Fields';

type Obj = Record<string, unknown>;

export default function Editor({ sectionKey, fields, initial }: { sectionKey: SectionKey; fields: Field[]; initial: Obj }) {
  const router = useRouter();
  const [value, setValue] = useState<Obj>(initial);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [state, setState] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const dirty = JSON.stringify(value) !== saved;

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  async function save() {
    setState('saving');
    setMsg('');
    const sb = supabaseBrowser();
    const { data: u } = await sb.auth.getUser();
    const { error } = await sb
      .from('site_content')
      .upsert({ key: sectionKey, data: value, updated_at: new Date().toISOString(), updated_by: u.user?.email ?? null });
    if (error) {
      setState('error');
      setMsg(error.message);
      return;
    }
    const res = await fetch('/api/revalidate', { method: 'POST' });
    setSaved(JSON.stringify(value));
    setState('ok');
    setMsg(res.ok ? 'Tersimpan. Website sudah diperbarui.' : 'Tersimpan, tetapi website belum diperbarui — coba simpan sekali lagi.');
    router.refresh();
  }

  return (
    <div className="mt-8 pb-28">
      <FieldList fields={fields} value={value} onChange={(v) => { setValue(v); setState('idle'); }} />

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-ivory/95 px-5 py-4 backdrop-blur lg:left-[260px] md:px-10">
        <div className="flex max-w-3xl flex-wrap items-center gap-3">
          <button onClick={save} disabled={!dirty || state === 'saving'} className="btn !py-3 disabled:opacity-40">
            {state === 'saving' ? 'Menyimpan…' : 'Simpan'}
          </button>
          {dirty && (
            <button onClick={() => { setValue(JSON.parse(saved)); setState('idle'); }} className="text-[13px] text-ink-muted hover:text-ink">
              Batalkan perubahan
            </button>
          )}
          <button
            onClick={() => confirm('Kembalikan semua isi bagian ini ke bawaan? Perubahan baru disimpan setelah Anda menekan Simpan.') &&
              setValue(defaults[sectionKey] as unknown as Obj)}
            className="ml-auto text-[13px] text-ink-faint hover:text-ink"
          >
            Kembalikan ke bawaan
          </button>
          {msg && <p className={`w-full text-[13px] ${state === 'error' ? 'text-red-700' : 'text-gold-deep'}`}>{msg}</p>}
          {!msg && dirty && <p className="w-full text-[13px] text-ink-faint">Ada perubahan yang belum disimpan.</p>}
        </div>
      </div>
    </div>
  );
}
