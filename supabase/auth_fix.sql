-- Prof Lingo — Giriş sistemi güvenlik düzeltmesi
-- Supabase Dashboard → SQL Editor'a yapıştırıp "Run" deyin.
-- Tekrar çalıştırmak güvenlidir.

-- 0) ÖNCE KONTROL: Supabase Auth'ta karşılığı olmayan (eski düz metin yöntemiyle
--    açılmış) profiller var mı? Ayrı çalıştırıp sonuca bakın:
--      select id, email, name from public.profiles
--      where id not in (select id from auth.users);
--    Sonuç boş değilse: bu kişiler yeni sistemde tekrar kayıt olmalı. E-posta
--    sütunu benzersizse (unique) bu eski satırlar yeni kaydın profilini engeller;
--    kişiler tekrar kayıt olmadan önce şu satırla silin (XP'leri gider):
--      delete from public.profiles where id not in (select id from auth.users);

-- 1) Kodun kullandığı sütunlar yoksa ekle; düz metin şifre sütununu kaldır
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists name text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists xp integer default 0;
alter table public.profiles add column if not exists streak integer default 0;
alter table public.profiles add column if not exists completed_chapters jsonb default '[]'::jsonb;
alter table public.profiles add column if not exists rewards jsonb default '[]'::jsonb;
alter table public.profiles add column if not exists last_practice_date date;
alter table public.profiles drop column if exists password;

-- 2) Satır güvenliği (RLS): herkes sadece kendi profilini görebilir/değiştirebilir
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

-- 3) Kayıt olunca profili otomatik oluştur.
--    Hata olursa kaydı ENGELLEMEZ (uygulama girişte profili kendisi de oluşturur).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  begin
    insert into public.profiles (id, email, name, phone)
    values (
      new.id,
      lower(new.email),
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'phone'
    )
    on conflict do nothing;
  exception when others then
    raise warning 'handle_new_user: profil oluşturulamadı (%): %', new.id, sqlerrm;
  end;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4) Eski (Auth karşılığı olmayan) profil sayısını göster
do $$
declare n int;
begin
  select count(*) into n from public.profiles where id not in (select id from auth.users);
  if n > 0 then
    raise warning 'DİKKAT: % adet eski profil var. Bu e-postalarla yeniden kayıt olanların profili OLUŞMAZ. Dosyanın başındaki 0. adımı uygulayın.', n;
  else
    raise notice 'Eski profil yok, her şey hazır.';
  end if;
end $$;

-- 5) Kontrol: politikalar ve RLS durumu (sonuçta 3 politika ve rowsecurity = true görmelisiniz)
select policyname, cmd from pg_policies where schemaname = 'public' and tablename = 'profiles';
select relrowsecurity as rowsecurity from pg_class where oid = 'public.profiles'::regclass;
