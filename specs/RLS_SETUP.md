# Supabase RLS Setup Instructions

## File Location
`rls_security_policy.sql` - Contains all Row-Level Security policies for DevRoast

## How to Apply

### Step 1: Open Supabase Dashboard
Go to https://supabase.com/dashboard and select your DevRoast project

### Step 2: Open SQL Editor
- Click **SQL Editor** in the left sidebar
- Click **New Query** (or the "+" button)

### Step 3: Copy & Paste SQL
- Open the file: `rls_security_policy.sql`
- Copy **all content** (everything from `ALTER TABLE` through the last semicolon)
- Paste into the Supabase SQL editor

### Step 4: Run the Query
- You should see a warning: "This query has destructive operations"
- Click **Confirm** to proceed
- Click **Run** (blue button)
- Wait for success message: "Query executed successfully"

### Step 5: Verify RLS is Enabled
In the same SQL editor, run this verification query:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('submissions', 'feedback', 'roasts');
```

**Expected output:**
```
tablename    | rowsecurity
-------------|------------
submissions  | true
feedback     | true
roasts       | true
```

All three should show `rowsecurity = true`

## What This Does

✅ **Allows** public users to READ leaderboard and feedback data
✅ **Blocks** public users from WRITING via the Data API (prevents spam)
✅ **Allows** your tRPC backend to WRITE using service role key
✅ **Protects** against unauthorized data manipulation

## Security Benefits

1. **Leaderboard is safe**: Anyone can view, but can't modify rankings
2. **Feedback is safe**: Anyone can read, but can't fake reviews
3. **Submissions go through your app**: All writes validated by tRPC with rate limiting
4. **No direct API abuse**: Data API is read-only for the public

## Troubleshooting

**If you see "Permission denied" errors:**
- Make sure you're in the Supabase SQL Editor, not a third-party tool
- Verify you're logged in with the correct Supabase account
- Check that the project is the right one (itlvvwbxkihghrydksvh)

**If RLS doesn't enable:**
- Try running the `ALTER TABLE` statements one at a time
- Check if the tables exist first (they should from the backup import)

## Next Steps

Once RLS is applied, proceed with:
1. Phase 3: Update `.env.local` with Supabase credentials
2. Phase 4: Deploy to Vercel
3. Phase 5: Test production deployment
