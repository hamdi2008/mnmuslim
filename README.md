# MNMuslim

**The digital home for Muslims in Minnesota.**

MNMuslim is a community platform helping people in Minnesota discover Muslim-owned businesses and services, community events, and useful local resources. The live site includes a services directory and an events directory. The project is actively developed, with more community directories planned.

**Live website:** https://mnmuslim.com

## Current Features

- **Services directory (`/services`):** Browse local providers, search and filter listings, view details, and submit a business or service for review.
- **Events directory (`/events`):** Discover upcoming community events, filter by date, category, and location, view details, and submit events for review. Past events are excluded from the upcoming directory.

## Planned Development

- **Mosques directory:** Help residents find local mosques and Islamic centers.
- **Community job board:** Share relevant employment opportunities.
- **Schools directory:** Help families discover educational options.
- **Ongoing improvements:** Maintain listings and events, improve data quality, discovery, and submission workflows.

These are planned features, not currently released.

Built with **Next.js** · **Supabase** · Deployed on **Vercel**

---

## Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/hamdi2008/mnmuslim.git
cd mnmuslim
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (choose a region close to Minnesota — US East or US West)
3. Once your project is ready, open the **SQL Editor**
4. Paste the full contents of `supabase-schema.sql` and click **Run**
5. This creates the `listings` table, sets up Row Level Security, and seeds 12 starter listings

### 3. Add environment variables

Copy the example env file:

```bash
cp .env.local.example .env.local
```

Then open `.env.local` and fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Find these in your Supabase project under **Settings → API**.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

### Option A — Vercel CLI (recommended)

```bash
npm install -g vercel
vercel
```

Follow the prompts. When asked about environment variables, add your two Supabase keys.

### Option B — GitHub + Vercel dashboard

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**

Vercel auto-deploys on every push to `main`.

---

## Project Structure

Key parts of the Next.js Pages Router application:

- `pages/index.js` — homepage
- `pages/services.js` — services directory
- `pages/events.js` — events directory
- `pages/listing/[id].js` — individual service listings
- `pages/api/` — API routes for listings and submissions
- `components/` — shared UI components
- `lib/` — Supabase client, categories, event utilities, and service-area filtering
- `styles/` — site styles
- `supabase-*.sql` — database schema and incremental migrations
- `.env.local.example` — example environment variable names (not real credentials)

See the source tree for additional routes, scripts, and migration files.

---

## Database Schema

The services directory uses the `listings` table. The events directory uses a separate `events` table (see `supabase-events-schema.sql` and subsequent events migrations).

| Column | Type | Notes |
|---|---|---|
| id | bigint | Auto-increment primary key |
| service_name | text | Required |
| provider_name | text | Required |
| category | text | A category ID from `lib/categories.js` |
| description | text | Required |
| service_area | text | Required — free text, defaults to "Minnesota" on submit |
| phone | text | Optional |
| email | text | Optional (submit requires at least one contact method) |
| website | text | Optional |
| instagram | text | Optional |
| extra_link | text | Optional "Additional Link" from the submit form (not displayed) |
| approved | boolean | Default false — must be manually approved |
| featured | boolean | Default false — set manually; shown in the Featured section on /services |
| created_at | timestamptz | Auto-set |
| services | text[] | Optional — named services offered |
| price_info | text | Optional — human-readable pricing |
| delivery_modes | text[] | Optional — any of `remote`, `in_person` |
| audience | text | Optional — who the service is for |
| action_url | text | Optional — https link to request/book the service |
| action_label | text | Optional — button text for `action_url`; defaults to "Request This Service" |
| updated_at | timestamptz | Auto-set on insert and on every update (trigger) |

The structured fields (`services` → `updated_at`) are an experiment, populated
only for By Hamdi (id 36) so far. They're added by
`supabase-listings-2026-09-agent-fields.sql` (`action_label` by
`supabase-listings-2026-10-action-label.sql`), and when present they're shown on
the listing detail page and included in its Schema.org JSON-LD.

---

## Approving Listings

Submitted listings are marked `approved = false` and hidden from the public.

**To approve a listing**, run this in your Supabase SQL Editor:

```sql
update listings set approved = true where id = <listing_id>;
```

**To view all pending listings:**

```sql
select id, service_name, provider_name, email, created_at
from listings
where approved = false
order by created_at;
```

---

## Categories

| ID | Name |
|---|---|
| edu | Education & Tutoring |
| tech | Technology & Web |
| biz | Business Services |
| photo | Photography & Media |
| legal | Legal Services |
| fin | Financial Services |
| health | Health & Wellness |
| child | Childcare & Family |
| home | Home Services |
| events | Event Services |
| fitness | Fitness & Sports |
| creative | Creative Services |
| other | Other |

---

## Services & Events Directory

Both directories follow one shared MNMuslim pattern:

> **Compact intro → filters → listing count / action → high-density listings.**

MNHalal was the UX inspiration for the listing density; MNMuslim keeps its own
visual identity (colors, typography, nav, cards, footer).

### Services (`/services`)

- The permanent left-hand **Categories sidebar was removed** in favor of a
  compact, directory-focused layout where the listings are the focus.
- A **filter bar sits above the listings** with **Search · Category · Location**.
- Grid is responsive: **3 columns on desktop, 2 on tablet, 1 on mobile.**
- **Featured** services stay separated from **All Services** and are
  de-duplicated (a featured listing never also appears in All Services).
- The **listing count updates dynamically** with the active filters.

### Service location normalization

`service_area` is **legacy free-text** stored in Supabase (e.g. "Twin Cities",
"Twin Cities Metro", "Minneapolis, MN", "Minnesota & Remote"). Those database
values were **not modified** as part of the redesign.

To keep the Location filter clean, the directory normalizes existing
`service_area` values into a fixed set of buckets via **`lib/serviceAreas.js`**:

- Minneapolis
- St. Paul
- Twin Cities Metro
- Greater Minnesota
- Statewide
- Virtual / Remote

Notes:

- **Minneapolis and St. Paul** listings also **roll up into Twin Cities Metro**
  (while remaining their own filter options).
- A single `service_area` value can map to **multiple** buckets (e.g.
  "Minnesota & Remote" → Statewide *and* Virtual / Remote).
- Normalization is **for filtering only** — cards and detail pages continue to
  display the **original `service_area` value** from Supabase.

**Follow-up (future task):** the **List Your Service** form still accepts a
free-text "Areas You Serve" field, so new submissions keep producing
inconsistent free-text values. A separate future task should move toward
**structured service-area selection** at submission time. _No form or database
changes were made as part of this redesign or this documentation._

### Events (`/events`)

- The permanent **Categories sidebar was removed.**
- A **filter bar sits above the listings** with **Search · Category · Date ·
  Location**.
- Grid is responsive: **3 columns on desktop, 2 on tablet, 1 on mobile.**
- The existing **chronological grouping** (This Week / Next Week / month
  headings) remains intact.
- The **listing count stays dynamic**.
- Event cards use a **more concise location** display; the full location
  information remains available on the event detail page.

> Location-based SEO (e.g. per-location pages) is only a possible **future**
> consideration and is **not** part of this redesign.

---

## Tech Stack

- **Framework:** Next.js 14 (Pages Router)
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **Styling:** Plain CSS (no framework)
- **Fonts:** Playfair Display + Inter (Google Fonts)

---

## Current Scope

MNMuslim currently focuses on community services and events. Features not currently included in the public platform include:

- User accounts or authentication
- Reviews or ratings
- In-platform messaging
- Self-service listing claims
- Maps or geolocation-based search
- Bookings or payments
- Community job board, mosques directory, and schools directory (planned)

---

## License

This project's software is licensed under the MIT License. See [LICENSE](LICENSE) for the full terms.
