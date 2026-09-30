-- ============================================================
-- MNMuslim.com — Events: structured submission fields + flyer uploads
-- (2026-09). Additive only: existing rows keep their data and the new
-- columns start out NULL / false.
--
-- Paste into the Supabase SQL Editor and run once, BEFORE deploying
-- the matching code — the site selects the new columns by name.
-- Safe to re-run.
-- ============================================================

-- 1. New columns
alter table events
  add column if not exists start_time         time,     -- local (Central) start time
  add column if not exists end_time           time,     -- local (Central) end time
  add column if not exists cost               text,     -- free text, e.g. "Free", "$10"
  add column if not exists flier_path         text,     -- object path in the event-flyers bucket
  add column if not exists promotion_interest boolean not null default false;  -- PRIVATE

alter table events
  drop constraint if exists events_cost_length_check,
  drop constraint if exists events_flier_path_check,
  drop constraint if exists events_end_time_needs_start_check,
  add constraint events_cost_length_check
    check (char_length(cost) <= 100),
  add constraint events_flier_path_check
    check (flier_path ~ '^submissions/[0-9a-f-]{36}\.(jpg|png|webp)$'),
  add constraint events_end_time_needs_start_check
    check (end_time is null or start_time is not null);

-- 2. Public read access for the new display columns.
--    contact_email and promotion_interest are deliberately NOT granted,
--    so the anon key can never read them.
grant select (start_time, end_time, cost, flier_path)
  on events to anon, authenticated;

-- 3. Private flyer bucket. Size and type limits are enforced by Supabase
--    Storage itself, even for uploads that bypass the website.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('event-flyers', 'event-flyers', false, 4194304,
        array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 4. Storage policies
--    Anyone may upload a new flyer into submissions/ — insert only:
--    no listing, overwriting, or deleting.
drop policy if exists "Anyone can upload an event flyer" on storage.objects;
create policy "Anyone can upload an event flyer"
  on storage.objects for insert
  to anon, authenticated
  with check (
    bucket_id = 'event-flyers'
    and name ~ '^submissions/[0-9a-f-]{36}\.(jpg|png|webp)$'
  );

--    A flyer becomes readable only once its event is approved. Pending
--    flyers stay private (view them in Dashboard → Storage).
drop policy if exists "Public can read flyers of approved events" on storage.objects;
create policy "Public can read flyers of approved events"
  on storage.objects for select
  to anon, authenticated
  using (
    bucket_id = 'event-flyers'
    and exists (
      select 1 from public.events e
      where e.flier_path = objects.name and e.approved = true
    )
  );

-- ============================================================
-- ADMIN cheatsheet:
--   View pending (incl. promotion interest):
--     select id, title, date, start_time, end_time, venue, city, cost,
--            flier_path, contact_email, promotion_interest
--     from events where approved = false order by created_at;
--   See a pending flyer: Dashboard → Storage → event-flyers → submissions/
--   Organizers who want promotion info:
--     select id, title, date, contact_email from events
--     where promotion_interest order by created_at desc;
-- ============================================================
