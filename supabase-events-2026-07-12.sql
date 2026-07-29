-- ============================================================
-- MNMuslim.com — Events batch add (2026-07-12)
-- Sourced from @mnmuslimevents Instagram fliers.
-- Paste into the Supabase SQL Editor to publish (approved = true).
-- ============================================================

insert into events (title, category, date, end_date, time_label, venue, city, link, description, approved)
values
  ('KIDS Fest — Joy. Dignity. Community.', 'youth',
   '2026-07-17', null, '5:00 PM – 9:00 PM',
   'Coon Rapids Masjid, 1313 Coon Rapids Blvd NW', 'Coon Rapids',
   'https://www.instagram.com/p/DarW0IwRzLn/',
   'Family kids festival with bouncy houses, food trucks, ice cream, and community. RSVP required.', true),

  ('Summer Social — Sip · Shop · Snap', 'social',
   '2026-07-25', null, '4:00 PM – 8:00 PM',
   '13 5th St NE', 'Minneapolis',
   'https://www.instagram.com/p/DarWxEMxVK3/',
   null, true),

  ('Sisters Charity Pickleball', 'social',
   '2026-07-17', null, '6:00 PM – 9:00 PM',
   '3955 Annapolis Ln N', 'Plymouth',
   'https://www.instagram.com/p/DarWtu4xj9Q/',
   'NWICC Youth Committee. An afternoon of pickleball, sisterhood, and fun supporting a local organization. Register $5; paddle rental $5–10.', true),

  ('Graduation of the 10 Qiraat (2nd Annual)', 'community',
   '2026-07-12', null, '1:30 PM',
   'Nasr Institute, 2824 13th Ave S', 'Minneapolis',
   'https://www.instagram.com/p/DarWq3oRyys/',
   'Nasr Institute ijazah ceremony under Sheikh Abdul Nasir Yusuf Ali. Graduates: Salman Mohamed, Ilyaas Farah, Omar Salad, Ibrahim Farah.', true);
