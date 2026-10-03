import { notFound } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import { defaults, sectionKeys, type SectionKey } from '@/lib/cms/content';
import { schema } from '@/lib/cms/schema';
import Editor from '@/components/admin/Editor';

export default async function EditSection({ params }: { params: { key: string } }) {
  const key = params.key as SectionKey;
  if (!sectionKeys.includes(key)) notFound();

  const { data } = await supabaseServer().from('site_content').select('data').eq('key', key).maybeSingle();
  const value = { ...(defaults[key] as object), ...((data?.data as object) ?? {}) };

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-4xl">{schema[key].title}</h1>
      <p className="mt-2 text-ink-muted">{schema[key].desc}</p>
      <Editor sectionKey={key} fields={schema[key].fields} initial={value} />
    </div>
  );
}
