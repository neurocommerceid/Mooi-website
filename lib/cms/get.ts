import 'server-only';
import { unstable_cache } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { defaults, type Content, type SectionKey } from './content';

export const CONTENT_TAG = 'content';

type Rows = Partial<Record<SectionKey, unknown>>;

// Melempar error bila gagal, supaya kegagalan TIDAK ikut disimpan di cache.
async function fetchRows(): Promise<Rows> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return {};
  const sb = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await sb.from('site_content').select('key, data');
  if (error) throw new Error(error.message);
  return Object.fromEntries((data ?? []).map((r) => [r.key, r.data]));
}

const cached = unstable_cache(fetchRows, ['site-content'], { tags: [CONTENT_TAG], revalidate: 3600 });

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

// Isi database menang; field (termasuk di dalam grup) yang belum pernah
// disimpan memakai nilai default. Daftar (array) diganti utuh.
function deep(base: unknown, over: unknown): unknown {
  if (!isObj(base) || !isObj(over)) return over === undefined ? base : over;
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(over)) out[k] = k in base ? deep(base[k], v) : v;
  return out;
}

export function merge(rows: Rows): Content {
  const out = { ...defaults } as Record<string, unknown>;
  for (const k of Object.keys(defaults) as SectionKey[]) {
    if (isObj(rows[k])) out[k] = deep(defaults[k], rows[k]);
  }
  return out as Content;
}

export async function getContent(): Promise<Content> {
  try {
    return merge(await cached());
  } catch (e) {
    console.error('CMS: gagal memuat konten, memakai isi bawaan.', e instanceof Error ? e.message : e);
    return merge({});
  }
}
