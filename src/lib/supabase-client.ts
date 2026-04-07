/**
 * Supabase Client Configuration
 * 
 * This file initializes the Supabase JavaScript client for the DevRoast application.
 * It's used for read-only operations in the frontend (leaderboard data, feedback display).
 * 
 * Write operations (submissions, feedback creation) go through the tRPC backend,
 * which uses a service role key that bypasses RLS and has rate limiting.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
