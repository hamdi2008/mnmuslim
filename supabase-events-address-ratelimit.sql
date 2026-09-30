-- ============================================================
-- MNMuslim.com — Events: optional street address + submission
-- rate limit (2026-09). Additive only; existing rows are untouched.
--
-- Run AFTER supabase-events-submission-fields.sql, and BEFORE
-- deploying the matching code (the site selects `address` by name).
-- Safe to re-run.
-- ============================================================

-- 1. Optional street address, kept separate from the venue name
alter table events
  add column if not exists address text;   -- e.g. "955 Minnehaha Ave W"

alter table events
  drop constraint if exists events_address_length_check,
  add constraint events_address_length_check
    check (char_length(address) <= 200);

grant select (address) on events to anon, authenticated;

-- 2. Rate limit public submissions. Enforced in the database so it also
--    covers inserts made directly with the public anon key, not just the
--    website form. Rows inserted from the SQL Editor are not limited.
--    Limits: 10 pending submissions per email per hour, 40 overall per hour.
create or replace function public.events_submission_rate_limit()
returns trigger
language plpgsql
security definer            -- must see pending rows hidden from anon by RLS
set search_path = public
as $$
begin
  if coalesce(auth.role(), '') not in ('anon', 'authenticated') then
    return new;
  end if;

  if (select count(*) from events
      where approved = false
        and created_at > now() - interval '1 hour'
        and lower(contact_email) = lower(new.contact_email)) >= 10 then
    raise exception 'rate_limited: too many submissions from this email';
  end if;

  if (select count(*) from events
      where approved = false
        and created_at > now() - interval '1 hour') >= 40 then
    raise exception 'rate_limited: too many submissions overall';
  end if;

  return new;
end;
$$;

drop trigger if exists events_submission_rate_limit on events;
create trigger events_submission_rate_limit
  before insert on events
  for each row execute function public.events_submission_rate_limit();

-- ============================================================
-- Check:
--   select column_name from information_schema.columns
--   where table_name = 'events' and column_name = 'address';
--   select tgname from pg_trigger where tgname = 'events_submission_rate_limit';
-- Adjust limits: edit the numbers above and re-run this file.
-- ============================================================
