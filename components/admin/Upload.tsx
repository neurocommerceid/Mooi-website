'use client';
import { useRef, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { slugify } from '@/lib/cms/content';
import { compressImage, mb } from '@/lib/compress';

// Foto asli boleh besar (langsung dari kamera) karena dikompres dulu.
// Video tidak dikompres di browser, jadi batasnya ketat.
const LIMIT = { image: 30, video: 50 }; // MB
const VIDEO_WARN = 15; // MB

export default function Upload({ kind, onDone }: { kind: 'image' | 'video'; onDone: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<'idle' | 'busy' | 'error'>('idle');
  const [step, setStep] = useState('');
  const [msg, setMsg] = useState('');

  async function onPick(picked: File) {
    if (picked.size > LIMIT[kind] * 1048576) {
      setState('error');
      setMsg(`Maksimal ${LIMIT[kind]} MB. File ini ${mb(picked.size)}.`);
      return;
    }
    setState('busy');
    setMsg('');

    let file = picked;
    let note = '';
    if (kind === 'image') {
      setStep('Mengompres…');
      try {
        const c = await compressImage(picked);
        file = c.file;
        note = c.after < c.before ? `Dikompres ${mb(c.before)} → ${mb(c.after)} (${c.width}×${c.height}).` : `Ukuran ${mb(c.before)}.`;
      } catch {
        note = 'Foto diunggah tanpa kompresi (format tidak bisa dibaca browser).';
      }
    } else if (picked.size > VIDEO_WARN * 1048576) {
      note = `Video ${mb(picked.size)} cukup berat untuk pengunjung ponsel — idealnya di bawah ${VIDEO_WARN} MB.`;
    }

    setStep('Mengunggah…');
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
    setMsg(note);
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
        {state === 'busy' ? step : kind === 'image' ? 'Unggah foto' : 'Unggah video'}
      </button>
      {msg && <span className={`mt-1 max-w-xs text-[12px] ${state === 'error' ? 'text-red-700' : 'text-ink-faint'}`}>{msg}</span>}
    </span>
  );
}
