-- Prof Lingo — Giriş sistemi güvenlik düzeltmesi
-- Supabase Dashboard → SQL Editor'a yapıştırıp "Run" deyin.

-- 1) Düz metin şifreleri sil (şifreler artık Supabase Auth'ta, hash'li tutuluyor)
alter table public.profiles drop column if exists password;

-- 2) Satır güvenliğini (RLS) aç: herkes sadece kendi profilini görebilir/değiştirebilir
alter table public.profiles enable row level security;

do $$
declare p record;
begin
  for p in select policyname from pg_policies
           where schemaname = 'public' and tablename = 'profiles'
  loop
    execute format('drop policy %I on public.profiles', p.policyname);
  end loop;
end $$;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- 3) Kayıt olunca profili otomatik oluştur
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, phone)
  values (
    new.id,
    lower(new.email),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone'
  )
  on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4) Düz metin yöntemiyle açılmış (Supabase Auth'ta karşılığı olmayan) eski
--    profilleri görmek için:
--      select id, email, name, created_at from public.profiles
--      where id not in (select id from auth.users);
--    Bu kişiler yeni sistemde tekrar kayıt olmalı. Aynı e-postayla kayıt
--    olabilmeleri için bu eski satırları silin:
--      delete from public.profiles where id not in (select id from auth.users);
