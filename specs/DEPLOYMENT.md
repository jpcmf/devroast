# DevRoast Supabase + Vercel Deployment Plan

**Status**: In Progress
**Last Updated**: April 7, 2026
**Timeline**: ~2-3 hours total

---

## Configuration

✅ **Supabase Connection**: `postgresql://postgres:[PASSWORD]@db.itlvvwbxkihghrydksvh.supabase.co:5432/postgres`
✅ **Keep Current Polling**: No realtime changes needed
✅ **Keep Docker for Local Dev**: For ongoing development reference
✅ **Deploy to Vercel**: Using existing Vercel account
✅ **No Staging**: Direct to production
✅ **Gemini API Key**: Using current development key

---

## Phase 1: Database Migration (30-45 min)

### Step 1.1: Export Current Docker PostgreSQL ✅
```bash
docker exec devroast-db pg_dump -U devroast devroast_db --format plain > devroast_backup.sql
```

**Result**: 
- Backup file created: `devroast_backup.sql` (37 KB, 390 lines)
- Contains full schema and data

### Step 1.2: Import to Supabase (Manual)
1. Go to **Supabase Dashboard** > **SQL Editor**
2. Click **New Query** > **Create blank query**
3. Copy entire contents of `devroast_backup.sql`
4. Paste into editor
5. Click **Run**
6. Wait for success message (~5-10 min)

### Step 1.3: Verify Migration
In Supabase **SQL Editor**, run:
```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check row counts
SELECT COUNT(*) as submissions_count FROM submissions;
SELECT COUNT(*) as feedback_count FROM feedback;
SELECT COUNT(*) as roasts_count FROM roasts;

-- Check latest submissions
SELECT id, code, language, created_at 
FROM submissions 
ORDER BY created_at DESC LIMIT 5;
```

**Expected**: All tables with data intact

---

## Phase 2: Code Configuration (30 min)

### Step 2.1: Extract Supabase Details
From connection string: `postgresql://postgres:[PASSWORD]@db.itlvvwbxkihghrydksvh.supabase.co:5432/postgres`

- **Host**: `db.itlvvwbxkihghrydksvh.supabase.co`
- **Project Ref**: `itlvvwbxkihghrydksvh`
- **Port**: `5432`
- **Database**: `postgres`
- **User**: `postgres`

### Step 2.2: Get Supabase API Keys
From **Supabase Dashboard** > **Settings** > **API**:
- **Project URL**: `https://itlvvwbxkihghrydksvh.supabase.co`
- **ANON_KEY**: (copy from dashboard)
- **SERVICE_ROLE_KEY**: (copy from dashboard)

### Step 2.3: Update `.env.local` with Supabase Credentials
Replace DATABASE_URL and add Supabase keys.

### Step 2.4: Create Supabase Client Library
Create `src/lib/supabase-client.ts` for client-side Supabase access.

### Step 2.5: Verify Drizzle Configuration
Check `drizzle.config.ts` - should already work with Supabase (no changes needed).

### Step 2.6: Test Connection Locally
```bash
pnpm dev
```

Verify: No database connection errors, server ready on `http://localhost:3000`

### Step 2.7: Run Build
```bash
pnpm build
```

Expected: Build completes with zero TypeScript errors

---

## Phase 3: Vercel Deployment (45 min)

### Step 3.1: Create Vercel Account & Link Project
```bash
npm install -g vercel
vercel
```

Follow prompts to create new project: `devroast`

### Step 3.2: Add Environment Variables to Vercel Dashboard
In **Vercel Dashboard** > **Settings** > **Environment Variables**:
- `DATABASE_URL` = Supabase connection string
- `GEMINI_API_KEY` = Current production key
- `NEXT_PUBLIC_SUPABASE_URL` = `https://itlvvwbxkihghrydksvh.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (from Supabase dashboard)

### Step 3.3: Deploy to Production
```bash
vercel --prod
```

Wait for deployment to complete (~2 min).

### Step 3.4: Test Production Deployment
Visit production URL and verify:
- [ ] Home page loads
- [ ] Metrics display
- [ ] Leaderboard loads with data
- [ ] Can submit test code
- [ ] Feedback generates
- [ ] Code appears on leaderboard

---

## Phase 4: Documentation (20 min)

### Step 4.1: Create `DEPLOYMENT.md`
Document production setup for future reference.

### Step 4.2: Create `.env.example`
Template for environment variables.

### Step 4.3: Update `README.md`
Add deployment section with links.

### Step 4.4: Verify `.gitignore`
Ensure `.env`, `.env.local`, `.env.production` are ignored.

---

## Phase 5: Commit & Cleanup (10 min)

### Step 5.1: Commit Changes
```bash
git add .env.example src/lib/supabase-client.ts DEPLOYMENT.md README.md .vercel/project.json
git commit -m "deploy: add Supabase and Vercel production deployment"
git push origin main
```

### Step 5.2: Verify Git
```bash
git status  # Should be clean
git log --oneline -5
```

### Step 5.3: Cleanup
Keep `devroast_backup.sql` as backup reference or delete if confident.

---

## Phase 6: Verification & Monitoring (15 min)

### Step 6.1: Verify Supabase
- **Dashboard** > **Database** > **Tables** - See all 3 tables
- **Dashboard** > **Monitoring** - Check database health
- **Dashboard** > **Backups** - Verify automatic backups enabled

### Step 6.2: Verify Vercel
- **Dashboard** > **Deployments** - Latest shows "Ready"
- **Dashboard** > **Analytics** - Monitor page views
- **Settings** > **Environment Variables** - All 4 variables set

### Step 6.3: Final Production Test
Visit production URL:
- [ ] Home page loads quickly
- [ ] All metrics display
- [ ] Leaderboard shows data
- [ ] Can submit code
- [ ] Feedback generates
- [ ] No console errors

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Version mismatch on export | Use `docker exec devroast-db pg_dump` |
| `DATABASE_URL` not set | Add to Vercel env vars, redeploy |
| Connection refused | Check password, verify Supabase project active |
| Gemini API errors | Verify API key, check credits |
| Build fails | Run `pnpm build` locally, check logs |

---

## Next Steps

1. **Complete Phase 1**: Import backup to Supabase (manual via dashboard)
2. **Complete Phases 2-6**: Execute code changes and deployment
3. **Monitor production** for 24-48 hours
4. **Optional**: Set up realtime updates, custom domain

---

## Files Modified

- `.env.local` - Updated with Supabase credentials
- `src/lib/supabase-client.ts` - New client library
- `DEPLOYMENT.md` - New deployment guide
- `.env.example` - New environment template
- `README.md` - Updated with deployment info
- `.vercel/project.json` - Generated by Vercel CLI

---

## Timeline Summary

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Database Migration | 30-45 min | In Progress (backup created) |
| Phase 2: Code Configuration | 30 min | Pending |
| Phase 3: Vercel Deployment | 45 min | Pending |
| Phase 4: Documentation | 20 min | Pending |
| Phase 5: Commit & Cleanup | 10 min | Pending |
| Phase 6: Verification | 15 min | Pending |
| **Total** | **2-3 hours** | **In Progress** |

