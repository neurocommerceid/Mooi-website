import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Menyegarkan sesi Supabase untuk area admin dan mengarahkan tamu ke halaman login.
// Ini hanya kenyamanan: hak akses sebenarnya ditegakkan oleh RLS di database
// dan pemeriksaan server di app/admin.
export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return res;

  const sb = createServerClient(url, key, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await sb.auth.getUser();
  const isLogin = req.nextUrl.pathname === '/admin/login';
  if (!data.user && !isLogin) {
    const to = req.nextUrl.clone();
    to.pathname = '/admin/login';
    return NextResponse.redirect(to);
  }
  return res;
}

export const config = { matcher: ['/admin/:path*'] };
