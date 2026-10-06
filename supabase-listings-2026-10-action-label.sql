-- ============================================================
-- MNMuslim.com — Listings: custom CTA label + By Hamdi refocus (2026-10)
-- 1. Adds an optional action_label column. Listings that leave it
--    NULL keep the default "Request This Service" button.
-- 2. Refocuses By Hamdi (id 36) on Digital Presence & AI Readiness.
--    The listing is titled by the service and attributed to the
--    business ("by By Hamdi"), with the business email rather than a
--    personal one. action_url is the same free-review form the
--    "Get a Free Business Presence Review" button on
--    byhamdi.com/business uses.
--    Vibe Coding Help stays on byhamdi.com; it's left out here because
--    price_info/audience are listing-wide and would mix two offers.
-- Paste into the Supabase SQL Editor and run once.
-- ============================================================

alter table listings
  add column if not exists action_label text;

update listings set
  service_name   = 'Digital Presence & AI Readiness',
  provider_name  = 'By Hamdi',
  email          = 'hello@byhamdi.com',
  website        = 'https://byhamdi.com/business',
  description    = E'Is your business information online accurate and easy to find?\n\n'
                || E'Your Google Business Profile may be outdated. Your website may have broken or missing information. Your hours, phone number, address, services, or social links may be different depending on where someone looks.\n\n'
                || E'I review your business''s online presence to find what''s accurate, what''s missing or outdated, and what should be fixed first.\n\n'
                || E'Start with a free Business Presence Review to see where your business stands.',
  services       = array['Digital Presence & AI Readiness'],
  price_info     = 'Start with a free Business Presence Review',
  delivery_modes = array['remote', 'in_person'],
  audience       = 'Small businesses and service providers that want to understand and improve how they show up online and how easily people, search engines, and AI-powered tools can understand their business.',
  action_url     = 'https://forms.gle/aJuBMpbNd7JY6JHbA',
  action_label   = 'Get a Free Business Presence Review'
where id = 36;

-- Check:
-- select id, service_name, provider_name, email, featured, category,
--        service_area, website, services, price_info, delivery_modes,
--        audience, action_url, action_label, updated_at, description
-- from listings where id = 36;
