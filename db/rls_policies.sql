-- DevRoast Row-Level Security (RLS) Policy
-- This secures the database by:
-- 1. Allowing public READ access (for leaderboard, feedback display)
-- 2. Blocking public WRITE access (prevents spam/abuse via Data API)
-- 3. Allowing backend writes via tRPC (uses service role key, bypasses RLS)

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roasts ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ALLOW PUBLIC READ ACCESS (SELECT)
-- ============================================================================
-- These policies let anyone read data via the Data API
-- Required for: leaderboard display, feedback viewing, ranking data

CREATE POLICY "submissions_select_public" ON public.submissions
  FOR SELECT USING (true);

CREATE POLICY "feedback_select_public" ON public.feedback
  FOR SELECT USING (true);

CREATE POLICY "roasts_select_public" ON public.roasts
  FOR SELECT USING (true);

-- ============================================================================
-- BLOCK PUBLIC WRITE ACCESS (INSERT, UPDATE, DELETE)
-- ============================================================================
-- These policies block direct writes via Data API
-- All writes go through tRPC backend which:
-- - Uses service role key (bypasses RLS)
-- - Has rate limiting
-- - Has input validation
-- - Has HTML injection protection

-- SUBMISSIONS table
CREATE POLICY "submissions_insert_blocked" ON public.submissions
  FOR INSERT WITH CHECK (false);

CREATE POLICY "submissions_update_blocked" ON public.submissions
  FOR UPDATE WITH CHECK (false);

CREATE POLICY "submissions_delete_blocked" ON public.submissions
  FOR DELETE USING (false);

-- FEEDBACK table
CREATE POLICY "feedback_insert_blocked" ON public.feedback
  FOR INSERT WITH CHECK (false);

CREATE POLICY "feedback_update_blocked" ON public.feedback
  FOR UPDATE WITH CHECK (false);

CREATE POLICY "feedback_delete_blocked" ON public.feedback
  FOR DELETE USING (false);

-- ROASTS table (leaderboard rankings)
CREATE POLICY "roasts_insert_blocked" ON public.roasts
  FOR INSERT WITH CHECK (false);

CREATE POLICY "roasts_update_blocked" ON public.roasts
  FOR UPDATE WITH CHECK (false);

CREATE POLICY "roasts_delete_blocked" ON public.roasts
  FOR DELETE USING (false);

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
-- After running the above policies, verify RLS is enabled:
-- 
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- AND tablename IN ('submissions', 'feedback', 'roasts');
-- 
-- Expected output: All three tables should show rowsecurity = true
-- ============================================================================
