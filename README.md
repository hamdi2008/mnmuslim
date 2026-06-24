# MNMuslim.com

A community directory connecting Minnesota Muslims with trusted service providers.

Built with **Next.js** · **Supabase** · Deployed on **Vercel**

---

## Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/mnmuslim.git
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

```
mnmuslim/
├── pages/
│   ├── index.js          # Homepage
│   ├── browse.js         # Browse & search page
│   ├── submit.js         # Submit listing form
│   ├── listing/[id].js   # Individual listing detail
│   ├── 404.js            # Not found page
│   ├── _app.js
│   ├── _document.js
│   └── api/
│       ├── listings.js   # GET approved listings (with search/filter)
│       └── submit.js     # POST new listing submission
├── components/
│   ├── Navbar.js
│   ├── Footer.js
│   └── ListingCard.js
├── lib/
│   ├── supabase.js       # Supabase client
│   └── categories.js     # Category list
├── styles/
│   └── globals.css
├── supabase-schema.sql   # Run this in Supabase SQL Editor
└── .env.local.example
```

---

## Database Schema

Single table: `listings`

| Column | Type | Notes |
|---|---|---|
| id | bigint | Auto-increment primary key |
| service_name | text | Required |
| provider_name | text | Required |
| category | text | One of 13 category IDs |
| description | text | Required |
| service_area | text | Required |
| phone | text | Optional |
| email | text | Required |
| website | text | Optional |
| instagram | text | Optional |
| approved | boolean | Default false — must be manually approved |
| created_at | timestamptz | Auto-set |

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

## Tech Stack

- **Framework:** Next.js 14 (Pages Router)
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **Styling:** Plain CSS (no framework)
- **Fonts:** Playfair Display + Inter (Google Fonts)

---

## MVP Scope

This is intentionally a focused MVP. Not included:

- User accounts or authentication
- Reviews or ratings
- Messaging system
- Claim listing / verification
- Maps or geolocation
- Bookings or payments
- Job board or events

---

## License

MIT
