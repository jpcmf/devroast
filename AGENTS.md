# DevRoast Project - Development Guide for Agents

This document provides concise patterns and guidelines for continuing development on the DevRoast project.

## Project Overview

**DevRoast** is a code review application with a dark, terminal-inspired aesthetic. Users can submit code snippets and receive brutally honest feedback, with a leaderboard showcasing the "worst" code on the internet.

## Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS v4 + tailwind-variants
- **Language**: TypeScript
- **Code Highlighting**: Shiki (server-side only)
- **Linting**: Biome
- **Package Manager**: pnpm
- **Font**: JetBrains Mono (global)

## Core Components

All components are located in `src/components/ui/` and follow a consistent pattern:

### 1. Button
- **Variants**: primary, secondary, link, danger, ghost
- **Sizes**: sm, md, lg
- **Pattern**: Single component with `buttonVariants` and named export

### 2. Toggle
- **Variants**: checked/unchecked states
- **Sizes**: sm, md, lg
- **Pattern**: Supports both controlled and uncontrolled modes with `useState`
- **Key**: Uses `useId()` for SSR-safe ID generation

### 3. Card (Composable)
- **Subcomponents**: `Card.Header`, `Card.Badge`, `Card.Label`, `Card.Title`, `Card.Description`
- **Pattern**: Compound component with flexible composition
- **Usage**: Allows mixing and matching subcomponents freely

### 4. BadgeStatus
- **Variants**: critical, warning, good, needs_serious_help
- **Pattern**: Simple single component with colored dot + text

### 5. CodeBlock (Server-Only)
- **Features**: Uses Shiki with Vesper theme
- **Pattern**: Async server component (no `'use client'`)
- **Key**: Renders syntax-highlighted code on server side

### 6. ScoreCardSkeleton
- **Features**: Animated skeleton loading state for score cards
- **Pattern**: Client component with pulsing animation
- **Key**: Shows placeholder boxes while AI feedback is being generated
- **Location**: `src/components/ScoreCardSkeleton.tsx`

## Component Creation Pattern

### File Structure
```
src/components/
├── ui/
│   ├── ComponentName.tsx      # Component implementation
│   └── index.ts               # Barrel export
└── index.ts                   # Main export
```

### Implementation Template
```typescript
'use client'  // Only if client-side interactivity needed

import { HTMLAttributes, forwardRef } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

// Define variants
const componentVariants = tv({
  base: 'base-classes',
  variants: {
    variant: { primary: '...', secondary: '...' },
    size: { sm: '...', md: '...', lg: '...' }
  },
  defaultVariants: { variant: 'primary', size: 'md' }
})

// TypeScript interface
interface ComponentProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {}

// Component with forwardRef
const Component = forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => (
    <element
      ref={ref}
      className={componentVariants({ variant, size, class: className })}
      {...props}
    />
  )
)

Component.displayName = 'Component'

// Named exports only
export { Component, componentVariants, type ComponentProps }
```

### Key Rules
- ✅ Use `tailwind-variants` (tv) for all styling
- ✅ Pass `className` to `tv()` using `class:` parameter
- ✅ Extend native HTML element interfaces
- ✅ Use `forwardRef` for ref forwarding
- ✅ Use **named exports only** (no default exports)
- ✅ Use Tailwind classes only (no hex colors)
- ✗ Never use `tailwind-merge`
- ✗ Never use `'use client'` unless necessary
- ✗ Never use default exports

## Styling Conventions

### Colors
- **Background**: `bg-gray-950` (primary), `bg-gray-900` (containers)
- **Text**: `text-gray-100` (headings), `text-gray-400` (labels), `text-gray-300` (body)
- **Borders**: `border-gray-700`
- **Accent**: `emerald-500` (primary action/highlight)
- **Status**: red (critical), amber (warning), green (success), blue (info)

### Layout
- **Max Width**: `max-w-3xl` for content sections
- **Padding**: `px-10 py-20` for page sections
- **Gap**: `gap-8` for major sections, `gap-4` for minor sections
- **Border Radius**: `rounded-lg` for containers

## Global Patterns

### Pages & Layout
- **Root Layout**: `src/app/layout.tsx` - Contains sticky navbar, global styling
- **Navbar**: Fixed to all pages, includes logo and navigation links
- **Background**: Dark theme (`bg-gray-950`) applied globally
- **Font**: JetBrains Mono for all text via CSS variable

### Export Strategy
- UI components exported from `src/components/ui/index.ts`
- All components re-exported from `src/components/index.ts`
- Import components directly: `import { Button, Card } from '@/components'`

### SSR Considerations
- CodeBlock is a server component (async, no `'use client'`)
- Use server components with Suspense boundaries for data fetching
- Client components with `'use client'` for interactive features (forms, animations)
- Use `useId()` hook for dynamic ID generation (not `Math.random()`)

### Data Fetching Pattern
- **Server Components**: Use `serverTrpc` from `@/server/trpc/server.tsx` to call procedures directly
- **Client Components**: Use tRPC client hooks for real-time data and interactivity
- **Suspense**: Wrap async components with `<Suspense>` and provide `Skeleton` loading states
- **Example**:
```typescript
// Server component with Suspense
import { Suspense } from 'react'
import { serverTrpc } from '@/server/trpc/server'

async function MetricsSection() {
  const data = await serverTrpc.metrics.getTotal()
  return <MetricsContent data={data} />
}

export default function Page() {
  return (
    <Suspense fallback={<MetricsSkeleton />}>
      <MetricsSection />
    </Suspense>
  )
}
```

## Scripts

```bash
pnpm dev           # Start development server
pnpm build         # Build for production
pnpm start         # Start production server
pnpm format        # Format code with Biome
pnpm lint          # Lint code with Biome
pnpm check         # Run all Biome checks
```

## Git Workflow & Committing

⚠️ **IMPORTANT**: When working on feature branches, **DO NOT create commits automatically**. Always ask for explicit confirmation before committing changes.

### Guidelines:
- **Ask first**: Before committing any changes, ask the user for permission
- **Show changes**: Always display `git status` and `git diff` so the user can review
- **Feature branches**: We typically work on branches like `feat/leaderboard-page`
- **No force pushes**: Never use `git push --force` without explicit instruction
- **Keep implementations**: If undoing commits, use `git reset --soft` to preserve code changes

### Example Workflow:
1. Implement feature/fix
2. Run `pnpm build` to verify
3. Show user the changes with `git status`
4. **Ask**: "Should I commit these changes?"
5. Only commit if user explicitly agrees

## Common Tasks

### Add New Component
1. Create `src/components/ui/ComponentName.tsx`
2. Export from `src/components/ui/index.ts`
3. Add examples to `src/app/examples/page.tsx`
4. Run `pnpm build` to verify

### Update Styling
- Modify Tailwind classes directly in components
- Use `tailwind-variants` for conditional styling
- Never use inline styles or hex colors

### Add New Page
1. Create `src/app/[route]/page.tsx`
2. Use existing components
3. Navbar is inherited from root layout
4. Background color is global

## What's Implemented

The following features are now complete with real data integration:
- ✅ **Metrics Display** - Home page metrics showing total roasts and average score with animations
- ✅ **Leaderboard Pages** - Full leaderboard page with real database data
- ✅ **Leaderboard Pagination** - Server-side pagination with 10 items per page and client-side controls
- ✅ **Home Leaderboard Preview** - Top 3 worst submissions preview on home page
- ✅ **Results Page** - Dynamic results page that fetches from database with fallback to mock data
- ✅ **tRPC Integration** - Complete server-client RPC layer with type safety
- ✅ **Code Submission** - Full submission workflow with rate limiting and validation
- ✅ **AI Feedback Generation** - Gemini API integration for code analysis (standard + roast modes)
- ✅ **Real-time Score Card** - Skeleton loading + instant updates when feedback arrives
- ✅ **Async Feedback Processing** - Background task processing with `setImmediate()`
- ✅ **Database Cleanup** - Reduced database to 15 most recent submissions

## What NOT to Build Now

The following components are designed but deferred until feature building:
- **Diff Line** - For code comparison views
- **Score Ring** - For score visualization
- **Advanced Filtering/Sorting** - For leaderboard advanced filtering and sorting beyond basic pagination

Build these only when their respective features are needed.

## Code Submission & AI Feedback System

### Architecture Overview

The code submission system handles user submissions, generates AI feedback, and displays results with real-time updates.

**Flow**:
1. User submits code via form → tRPC `submissions.create` endpoint
2. Submission stored in database, user redirected to results page
3. Background task generates AI feedback using Gemini API
4. Results page polls for feedback and updates score card in real-time
5. Feedback displayed with calculated severity breakdown

### Key Components

#### Server-Side (Backend)

**`src/server/trpc/routes/submissions.ts`** - tRPC submission endpoint
- **Procedure**: `submissions.create`
- **Validation**: Code length (1-50k chars), language enum, roast mode boolean
- **Rate Limiting**: Per-IP limit + global 30-second cooldown
- **HTML Injection Protection**: Blocks `<script>`, `<style>`, `<img>`, etc. tags
- **Background Processing**: Uses `setImmediate()` to trigger async feedback generation

**`src/server/lib/submissions.ts`** - Submission processing
- `createNewSubmission()` - Creates submission record in database
- `generateAndSaveFeedback()` - Generates AI feedback and saves to database
- Handles severity score normalization (1-10 → 1-100 scale)

**`src/server/lib/gemini.ts`** - Gemini API integration
- `generateFeedback()` - Calls Gemini Flash model with code analysis prompt
- **Modes**: Standard (professional) and Roast (sarcastic)
- **Output**: Extracts severity score (1-10), counts issues and recommendations
- **Error Handling**: Comprehensive logging for debugging API failures

**`src/server/lib/rate-limiter.ts`** - Rate limiting
- Per-IP submission limit (configurable, default: 10 per hour)
- Global cooldown between submissions (30 seconds)
- Extraction of client IP from various proxy headers (x-forwarded-for, cf-connecting-ip, x-real-ip)

**`src/app/api/feedback/[id]/route.ts`** - Feedback API endpoint
- **Route**: `GET /api/feedback/[submissionId]`
- **Returns**: Latest feedback for a submission or null if not yet generated
- **Used by**: Results page polling mechanism

#### Client-Side (Frontend)

**`src/app/results/[id]/ResultsContent.tsx`** - Results page client component
- **Polling**: Checks for feedback every 2 seconds (120-second timeout)
- **Real-time Updates**: Calculates and updates score card when feedback arrives
- **State Management**: Tracks `isLoading`, `aiFeedback`, `shameScore`, `severityScore`, `roastSummary`
- **Skeleton Loading**: Shows `ScoreCardSkeleton` while waiting for feedback
- **Instant Display**: No page reload needed - updates happen in-place

**`src/lib/severity.ts`** - Severity calculation utility
- `extractSeverityBreakdown()` - Calculates critical/warning/good issue counts
- **Inputs**: AI feedback object, severity score (0-100)
- **Outputs**: `{ critical: number, warning: number, good: number }`
- **Used by**: Both server (initial render) and client (real-time updates)

**`src/components/ScoreCardSkeleton.tsx`** - Loading skeleton
- Animated placeholder matching score card layout
- Pulsing gray boxes for: score number, "/10" text, issue indicators
- Smooth transition when content loads

### Database Schema

**`submissions` table**:
```typescript
{
  id: uuid,
  code: string,
  language: enum,
  roastMode: boolean,
  severityScore: integer (0-100),
  viewCount: integer,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**`feedback` table**:
```typescript
{
  id: uuid,
  submissionId: uuid (FK),
  feedbackType: enum ('standard' | 'roast'),
  content: text,
  issuesFound: integer,
  recommendationsCount: integer,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Configuration

**Environment Variables**:
- `GEMINI_API_KEY` - Google Gemini API key (required for AI generation)
- `DATABASE_URL` - PostgreSQL connection string

**API Settings**:
- Gemini Model: `gemini-flash-latest` (fast, cost-effective)
- Gemini Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`

## Leaderboard Pagination System

### Architecture Overview

The leaderboard implements server-side pagination with client-side navigation controls for efficient data loading and better UX.

**Flow**:
1. Leaderboard page loads → server fetches first page (page 1, pageSize 10)
2. `LeaderboardInitial` async server component loads initial data
3. Page renders with `LeaderboardContent` client component
4. User clicks pagination buttons → client fetches new page via tRPC
5. Data updates in-place without page reload

### Key Components

#### Server-Side (Backend)

**`src/server/trpc/routes/metrics.ts`** - tRPC pagination procedure
- **Procedure**: `metrics.getLeaderboard`
- **Input**: `{ page: number, pageSize: number }`
- **Validation**: page ≥ 1, pageSize between 1-100
- **Calculation**: `offset = (page - 1) * pageSize`
- **Returns**: Structured response with items array and pagination metadata
  ```typescript
  {
    items: [{ id, rank, score, code, language, createdAt }, ...],
    pagination: { page, pageSize, totalCount, totalPages }
  }
  ```
- **Database Query**: Uses `LIMIT` and `OFFSET` for efficient pagination

#### Client-Side (Frontend)

**`src/components/LeaderboardContent.tsx`** - Client component managing pagination
- **Conversion**: Converted from server component to client component (`'use client'`)
- **State Management**: Manages `currentPage`, `data`, `isLoading`
- **Page Change Handler**: 
  - Validates page number bounds
  - Fetches new data via `/api/trpc/metrics.getLeaderboard`
  - Parses tRPC response structure
  - Updates state and scrolls to top smoothly
- **Pagination Controls**:
  - Previous/Next buttons (disabled at boundaries)
  - Smart page numbers with ellipsis (...) for gaps
  - Shows only: first page, last page, current page, ±1 adjacent pages
  - Page info display: "page X of Y • Z total"
- **Error Handling**: Catches fetch errors and logs to console

**`src/app/leaderboard/page.tsx`** - Leaderboard page structure
- **Server Component**: Parent async component that fetches stats and initial data
- **LeaderboardInitial**: Async server component that fetches first page
- **Suspense Boundary**: Wraps pagination with skeleton loader fallback

### Database Queries

The pagination queries are optimized with:
- `OFFSET (page - 1) * pageSize LIMIT pageSize` for efficient record fetching
- `COUNT(*)` for total count (used only once at page render)
- Ordering by severity score DESC for consistent ranking

### Implementation Details

#### Pagination Controls Logic

```typescript
// Smart page number display
const visiblePages = [1, lastPage, currentPage, currentPage - 1, currentPage + 1]
  .filter(page => page >= 1 && page <= lastPage)
  .sort((a, b) => a - b)
  .filter((page, idx, arr) => {
    // Remove duplicates, add ellipsis between gaps
    const prevPage = arr[idx - 1];
    return idx === 0 || page !== prevPage;
  })

// Shows: [1] ... [2] [3] [4] ... [N] (with ellipsis between gaps)
```

#### Client Fetch Pattern

```typescript
const response = await fetch(
  `/api/trpc/metrics.getLeaderboard?input=${JSON.stringify({ page: newPage, pageSize })}`
);
const result = await response.json();
// result.result.data contains the pagination response
setData(result.result.data);
```

### Common Pagination Tasks

#### Adjust Page Size
Change `pageSize` constant in `LeaderboardContent.tsx:35` from `10` to desired value (1-100).

#### Modify Pagination Controls Display
Update filtering logic in `LeaderboardContent.tsx:88-93` to show different page numbers or change ellipsis display.

#### Debug Pagination Issues
1. Check browser console for fetch errors
2. Verify `/api/trpc/metrics.getLeaderboard` returns correct structure
3. Check database for total submission count: `SELECT COUNT(*) FROM roasts;`
4. Verify pagination response: `console.log('Pagination data:', data);`

#### Test Different Page Counts
```bash
# Check current submission count
psql $DATABASE_URL -c "SELECT COUNT(*) FROM roasts;"

# Results with 15 submissions:
# - 2 pages with pageSize 10
# - 3 pages with pageSize 5
# - 5 pages with pageSize 3
```

### Common Tasks

#### Submit Test Code
```bash
curl -X POST "http://localhost:3000/api/trpc/submissions.create" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function test() { return 1; }",
    "language": "javascript",
    "roastMode": true
  }'
```

#### Check Feedback Generation
Monitor logs for `[Submissions]` and `[Gemini]` prefixed messages. Check database:
```sql
SELECT s.id, s.created_at, f.created_at, f.content 
FROM submissions s 
LEFT JOIN feedback f ON s.id = f.submission_id 
ORDER BY s.created_at DESC LIMIT 5;
```

#### Debug Polling Issues
- Check browser console for `[ResultsContent]` logs
- Verify `/api/feedback/[id]` endpoint returns null initially, then feedback object
- Check database that feedback row is being created (might take 5-30 seconds)

#### Extend Severity Calculation
Modify `src/lib/severity.ts` `extractSeverityBreakdown()` function to change how critical/warning/good counts are calculated based on feedback content.
