-- Artikel hanya bisa diubah akun developer (Neuro Commerce); artikel tambahan = add-on.
-- Fungsi di bawah sudah diterapkan. Policy delete di bagian akhir dijalankan manual di SQL Editor.
create or replace function public.content_perm(k text) returns text language sql immutable set search_path = '' as $$
  select case when k in ('home','en','hero','intro','about','testimonial','settings') then 'konten'
    when k = 'artikel' then 'developer'
    when k = 'branches' then 'cabang' when k = 'booking' then 'booking*' else 'super' end; $$;
create or replace function public.can_write_content(k text) returns boolean language sql stable security definer set search_path = '' as $$
  select case
    when k = 'artikel' then public.is_super() and public.jwt_email() = 'neurocommerceid@gmail.com'
    else public.is_super() or case public.content_perm(k) when 'super' then false
      when 'booking*' then public.has_perm('harga') or public.has_perm('stylist') or public.has_perm('booking')
      else public.has_perm(public.content_perm(k)) end
  end; $$;

drop policy if exists "super menghapus konten" on public.site_content;
create policy "super menghapus konten" on public.site_content for delete to authenticated
  using (public.is_super() and (key <> 'artikel' or public.jwt_email() = 'neurocommerceid@gmail.com'));
