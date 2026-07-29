-- ============================================================
-- MNMuslim.com — Events batch add #2 (2026-07-12)
-- Sourced from @mnmuslimevents Instagram fliers.
-- Paste into the Supabase SQL Editor to publish (approved = true).
-- Chai & Chat (Dr. Layla Asamarai) is intentionally omitted — its
-- flier shows no address. Al-Maa'uun venue is the org HQ (confirm).
-- ============================================================

insert into events (title, category, date, end_date, time_label, venue, city, link, description, approved)
values
  ('Seeds of Success — with Ustadha Faduma Warsame', 'lectures',
   '2026-07-24', null, '7:00 PM',
   'Al-Ihsan Islamic Center, 955 Minnehaha Ave W', 'Saint Paul',
   'https://www.instagram.com/p/DbHo26sRVCm/', null, true),

  ('Picnic Day & Paint — Girls Halaqa (The Nur Circle)', 'youth',
   '2026-07-31', null, '6:30 PM – Maghrib',
   'Memorial Park, 1801 County Road 101 E', 'Shakopee',
   'https://www.instagram.com/p/DbHo0zZRl3I/',
   'Samaha Islamic Center girls halaqa. Guest speaker: Ustadha Safiya Hashi. Bring a friend.', true),

  ('Modest Clothing Swap — Rabata Sustainable Summer', 'social',
   '2026-07-26', null, '4:00 PM – 6:00 PM',
   'Rabata Cultural Center, 3533 Lexington Ave N', 'Arden Hills',
   'https://www.instagram.com/p/DbHoyl2R3Au/',
   'Sustainable summer clean-out and modest clothing swap. Max 7 modest outfits + 3 children''s outfits; items must be gently used, without stains or holes.', true),

  ('KANZ Academy Open House', 'community',
   '2026-07-24', null, '5:00 PM – 8:00 PM',
   'KANZ, 2201 37th Ave NE', 'Columbia Heights',
   'https://www.instagram.com/p/DbHovFMR9B6/',
   'Open house for KANZ Academy, now enrolling grades 6–8. Everyone welcome.', true),

  ('Volunteers Needed — YM Sisters x ICNA Relief', 'community',
   '2026-07-25', null, '11:00 AM – 2:00 PM',
   '3055 Old Highway 8', 'Minneapolis',
   'https://www.instagram.com/p/DbCcGP2Rqm9/',
   'Young Muslims Sisters Minneapolis volunteering with ICNA Relief. Ages 13–25. RSVP required.', true),

  ('Hike With the Girls', 'social',
   '2026-07-25', null, '6:00 PM – 8:00 PM',
   'Minnehaha Falls', 'Minneapolis',
   'https://www.instagram.com/p/DbCcClExHHy/', null, true),

  ('ICNA Sisters Monthly Halaqah — Calligraphy & Anger Management', 'classes',
   '2026-07-25', null, '6:30 PM – 9:30 PM',
   '12970 Legacy Creek Pkwy NE', 'Blaine',
   'https://www.instagram.com/p/DbCcABYxiMi/',
   'Monthly halaqah of knowledge, reflection & sisterhood with a calligraphy and anger-management session.', true),

  ('Sisters Field Day', 'social',
   '2026-07-26', null, '5:30 PM – finish',
   'Southview Park', 'West St. Paul',
   'https://www.instagram.com/p/Da9UsgBxUJs/',
   'Masjid As-Sunnah Youth Board. Kickball, relay races, spoon & egg race, tug of war, water balloon fight. Age 15+. Refreshments provided.', true),

  ('Dugsi Career Fair 2026', 'youth',
   '2026-07-25', null, '10:30 AM – 3:00 PM',
   'Saint Anthony High School, 3303 33rd Ave NE', 'St. Anthony',
   'https://www.instagram.com/p/Da9UrU5xTcg/',
   'Free and open to all dugsi students and other interested students ages 12 and older.', true),

  ('BAYT Connect — A Networking Event for Muslims', 'networking',
   '2026-08-01', null, '6:00 PM – 9:00 PM',
   '3929 Market St', 'Edina',
   'https://www.instagram.com/p/Da4IOERxnh0/',
   'Doors open 6:00 PM, activities start 7:15 PM. Dress code: business casual.', true),

  ('Al-Maa''uun Day of Service', 'community',
   '2026-08-15', null, '12:00 PM – 4:00 PM',
   'Al-Maa''uun, 1729 Lyndale Ave N', 'Minneapolis',
   'https://www.instagram.com/p/Da4ILqMR94P/',
   'Free community event — vendors, volunteers, community partners, and sponsors. Serving our neighbors and strengthening our community.', true);

-- Add the IG link to the existing IUMN/UMN Seminars Summer Dawrah (id 12).
update events
  set link = 'https://www.instagram.com/p/DbFD7gvRJnD/'
  where id = 12 and link is null;

-- Chai & Chat — location is member-only (shared at registration), so the
-- venue is a placeholder and the link points to the registration post.
insert into events (title, category, date, end_date, time_label, venue, city, link, description, approved)
values
  ('Chai & Chat with Dr. Layla Asamarai', 'health',
   '2026-07-24', null, '6:00 PM – 8:00 PM',
   'Location shared upon registration (members only)', 'Twin Cities',
   'https://www.instagram.com/p/Da_-94CSrUz/',
   'Community healing circle led by a licensed professional, focused on connection, growth, and renewal — a space for sisters to come together, process, and heal. Hiking Hijabie in collaboration with Reviving Sisterhood, sponsored by Penny Appeal. Childcare provided. Register via the link.', true);
