# DevRoast - React Query + tRPC Implementation Plan

**Document Version**: 1.0.0  
**Last Updated**: March 30, 2026  
**Status**: Ready for Implementation

---

## 1. Overview

This specification outlines when and how to integrate TanStack React Query with tRPC in the DevRoast application. React Query is essential for client-side mutations, real-time updates, and complex state management that server components cannot handle.

### Key Objectives

- Identify critical use cases where React Query is necessary
- Establish mutation patterns for form submissions
- Enable real-time leaderboard updates with background refetching
- Provide clear implementation roadmap with priorities
- Avoid over-engineering (only add React Query where it solves real problems)

---

## 2. Current Architecture Analysis

### What Works Well (Server Components)

| Component | Type | Data Method | Status |
|---|---|---|---|
| **Home Metrics** | Server | `serverTrpc` | ✅ Optimal - no React Query needed |
| **Leaderboard Page** | Server | `serverTrpc` + Suspense | ✅ Optimal - no React Query needed |
| **Results Page** | Server | `serverTrpc` (with fallback) | ✅ Optimal - no React Query needed |

**Why these don't need React Query:**
- Data is fetched on the server and streamed to client
- No user interactions trigger data changes
- Suspense boundaries handle loading states
- Server-side caching is already efficient

### What Needs React Query (Client Mutations)

| Component | Type | Problem | Priority |
|---|---|---|---|
| **Code Submission** | Client | Currently hardcoded to `/results/1` | 🔴 HIGH |
| **Live Leaderboard** | Client | Static page, no auto-refresh | 🟡 MEDIUM |
| **Feedback Generation** | Client | Not yet implemented | 🟡 MEDIUM |

---

## 3. Detailed Use Cases

### 3.1 Code Submission Mutation (HIGH PRIORITY) 🔴

**Location**: `src/components/CodeEditorSection.tsx`

**Current Problem**:
```typescript
const handleStartRoast = () => {
  // TODO: In production, this would send code to API and redirect
  // Currently just hardcoded to /results/1
  router.push('/results/1')
}
```

The app cannot function without this feature. Users need to submit code and get real results.

**What React Query Provides**:
- ✅ Async mutation handling for code submission
- ✅ Loading state (`isPending`) to disable button, show spinner
- ✅ Error handling with user feedback (toast notifications)
- ✅ Optimistic navigation after success
- ✅ Retry logic for failed submissions
- ✅ Type-safe inputs/outputs via tRPC

**Implementation Pattern**:
```typescript
'use client'

import { trpc } from '@/client/trpc'

export function CodeEditorSection() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [roastMode, setRoastMode] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')

  // React Query mutation for submission
  const submitMutation = trpc.submissions.create.useMutation({
    onSuccess: (data) => {
      // Navigate to results page with actual submission ID
      router.push(`/results/${data.id}`)
    },
    onError: (error) => {
      // Show error toast/message
      console.error('Submission failed:', error.message)
      // TODO: Add toast notification
    }
  })

  const handleStartRoast = async () => {
    await submitMutation.mutateAsync({
      code,
      roastMode,
      language: selectedLanguage
    })
  }

  return (
    <div className="w-full max-w-3xl space-y-4">
      {/* Code Editor */}
      <div className="rounded-lg border border-gray-700 bg-gray-900 overflow-hidden">
        {/* ... editor UI ... */}
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <Toggle
          checked={roastMode}
          onChange={(e) => setRoastMode(e.target.checked)}
          label="roast mode"
        />
        <Button
          variant="primary"
          size="md"
          disabled={isCodeEmpty || submitMutation.isPending}
          onClick={handleStartRoast}
        >
          {submitMutation.isPending ? 'submitting...' : 'start the roast'}
        </Button>
      </div>

      {/* Error message */}
      {submitMutation.isError && (
        <div className="text-red-400 text-sm">
          {submitMutation.error?.message || 'Failed to submit code'}
        </div>
      )}
    </div>
  )
}
```

**Required tRPC Procedure**:
```typescript
// src/server/trpc/routes/submissions.ts
import { z } from 'zod'

export const submissionsRouter = router({
  create: publicProcedure
    .input(
      z.object({
        code: z.string().min(1, 'Code cannot be empty'),
        language: z.string(),
        roastMode: z.boolean().optional().default(false),
        title: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Create submission in database
      const submission = await createSubmission({
        code: input.code,
        language: input.language,
        roast_mode: input.roastMode,
        title: input.title,
        description: input.description,
      })

      // Trigger background feedback generation (async)
      // Don't await - let it process in background
      generateFeedback(submission.id).catch(console.error)

      return {
        id: submission.id,
        code: submission.code,
        language: submission.language,
      }
    })
})
```

---

### 3.2 Real-time Leaderboard Updates (MEDIUM PRIORITY) 🟡

**Location**: `src/components/LeaderboardTable.tsx`

**Current Problem**:
- Leaderboard is static (fetched once at page load)
- New submissions don't appear until manual page refresh
- No indication that rankings might have changed

**What React Query Provides**:
- ✅ Background refetch at intervals (e.g., every 30 seconds)
- ✅ Automatic cache invalidation when mutations succeed
- ✅ Optional: Show "refreshing" indicator
- ✅ Optional: Show "new items" badge when data changes

**Implementation Pattern**:
```typescript
'use client'

import { trpc } from '@/client/trpc'

export function LeaderboardTable({ initialData }) {
  // Fetch leaderboard with auto-refetch
  const { data = initialData, isRefetching } = trpc.metrics.getLeaderboard.useQuery(
    undefined,
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      staleTime: 10000, // Consider data stale after 10s
      gcTime: 300000, // Keep in cache for 5 minutes
    }
  )

  return (
    <div className="relative">
      {/* Refreshing indicator */}
      {isRefetching && (
        <div className="absolute top-0 right-0 text-xs text-gray-500">
          updating...
        </div>
      )}

      {/* Table rows */}
      {data?.map((item) => (
        <LeaderboardRow key={item.id} item={item} />
      ))}
    </div>
  )
}
```

**Cache Invalidation on Submission**:
```typescript
// After successful code submission
const submitMutation = trpc.submissions.create.useMutation({
  onSuccess: (data) => {
    // Invalidate leaderboard cache to trigger immediate refresh
    queryClient.invalidateQueries({
      queryKey: [['metrics', 'getLeaderboard']],
    })
    router.push(`/results/${data.id}`)
  },
})
```

**Benefits**:
- Users see new submissions appear on leaderboard automatically
- No manual refresh needed
- Reduces server load (only refetches every 30s, not constantly)
- Can be toggled off for performance if needed

---

### 3.3 Feedback Generation UI (MEDIUM PRIORITY) 🟡

**Location**: `src/app/results/[id]/page.tsx`

**Current Problem**:
```typescript
// Only displays mock feedback, not database feedback
'roastFeedback' in submission && (
  // Shows feedback only for mock data
)
```

**Future Benefit** (when feedback API is ready):
- Show "generating feedback..." state while AI processes
- Display feedback as it becomes available
- Handle cases where feedback takes 10+ seconds to generate
- Show progress indicator or estimated time

**Implementation (Future)**:
```typescript
'use client'

export function FeedbackSection({ submissionId }) {
  const { data: feedback, isLoading } = trpc.feedback.getBySubmissionId.useQuery(
    { submissionId },
    {
      refetchInterval: 5000, // Poll every 5s while generating
      enabled: !!submissionId,
    }
  )

  if (isLoading) {
    return <div>Generating feedback...</div>
  }

  if (!feedback) {
    return <div>No feedback yet</div>
  }

  return (
    <div className="space-y-3">
      {feedback.map((item) => (
        <FeedbackCard key={item.id} feedback={item} />
      ))}
    </div>
  )
}
```

---

## 4. Implementation Roadmap

### Phase 1: Code Submission (HIGH PRIORITY)
**Effort**: 2-3 hours  
**Value**: Critical - app cannot function without it

**Tasks**:
1. Install React Query dependencies (if not already installed)
2. Create `submissions.ts` tRPC router with `create` mutation
3. Implement database mutation handler
4. Update `CodeEditorSection.tsx` to use React Query
5. Add error handling and loading states
6. Test submission flow end-to-end

**Acceptance Criteria**:
- [ ] Users can submit code from the editor
- [ ] Submission data saved to database
- [ ] User redirected to `/results/{id}` after success
- [ ] Loading state shows while submitting
- [ ] Error messages display on failure
- [ ] Build completes with no errors

---

### Phase 2: Leaderboard Auto-Refresh (MEDIUM PRIORITY)
**Effort**: 1-2 hours  
**Value**: Nice-to-have, improves UX

**Tasks**:
1. Convert `LeaderboardContent.tsx` to client component with useQuery
2. Add refetch interval configuration
3. Implement cache invalidation on successful submission
4. Add optional "refreshing..." indicator

**Acceptance Criteria**:
- [ ] Leaderboard automatically refreshes every 30 seconds
- [ ] New submissions appear within 30 seconds
- [ ] Cache invalidates after code submission

---

### Phase 3: Feedback API (MEDIUM PRIORITY, depends on backend)
**Effort**: 3-4 hours  
**Value**: Required for complete feedback display

**Tasks**:
1. Create feedback AI generation API endpoint
2. Create `feedback.ts` tRPC router
3. Implement results page feedback display
4. Add polling/progress indicator while generating

**Acceptance Criteria**:
- [ ] Feedback displays on results page (not just mock data)
- [ ] Progress indicator shows while generating
- [ ] Feedback updates automatically as it's generated

---

### Phase 4: Advanced Features (FUTURE, LOW PRIORITY)
**Effort**: 4+ hours  
**Value**: Enhancement only

**Possible features**:
- Search/filter leaderboard with React Query
- Pagination with lazy loading
- Advanced sorting options
- User preferences/saved submissions
- WebSocket support for real-time updates

---

## 5. Tech Stack Requirements

### New Dependencies
- `@tanstack/react-query` (v5.x) - Data fetching & caching
- `@trpc/tanstack-react-query` (v11.x) - tRPC + React Query integration
- (Optional) `sonner` - Toast notifications for errors

### Existing (Already Installed)
- `@trpc/server` - Already installed
- `@trpc/client` - Already installed
- `zod` - Already installed

---

## 6. Key Design Decisions

### Why NOT to use React Query for everything

**Server components with `serverTrpc`** are better for:
- Static data (leaderboard, metrics)
- Initial page load data
- SEO-critical content
- Reduces client bundle size

**Client components with React Query** are better for:
- User-triggered mutations (form submissions)
- Real-time updates (live data)
- Optimistic updates
- Complex client-side caching

**Our approach: Hybrid**
- Use server components for initial data (Suspense)
- Use React Query for mutations and dynamic updates
- Best of both worlds

### Stale Time vs. Refetch Interval

**For leaderboard**:
```typescript
{
  staleTime: 10000,        // Data considered fresh for 10 seconds
  refetchInterval: 30000,  // Refetch in background every 30 seconds
  gcTime: 300000           // Keep unused data for 5 minutes
}
```

**Why**:
- Fast perceived updates (10s freshness)
- Not hammering server (only refetch every 30s)
- Efficient use of memory

---

## 7. Security Considerations

- ✅ tRPC validates all inputs with Zod before database mutation
- ✅ Prepared statements prevent SQL injection (via Drizzle ORM)
- ✅ All mutations require validation
- ✅ Consider rate limiting on submission endpoint (prevent spam)
- ⚠️ TODO: Add authentication if needed (check access before mutation)

---

## 8. Testing Strategy

### Unit Tests
- [ ] `submissions.create` mutation returns correct response
- [ ] Input validation catches invalid data
- [ ] Database transaction succeeds with valid input
- [ ] Error handling returns proper error messages

### Integration Tests
- [ ] Full code submission flow (editor → mutation → results page)
- [ ] Leaderboard auto-refresh works correctly
- [ ] Cache invalidation triggers on submission
- [ ] Concurrent submissions don't conflict

### Acceptance Tests
- [ ] User can submit code and see results
- [ ] Error messages display on network failure
- [ ] Leaderboard updates within 30 seconds of new submission
- [ ] App builds and deploys without errors

---

## 9. Rollout Plan

### Step 1: Setup (30 minutes)
- [ ] Create tRPC routes for submissions
- [ ] Install React Query if needed
- [ ] Configure QueryClient

### Step 2: Code Submission (1-2 hours)
- [ ] Implement submissions.create mutation
- [ ] Update CodeEditorSection component
- [ ] Add error handling and loading states
- [ ] Test end-to-end flow

### Step 3: Testing & Polish (30-60 minutes)
- [ ] Manual testing in dev environment
- [ ] Error scenarios testing
- [ ] Performance check (no unnecessary refetches)
- [ ] Code review

### Step 4: Optional Enhancements (future)
- [ ] Leaderboard auto-refresh
- [ ] Feedback generation UI
- [ ] Advanced filtering

---

## 10. Dependencies & Breaking Changes

### New Dependencies to Install
```bash
# If not already installed
pnpm add @tanstack/react-query @trpc/tanstack-react-query
pnpm add sonner  # Optional: for toast notifications
```

### Breaking Changes
- None expected
- React Query provider setup is non-intrusive
- Server components remain unchanged

### Migration Guide
1. Install dependencies
2. Add React Query provider to root layout (optional, tRPC might handle this)
3. Create submissions tRPC router
4. Update CodeEditorSection to client component
5. Test submission flow

---

## 11. References

- [tRPC Documentation](https://trpc.io)
- [React Query Documentation](https://tanstack.com/query/latest)
- [tRPC + React Query Integration](https://trpc.io/docs/client/react)
- [DevRoast tRPC Implementation Spec](./TRPC_IMPLEMENTATION.md)
- [DevRoast Database Schema](../DATABASE.md)

---

## 12. FAQ

**Q: Do we need to use React Query right now?**
A: Yes, for code submission mutations. No, for leaderboard (server components work fine).

**Q: Why not use Server Actions instead of tRPC mutations?**
A: tRPC provides type safety and integrates better with our existing setup. Both work, but tRPC is already configured.

**Q: Will React Query slow down the app?**
A: No. It actually improves performance by caching and preventing unnecessary refetches.

**Q: Can we use React Query just for mutations?**
A: Yes! That's what we're doing. Server components handle data fetching, React Query handles mutations.

**Q: When should we add real-time WebSocket support?**
A: After Phase 2 works well. WebSockets are optional—polling every 30s is fine for MVP.

---

**Authors**: OpenCode Agent  
**Status**: Ready for Implementation  
**Next Steps**: Start with Phase 1 (Code Submission)
