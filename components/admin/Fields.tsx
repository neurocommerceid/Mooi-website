'use client';
/* eslint-disable @next/next/no-img-element */
import type { Field } from '@/lib/cms/schema';
import Upload from './Upload';

type Obj = Record<string, unknown>;
const input = 'w-full rounded-lg border border-line bg-white px-3 py-2.5 text-[15px] outline-none transition focus:border-gold';

function Label({ f }: { f: Field }) {
  return (
    <>
      <span className="block text-[13px] font-medium text-ink">{f.label}</span>
      {f.help && <span className="mt-0.5 block text-[12px] leading-snug text-ink-faint">{f.help}</span>}
    </>
  );
}

function blank(fields: Field[]): Obj {
  return Object.fromEntries(
    fields.map((f) => [
      f.key,
      f.type === 'image' ? { src: '', alt: '' }
        : f.type === 'video' ? { mp4: '', webm: '', poster: '' }
        : f.type === 'list' || f.type === 'strings' ? []
        : f.type === 'group' ? blank(f.fields)
        : f.type === 'number' ? 0
        : f.type === 'boolean' ? false
        : '',
    ]),
  );
}

export function FieldList({ fields, value, onChange }: { fields: Field[]; value: Obj; onChange: (v: Obj) => void }) {
  return (
    <div className="grid gap-6">
      {fields.map((f) => (
        <FieldInput key={f.key} f={f} value={value[f.key]} onChange={(v) => onChange({ ...value, [f.key]: v })} />
      ))}
    </div>
  );
}

function FieldInput({ f, value, onChange }: { f: Field; value: unknown; onChange: (v: unknown) => void }) {
  switch (f.type) {
    case 'text':
      return (
        <label className="block">
          <Label f={f} />
          <input className={`${input} mt-2`} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} />
        </label>
      );
    case 'number':
      return (
        <label className="block">
          <Label f={f} />
          <input type="number" inputMode="numeric" min={0} className={`${input} mt-2 max-w-[220px]`}
            value={Number.isFinite(value as number) ? (value as number) : ''}
            onChange={(e) => onChange(e.target.value === '' ? 0 : Math.max(0, Math.round(Number(e.target.value))))} />
        </label>
      );
    case 'boolean':
      return (
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-[#9E6449]" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
          <span><Label f={f} /></span>
        </label>
      );
    case 'textarea':
      return (
        <label className="block">
          <Label f={f} />
          <textarea rows={3} className={`${input} mt-2`} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} />
        </label>
      );
    case 'image': {
      const v = (value as { src: string; alt: string }) ?? { src: '', alt: '' };
      return (
        <div>
          <Label f={f} />
          <div className="mt-2 flex gap-4 rounded-xl border border-line bg-white p-3">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-ivory-deep">
              {v.src && <img src={v.src} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="grid flex-1 gap-2">
              <div className="flex flex-wrap items-start gap-2">
                <Upload kind="image" onDone={(src) => onChange({ ...v, src })} />
                {v.src && (
                  <button type="button" onClick={() => onChange({ ...v, src: '' })} className="px-2 py-2 text-[13px] text-ink-muted hover:text-red-700">
                    Hapus foto
                  </button>
                )}
              </div>
              <input className={input} placeholder="Deskripsi foto (untuk tunanetra & Google)" value={v.alt}
                onChange={(e) => onChange({ ...v, alt: e.target.value })} />
            </div>
          </div>
        </div>
      );
    }
    case 'video': {
      const v = (value as { mp4: string; webm: string; poster: string }) ?? { mp4: '', webm: '', poster: '' };
      return (
        <div>
          <Label f={f} />
          <div className="mt-2 grid gap-3 rounded-xl border border-line bg-white p-3">
            {(v.mp4 || v.webm) && (
              <video key={v.mp4 + v.webm} muted loop autoPlay playsInline poster={v.poster || undefined} className="h-48 w-auto self-start rounded-lg bg-black">
                {v.webm && <source src={v.webm} type="video/webm" />}
                {v.mp4 && <source src={v.mp4} type="video/mp4" />}
              </video>
            )}
            <div className="flex flex-wrap items-start gap-2">
              {/* MP4 baru mengosongkan WebM lama — browser memprioritaskan WebM, jadi video lama akan tetap tampil. */}
              <Upload kind="video" onDone={(url) => onChange(url.endsWith('.webm') ? { ...v, webm: url } : { ...v, mp4: url, webm: '' })} />
              <Upload kind="image" onDone={(poster) => onChange({ ...v, poster })} />
              {(v.mp4 || v.webm) && (
                <button type="button" onClick={() => onChange({ mp4: '', webm: '', poster: '' })} className="px-2 py-2 text-[13px] text-ink-muted hover:text-red-700">
                  Hapus video
                </button>
              )}
            </div>
            <p className="text-[12px] text-ink-faint">
              Unggah MP4 (H.264) agar jalan di semua perangkat; WebM opsional sebagai versi tambahan yang lebih ringan.
              Tombol foto untuk gambar sampul yang tampil sebelum video dimuat.
              {v.mp4 ? ' · MP4 ✓' : ' · MP4 belum ada'}{v.webm ? ' · WebM ✓' : ''}{v.poster ? ' · Sampul ✓' : ''}
            </p>
          </div>
        </div>
      );
    }
    case 'strings': {
      const list = (value as string[]) ?? [];
      return (
        <div>
          <Label f={f} />
          <div className="mt-2 grid gap-2">
            {list.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input className={input} value={s} onChange={(e) => onChange(list.map((x, j) => (j === i ? e.target.value : x)))} />
                <button type="button" aria-label="Hapus" onClick={() => onChange(list.filter((_, j) => j !== i))}
                  className="rounded-lg px-3 text-ink-muted hover:text-red-700">✕</button>
              </div>
            ))}
            <button type="button" onClick={() => onChange([...list, ''])} className="justify-self-start text-[13px] text-gold-deep hover:underline">
              + Tambah
            </button>
          </div>
        </div>
      );
    }
    case 'group': {
      const v = (value as Obj) ?? blank(f.fields);
      return (
        <fieldset className="rounded-xl border border-line bg-white/60 p-4">
          <legend className="px-1 font-serif text-xl">{f.label}</legend>
          <FieldList fields={f.fields} value={v} onChange={onChange} />
        </fieldset>
      );
    }
    case 'list': {
      const list = (value as Obj[]) ?? [];
      const move = (i: number, d: number) => {
        const j = i + d;
        if (j < 0 || j >= list.length) return;
        const next = [...list];
        [next[i], next[j]] = [next[j], next[i]];
        onChange(next);
      };
      const btn = 'rounded-md px-2 py-1 text-[13px] text-ink-muted hover:bg-ivory-soft hover:text-ink disabled:opacity-30';
      return (
        <div>
          <Label f={f} />
          <div className="mt-3 grid gap-4">
            {list.map((item, i) => (
              <details key={i} open={list.length <= 3} className="group rounded-xl border border-line bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3">
                  <span className="font-medium">
                    <span className="mr-2 text-gold">{String(i + 1).padStart(2, '0')}</span>
                    {String(item.name ?? item.label ?? item.title ?? item.value ?? f.item)}
                  </span>
                  <span className="flex items-center gap-1" onClick={(e) => e.preventDefault()}>
                    <button type="button" className={btn} disabled={i === 0} onClick={() => move(i, -1)} aria-label="Naik">↑</button>
                    <button type="button" className={btn} disabled={i === list.length - 1} onClick={() => move(i, 1)} aria-label="Turun">↓</button>
                    <button type="button" className={`${btn} hover:!text-red-700`}
                      onClick={() => confirm(`Hapus ${f.item.toLowerCase()} ini?`) && onChange(list.filter((_, j) => j !== i))}>
                      Hapus
                    </button>
                  </span>
                </summary>
                <div className="border-t border-line p-4">
                  <FieldList fields={f.fields} value={item} onChange={(v) => onChange(list.map((x, j) => (j === i ? v : x)))} />
                </div>
              </details>
            ))}
            <button type="button" onClick={() => onChange([...list, blank(f.fields)])}
              className="justify-self-start rounded-lg border border-dashed border-gold/60 px-4 py-2 text-[13px] text-gold-deep hover:bg-white">
              + Tambah {f.item.toLowerCase()}
            </button>
          </div>
        </div>
      );
    }
  }
}
