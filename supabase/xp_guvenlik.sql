-- Prof Lingo — XP / seri / market güvenliği
-- ÖNCE auth_fix.sql çalıştırılmış olmalı. Supabase Dashboard → SQL Editor → Run.
-- Tekrar çalıştırmak güvenlidir.
--
-- Ne yapar:
--  * Tarayıcı artık xp, streak, completed_chapters, rewards sütunlarını DOĞRUDAN
--    değiştiremez; sadece ad ve telefonunu güncelleyebilir.
--  * XP yalnızca complete_chapter() ile eklenir: doğru cevap sayısına göre üst sınır,
--    bölümler arası en az süre ve günlük XP sınırı uygulanır. Seri sunucu tarihine göre
--    hesaplanır.
--  * Market alışverişi redeem_reward() ile yapılır: fiyatlar sunucudadır, XP kontrolü ve
--    düşülmesi tek işlemde yapılır.
-- Not: Quiz tarayıcıda oynandığı için hile tamamen engellenemez; bu kurallar hilenin
-- kazandırabileceği XP'yi sınırlar.

-- 1) Sütun tiplerini sabitle ve yardımcı sütunları ekle
alter table public.profiles alter column xp drop default;
alter table public.profiles alter column streak drop default;
alter table public.profiles alter column completed_chapters drop default;
alter table public.profiles alter column rewards drop default;
alter table public.profiles alter column last_practice_date drop default;
alter table public.profiles alter column xp type integer using coalesce(xp, 0)::integer;
alter table public.profiles alter column xp set default 0;
alter table public.profiles alter column streak type integer using coalesce(streak, 0)::integer;
alter table public.profiles alter column streak set default 0;
alter table public.profiles alter column completed_chapters type jsonb using coalesce(to_jsonb(completed_chapters), '[]'::jsonb);
alter table public.profiles alter column completed_chapters set default '[]'::jsonb;
alter table public.profiles alter column rewards type jsonb using coalesce(to_jsonb(rewards), '[]'::jsonb);
alter table public.profiles alter column rewards set default '[]'::jsonb;
alter table public.profiles alter column last_practice_date type date using nullif(last_practice_date::text, '')::date;
alter table public.profiles add column if not exists xp_day date;
alter table public.profiles add column if not exists xp_today integer not null default 0;
alter table public.profiles add column if not exists last_xp_at timestamptz;

-- 2) Sütun yetkileri: tarayıcı (authenticated) sadece bunları yazabilir
revoke insert, update on public.profiles from authenticated, anon;
grant select on public.profiles to authenticated;
grant insert (id, email, name, phone) on public.profiles to authenticated;
grant update (name, phone) on public.profiles to authenticated;

-- 3) Bölüm bitirme
create or replace function public.complete_chapter(
  p_chapter_id int, p_earned_xp int, p_correct int, p_wrong int
) returns public.profiles
language plpgsql
security definer set search_path = public
as $$
declare
  uid uuid := auth.uid();
  prof public.profiles;
  today date := (now() at time zone 'Europe/Istanbul')::date;
  daily_cap constant int := 15000;      -- günde en fazla kazanılabilecek XP
  per_answer constant int := 75;        -- bir doğru cevabın en fazla XP'si (sesli söyleme 25 x 3 seri çarpanı)
  extra constant int := 1000;           -- eşleşme/yakalama puanları ve Winner Mode bonusları için pay
  min_sec_per_answer constant int := 2; -- cevap başına en az süre
  cap int; gain int; pct int; elapsed numeric;
begin
  if uid is null then raise exception 'Giriş yapılmamış'; end if;
  if p_chapter_id is null or p_chapter_id < 1 or p_chapter_id > 500 then raise exception 'Geçersiz bölüm'; end if;
  p_correct := greatest(0, least(coalesce(p_correct, 0), 300));
  p_wrong   := greatest(0, least(coalesce(p_wrong, 0), 300));

  select * into prof from public.profiles where id = uid for update;
  if not found then raise exception 'Profil bulunamadı'; end if;

  -- çok hızlı arka arkaya bölüm bitirme
  if prof.last_xp_at is not null then
    elapsed := extract(epoch from (now() - prof.last_xp_at));
    if elapsed < greatest(10, (p_correct + p_wrong) * min_sec_per_answer) then
      raise exception 'Çok hızlı: lütfen bölümü normal şekilde tamamlayın';
    end if;
  end if;

  pct := case when p_correct + p_wrong = 0 then 0 else round(100.0 * p_correct / (p_correct + p_wrong)) end;
  cap := p_correct * per_answer + extra;
  gain := greatest(0, least(coalesce(p_earned_xp, 0), cap)) + case when pct >= 80 then 50 else 0 end;

  if prof.xp_day is distinct from today then prof.xp_today := 0; end if;
  gain := greatest(0, least(gain, daily_cap - prof.xp_today));

  update public.profiles set
    xp = coalesce(xp, 0) + gain,
    xp_today = prof.xp_today + gain,
    xp_day = today,
    last_xp_at = now(),
    completed_chapters = case
      when pct >= 80 and not coalesce(completed_chapters, '[]'::jsonb) @> to_jsonb(p_chapter_id)
        then coalesce(completed_chapters, '[]'::jsonb) || to_jsonb(p_chapter_id)
      else coalesce(completed_chapters, '[]'::jsonb) end,
    streak = case
      when last_practice_date = today then coalesce(streak, 0)
      when last_practice_date = today - 1 then coalesce(streak, 0) + 1
      else 1 end,
    last_practice_date = today
  where id = uid
  returning * into prof;
  return prof;
end;
$$;

-- 4) Market
create or replace function public.redeem_reward(p_reward_id text)
returns public.profiles
language plpgsql
security definer set search_path = public
as $$
declare
  uid uuid := auth.uid();
  prof public.profiles;
  price int;
  title text;
begin
  if uid is null then raise exception 'Giriş yapılmamış'; end if;
  -- Fiyatlar burada tanımlıdır (js/content.js içindeki REWARDS ile aynı tutun)
  select r.price, r.title into price, title from (values
    ('lang_3', 25000, '3 Günlük Dil Paketi'),
    ('lang_7', 50000, '7 Günlük Dil Paketi'),
    ('lang_14', 90000, '14 Günlük Dil Paketi'),
    ('books_all', 90000, 'İngilizce Kitap Seti')
  ) as r(id, price, title) where r.id = p_reward_id;
  if price is null then raise exception 'Geçersiz ödül'; end if;

  select * into prof from public.profiles where id = uid for update;
  if coalesce(prof.rewards, '[]'::jsonb) @> jsonb_build_array(jsonb_build_object('id', p_reward_id)) then
    raise exception 'Bu ödül zaten alınmış';
  end if;
  if coalesce(prof.xp, 0) < price then raise exception 'XP yetersiz'; end if;

  update public.profiles set
    xp = xp - price,
    rewards = coalesce(rewards, '[]'::jsonb) || jsonb_build_array(jsonb_build_object(
      'id', p_reward_id, 'name', title, 'date', now()))
  where id = uid
  returning * into prof;
  return prof;
end;
$$;

revoke all on function public.complete_chapter(int, int, int, int) from public, anon;
revoke all on function public.redeem_reward(text) from public, anon;
grant execute on function public.complete_chapter(int, int, int, int) to authenticated;
grant execute on function public.redeem_reward(text) to authenticated;
