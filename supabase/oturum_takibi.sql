-- Prof Lingo — Giriş zamanı ve aktif süre takibi
-- auth_fix.sql ve xp_guvenlik.sql'den sonra çalıştırın. Tekrar çalıştırmak güvenlidir.
--
-- Her girişte / uygulama açılışında oturumlar tablosuna bir satır açılır. Uygulama açık ve
-- kullanıcı aktifken 30 sn'de bir oturum_nabiz() çağrılır; süreyi SUNUCU saati ölçer
-- (iki sinyal arası en fazla 90 sn sayılır; daha uzun boşluk = pasif, sayılmaz).
-- 30 dk'dan uzun aradan sonra gelen sinyal yeni oturum açar.
-- KVKK: bu veri aydınlatma metninde belirtilmelidir.

create table if not exists public.oturumlar (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  tur text not null default 'acilis' check (tur in ('giris', 'acilis')),
  basladi timestamptz not null default now(),
  son_aktif timestamptz not null default now(),
  aktif_saniye integer not null default 0
);
create index if not exists oturumlar_user_basladi on public.oturumlar (user_id, basladi desc);

alter table public.oturumlar enable row level security;
drop policy if exists "oturumlar_select_own" on public.oturumlar;
create policy "oturumlar_select_own" on public.oturumlar for select using (auth.uid() = user_id);
revoke all on public.oturumlar from anon, authenticated;
grant select on public.oturumlar to authenticated;

-- Oturum aç: 'giris' (şifreyle giriş/kayıt) ya da 'acilis' (kayıtlı oturumla uygulamayı açma)
create or replace function public.oturum_baslat(p_tur text default 'acilis')
returns bigint
language plpgsql
security definer set search_path = public
as $$
declare
  uid uuid := auth.uid();
  oid bigint;
begin
  if uid is null then raise exception 'Giriş yapılmamış'; end if;
  -- Sayfa yenileme gibi 1 dk içindeki tekrarlar yeni satır açmaz
  select id into oid from public.oturumlar
   where user_id = uid and son_aktif > now() - interval '1 minute'
   order by id desc limit 1;
  if oid is not null then return oid; end if;
  insert into public.oturumlar (user_id, tur)
  values (uid, case when p_tur = 'giris' then 'giris' else 'acilis' end)
  returning id into oid;
  return oid;
end;
$$;

-- Aktiflik sinyali. Kullanılacak oturum kimliğini döndürür (uzun aradan sonra yenisi).
create or replace function public.oturum_nabiz(p_oturum bigint)
returns bigint
language plpgsql
security definer set search_path = public
as $$
declare
  uid uuid := auth.uid();
  gecen numeric;
  oid bigint;
begin
  if uid is null then raise exception 'Giriş yapılmamış'; end if;
  select extract(epoch from (now() - son_aktif)) into gecen
    from public.oturumlar where id = p_oturum and user_id = uid for update;
  if not found or gecen > 1800 then
    insert into public.oturumlar (user_id, tur) values (uid, 'acilis') returning id into oid;
    return oid;
  end if;
  update public.oturumlar set
    aktif_saniye = aktif_saniye + case when gecen <= 90 then round(gecen)::int else 0 end,
    son_aktif = now()
  where id = p_oturum;
  return p_oturum;
end;
$$;

revoke all on function public.oturum_baslat(text) from public, anon;
revoke all on function public.oturum_nabiz(bigint) from public, anon;
grant execute on function public.oturum_baslat(text) to authenticated;
grant execute on function public.oturum_nabiz(bigint) to authenticated;

-- Senin için özet (Table Editor'da "kullanici_aktivite"). Tarayıcıdan erişilemez.
create or replace view public.kullanici_aktivite with (security_invoker = true) as
select
  p.name as ad_soyad,
  p.email,
  count(o.id) as oturum_sayisi,
  max(o.basladi) as son_giris,
  round(coalesce(sum(o.aktif_saniye), 0) / 60.0, 1) as toplam_aktif_dakika,
  round(coalesce(sum(o.aktif_saniye) filter (where o.basladi > now() - interval '7 days'), 0) / 60.0, 1) as son_7_gun_dakika
from public.profiles p
left join public.oturumlar o on o.user_id = p.id
group by p.id, p.name, p.email
order by son_giris desc nulls last;
revoke all on public.kullanici_aktivite from anon, authenticated;

-- Örnek: bir kişinin tüm girişleri (Türkiye saatiyle)
--   select basladi at time zone 'Europe/Istanbul' as giris, tur, aktif_saniye / 60 as dakika
--   from public.oturumlar o join public.profiles p on p.id = o.user_id
--   where p.email = 'ornek@mail.com' order by basladi desc;
