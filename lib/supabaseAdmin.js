import { createClient } from '@supabase/supabase-js'

// SERVER-ONLY. Bypasses Row Level Security — import it only from pages/api
// routes, never from pages or components. Used solely to delete flyer
// files, which the public anon key can't do. Null when the key isn't set,
// so callers skip cleanup instead of failing.
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabaseAdmin = serviceKey
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null
