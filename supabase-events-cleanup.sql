-- ============================================================
-- MNMuslim.com — Events cleanup + daily auto-purge
-- Removes events whose last day is already in the past (Central
-- time) — the same rule the website uses to HIDE them
-- (isUpcoming() in lib/events.js: coalesce(end_date, date) >= today).
-- ============================================================

-- ── One-time cleanup: delete everything already past ──
-- Preview first (safe — just a SELECT):
--   select id, title, coalesce(end_date, date) as last_day
--   from events
--   where coalesce(end_date, date) < (now() at time zone 'America/Chicago')::date
--   order by last_day;

delete from events
where coalesce(end_date, date) < (now() at time zone 'America/Chicago')::date;

-- ── Automate it: run the same delete every day at 3:00 AM Central ──
-- Requires the pg_cron extension. Enable it once in the Supabase
-- dashboard:  Database → Extensions → search "pg_cron" → enable.
-- (or uncomment the line below and run it once)
-- create extension if not exists pg_cron;

select cron.schedule(
  'purge-past-events',
  '0 8 * * *',   -- 08:00 UTC = 03:00 AM Central (CDT); low-traffic
  $$delete from events
    where coalesce(end_date, date) < (now() at time zone 'America/Chicago')::date$$
);

-- Manage the job later:
--   select * from cron.job;                          -- list jobs
--   select cron.unschedule('purge-past-events');     -- stop auto-purge
