-- ============================================================
-- MNMuslim.com — Listings: agent-ready fields experiment (2026-09)
-- Adds a minimal set of structured columns to `listings` and
-- populates them for By Hamdi (id 36) only. All other listings
-- keep NULL in the new columns and render exactly as before.
-- Paste into the Supabase SQL Editor and run once.
-- ============================================================

-- 1. New structured columns (all optional except updated_at)
alter table listings
  add column if not exists services       text[],
  add column if not exists price_info     text,
  add column if not exists delivery_modes text[],
  add column if not exists audience       text,
  add column if not exists action_url     text,
  add column if not exists updated_at     timestamptz;

alter table listings
  drop constraint if exists listings_delivery_modes_check,
  drop constraint if exists listings_action_url_check,
  add constraint listings_delivery_modes_check
    check (delivery_modes <@ array['remote', 'in_person']::text[]),
  add constraint listings_action_url_check
    check (action_url ~ '^https://');

-- 2. updated_at: backfill from created_at, then default + auto-bump on edit
update listings set updated_at = created_at where updated_at is null;
alter table listings
  alter column updated_at set default now(),
  alter column updated_at set not null;

create or replace function set_listings_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists listings_set_updated_at on listings;
create trigger listings_set_updated_at
  before update on listings
  for each row execute function set_listings_updated_at();

-- 3. By Hamdi (id 36) — first test listing.
--    email stays as-is until hello@byhamdi.com is live.
--    extra_link held the retired AI MVP Strategy Session Calendly link.
update listings set
  provider_name  = 'Hamdi Mohamud Hassan',
  website        = 'https://byhamdi.com',
  description    = 'Need help with a vibe-coded project? Whether you''re stuck on a bug, unsure how to implement something, or need help improving what you''ve built, I can review your project and help you figure out the next steps. Vibe Coding Help Sessions are 1-on-1, online, and run 60–90 minutes.',
  extra_link     = null,
  services       = array['Vibe Coding Help Session'],
  price_info     = '$99 per session',
  delivery_modes = array['remote'],
  audience       = 'People who built something with ChatGPT, Claude, or other AI coding tools and are stuck on what comes next.',
  action_url     = 'https://forms.gle/nRzHwcCW9GF7JLrL8'
where id = 36;

-- Check:
-- select id, service_name, provider_name, website, extra_link, services,
--        price_info, delivery_modes, audience, action_url, updated_at
-- from listings where id = 36;
