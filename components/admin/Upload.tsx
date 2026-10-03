'use client';
import { useRef, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { slugify } from '@/lib/cms/content';

const LIMIT = { image: 8, video: 50 }; // MB

export default function Upload({ kind, onDone }: { kind: 'image' | 'video'; onDone: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<'idle' | 'busy' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function onPick(file: File) {
    if (file.size > LIMIT[kind] * 1024 * 1024) {
      setState('error');
      setMsg(`Maksimal ${LIMIT[kind]} MB. File ini ${(file.size / 1048576).toFixed(1)} MB — kecilkan dulu.`);
      return;
    }
    setState('busy');
    setMsg('');
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
    const base = slugify(file.name.replace(/\.[^.]+$/, '')).slice(0, 40) || 'file';
    const path = `${kind}/${Date.now()}-${base}.${ext}`;
    const sb = supabaseBrowser();
    const { error } = await sb.storage.from('media').upload(path, file, { contentType: file.type, cacheControl: '31536000' });
    if (error) {
      setState('error');
      setMsg(error.message);
      return;
    }
    onDone(sb.storage.from('media').getPublicUrl(path).data.publicUrl);
    setState('idle');
  }

  return (
    <span className="inline-flex flex-col">
      <input
        ref={ref}
        type="file"
        hidden
        accept={kind === 'image' ? 'image/jpeg,image/png,image/webp,image/avif' : 'video/mp4,video/webm'}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
          e.target.value = '';
        }}
      />
      <button type="button" onClick={() => ref.current?.click()} disabled={state === 'busy'}
        className="rounded-lg border border-line bg-white px-3 py-2 text-[13px] transition hover:border-gold disabled:opacity-60">
        {state === 'busy' ? 'Mengunggah…' : kind === 'image' ? 'Unggah foto' : 'Unggah video'}
      </button>
      {state === 'error' && <span className="mt-1 max-w-xs text-[12px] text-red-700">{msg}</span>}
    </span>
  );
}
