'use client'

import { createClient as createSbClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!URL || !KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Singleton browser client
const client: SupabaseClient = createSbClient(URL, KEY)

// ✅ Default export (so `import supabase from '@/lib/supabase'` works)
export default client
// ✅ Named export (so `import { supabase } from '@/lib/supabase'` works)
export { client as supabase }
// ✅ Backwards-compatible shim (so `import { createClient } from '@/lib/supabase'` works)
export function createClient() {
  return client
}
