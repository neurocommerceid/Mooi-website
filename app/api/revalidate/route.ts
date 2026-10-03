import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { currentAdmin } from '@/lib/supabase/server';
import { CONTENT_TAG } from '@/lib/cms/get';

// Dipanggil panel admin setelah menyimpan konten agar website langsung diperbarui.
export async function POST() {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: 'Tidak diizinkan.' }, { status: 401 });
  revalidateTag(CONTENT_TAG);
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
