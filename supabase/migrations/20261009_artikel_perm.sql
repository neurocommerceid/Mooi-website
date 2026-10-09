-- Artikel ikut hak akses "konten" (sebelumnya kunci baru otomatis hanya untuk super admin).
create or replace function public.content_perm(k text) returns text language sql immutable set search_path = '' as $$
  select case when k in ('home','en','hero','intro','about','testimonial','settings','artikel') then 'konten'
    when k = 'branches' then 'cabang' when k = 'booking' then 'booking*' else 'super' end; $$;
