# DevRoast - tRPC Implementation Specification

**Document Version**: 1.0.0  
**Last Updated**: April 7, 2026  
**Status**: Completed

---

## 1. Overview

This specification outlines the implementation of tRPC as the API/backend layer for DevRoast. tRPC is an end-to-end typesafe RPC framework that enables seamless communication between the Next.js frontend and backend, with full TypeScript support and automatic type inference.

### Key Objectives

- Establish a type-safe API layer with automatic type inference across client and server
- Integrate tRPC with Next.js App Router and React Server Components (RSC)
- Enable efficient data fetching using TanStack React Query with server-side rendering (SSR)
- Support both server components and client components data fetching patterns
- Create procedures for CRUD operations on submissions, feedback, and roasts
- Implement proper error handling and validation with Zod
- Enable server-side query prefetching for optimal performance with streaming

---

## 2. Tech Stack

### Backend & RPC
- **tRPC**: v11.x (RPC framework)
- **@trpc/server**: v11.x (backend implementation)
- **@trpc/client**: v11.x (client library)
- **@trpc/tanstack-react-query**: v11.x (React Query integration)

### Frontend & State Management
- **TanStack React Query**: Latest version (data fetching & caching)
- **@tanstack/react-query**: Latest version (query client)

### Validation & Types
- **Zod**: Latest version (input/output validation)

### Next.js Integration
- **Next.js**: v16.1.7 (existing)
- **React**: v19.2.4 (existing)
- **React Server Components**: Built-in Next.js App Router

### Utilities
- **client-only**: Package to prevent server code in client bundles
- **server-only**: Package to prevent client code in server bundles

---

## 3. Architecture Design

### 3.1 Directory Structure

```
src/
├── server/
│   ├── trpc/
│   │   ├── init.ts                 # tRPC initialization & context
│   │   ├── router.ts               # Root router combining all routes
│   │   ├── query-client.ts         # QueryClient factory
│   │   ├── routes/
│   │   │   ├── submissions.ts      # Submissions procedures
│   │   │   ├── feedback.ts         # Feedback procedures
│   │   │   ├── roasts.ts           # Roasts/Leaderboard procedures
│   │   │   └── health.ts           # Health check procedure
│   │   └── context.ts              # Context creation & types
│   └── api/
│       └── trpc/
│           └── [trpc]/
│               └── route.ts         # Fetch adapter endpoint
│
├── lib/
│   ├── trpc.ts                     # Client provider & hooks
│
└── app/
    ├── layout.tsx                  # Root layout with tRPC provider
    └── (routes)/
```

### 3.2 Data Flow Architecture

#### Server Components (RSC) → Prefetch → Client Components

```
┌─────────────────────────────────────────────────────────────────┐
│                       Server Component (RSC)                     │
│  - Uses trpc.server (caller/options proxy)                       │
│  - Calls prefetchQuery() to start data fetch                     │
│  - Wraps children in HydrationBoundary with dehydrated state    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
           Data streams from server to client
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       HydrationBoundary                           │
│  - Provides dehydrated query state to client tree               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Client Component                              │
│  - Uses useTRPC() hook to access typed trpc instance            │
│  - Calls useQuery() with queryOptions from server               │
│  - Data is hydrated from server state on mount                  │
│  - Cache prevents refetch if data is still fresh                │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 File Structure Details

#### `src/server/trpc/init.ts`

Initializes tRPC with context and creates helper functions.

```typescript
import { initTRPC } from '@trpc/server';
import { cache } from 'react';

export const createTRPCContext = cache(async () => {
  // Context shared across all procedures
  // Add auth, user info, database clients, etc.
  return {
    userId: 'user_123',  // Replace with actual auth
  };
});

const t = initTRPC.create({
  // Optional: transformer: superjson (for custom types)
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
```

#### `src/server/trpc/routes/submissions.ts`

Query and mutation procedures for code submissions.

```typescript
import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { db } from '@/db/client';
import { submissions } from '@/db/schema';

export const submissionsRouter = createTRPCRouter({
  // Query: Get all submissions with pagination
  list: baseProcedure
    .input(
      z.object({
        limit: z.number().int().positive().max(100).default(20),
        offset: z.number().int().nonnegative().default(0),
      })
    )
    .query(async (opts) => {
      const items = await db
        .select()
        .from(submissions)
        .limit(opts.input.limit)
        .offset(opts.input.offset);
      
      return items;
    }),

  // Query: Get single submission by ID
  getById: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async (opts) => {
      const item = await db
        .select()
        .from(submissions)
        .where(eq(submissions.id, opts.input.id))
        .limit(1);
      
      return item[0];
    }),

  // Mutation: Create new submission
  create: baseProcedure
    .input(
      z.object({
        code: z.string().min(1),
        language: z.enum(['javascript', 'python', 'rust', /* ... */]),
        title: z.string().optional(),
        description: z.string().optional(),
        roastMode: z.boolean().default(false),
      })
    )
    .mutation(async (opts) => {
      const result = await db
        .insert(submissions)
        .values(opts.input)
        .returning();
      
      return result[0];
    }),
});
```

#### `src/server/trpc/router.ts`

Combines all route routers into the main router.

```typescript
import { createTRPCRouter } from './init';
import { submissionsRouter } from './routes/submissions';
import { feedbackRouter } from './routes/feedback';
import { roastsRouter } from './routes/roasts';
import { healthRouter } from './routes/health';

export const appRouter = createTRPCRouter({
  submissions: submissionsRouter,
  feedback: feedbackRouter,
  roasts: roastsRouter,
  health: healthRouter,
});

export type AppRouter = typeof appRouter;
```

#### `src/server/api/trpc/[trpc]/route.ts`

HTTP endpoint handler using fetch adapter.

```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '@/server/trpc/init';
import { appRouter } from '@/server/trpc/router';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
```

#### `src/client/trpc/query-client.tsx`

Factory for creating QueryClient instances with proper SSR config.

```typescript
import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from '@tanstack/react-query';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,  // 30 seconds
      },
      dehydrate: {
        // Include pending queries for streaming from server
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      hydrate: {
        // Optional: deserializeData if using superjson
      },
    },
  });
}
```

#### `src/client/trpc/client.tsx`

Client-side tRPC setup with context provider.

```typescript
'use client';

import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { useState } from 'react';
import { makeQueryClient } from './query-client';
import type { AppRouter } from '@/server/trpc/router';

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient;

function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

function getUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') return '';
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return 'http://localhost:3000';
  })();
  return `${base}/api/trpc`;
}

export function TRPCReactProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [httpBatchLink({ url: getUrl() })],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
```

#### `src/server/trpc/server.tsx`

Server-side tRPC caller for prefetching in RSC.

```typescript
import 'server-only';

import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { cache } from 'react';
import { createTRPCContext } from './init';
import { makeQueryClient } from '@/client/trpc/query-client';
import { appRouter } from './router';
import type { AppRouter } from './router';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

// Helper: Prefetch and hydrate
export function HydrateClient({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}

// Helper: Shorthand for prefetching queries
export async function prefetchQuery<T extends ReturnType<typeof trpc[string]['queryOptions']>>(
  queryOptions: T
) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(queryOptions as any);
}

// Direct caller for server-only operations
export const caller = appRouter.createCaller(createTRPCContext);
```

---

## 4. Implementation Details

### 4.1 Setup & Installation

#### Step 1: Install Dependencies

```bash
pnpm add @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query zod client-only server-only
```

#### Step 2: Create tRPC Initialization

1. Create `src/server/trpc/init.ts`
2. Create `src/server/trpc/context.ts` for context types
3. Set up cache function for proper request-scoped context

#### Step 3: Create Routers

1. Create `src/server/trpc/routes/` directory
2. Implement routers for:
   - `submissions.ts` - CRUD for code submissions
   - `feedback.ts` - Feedback operations
   - `roasts.ts` - Leaderboard/ranking
   - `health.ts` - Health check
3. Combine in `src/server/trpc/router.ts`

#### Step 4: Create API Handler

1. Create `src/app/api/trpc/[trpc]/route.ts`
2. Use `fetchRequestHandler` from `@trpc/server/adapters/fetch`
3. Wire up context and router

#### Step 5: Create Client Setup

1. Create `src/client/trpc/query-client.tsx`
2. Create `src/client/trpc/client.tsx` with provider
3. Create `src/server/trpc/server.tsx` for SSR helpers
4. Create `src/client/components/trpc-provider.tsx` wrapper

#### Step 6: Update Root Layout

```typescript
// app/layout.tsx
import { TRPCReactProvider } from '@/client/trpc/client';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <TRPCReactProvider>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
```

### 4.2 Key Implementation Patterns

#### Pattern 1: Server Component Prefetching

```typescript
// app/submissions/page.tsx (Server Component)
import { HydrateClient, prefetchQuery, trpc } from '@/server/trpc/server';
import { SubmissionsList } from './submissions-list';

export default async function SubmissionsPage() {
  // Prefetch on server - data streams to client
  await prefetchQuery(
    trpc.submissions.list.queryOptions({
      limit: 20,
      offset: 0,
    })
  );

  return (
    <HydrateClient>
      <SubmissionsList />
    </HydrateClient>
  );
}
```

#### Pattern 2: Client Component Data Fetching

```typescript
// app/submissions/submissions-list.tsx (Client Component)
'use client';

import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/client/trpc/client';

export function SubmissionsList() {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.submissions.list.queryOptions({
      limit: 20,
      offset: 0,
    })
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.map((submission) => (
        <div key={submission.id}>{submission.title}</div>
      ))}
    </div>
  );
}
```

#### Pattern 3: Mutations

```typescript
'use client';

import { useMutation } from '@tanstack/react-query';
import { useTRPC } from '@/client/trpc/client';

export function CreateSubmissionForm() {
  const trpc = useTRPC();
  const { mutate, isPending } = useMutation(
    trpc.submissions.create.mutationOptions()
  );

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      mutate({
        code: '...',
        language: 'javascript',
        title: 'My Code',
      });
    }}>
      {/* Form fields */}
    </form>
  );
}
```

#### Pattern 4: Error Handling & Validation

```typescript
// In router procedure
import { TRPCError } from '@trpc/server';

export const submissionsRouter = createTRPCRouter({
  getById: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async (opts) => {
      const item = await db
        .select()
        .from(submissions)
        .where(eq(submissions.id, opts.input.id));

      if (!item.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Submission not found',
        });
      }

      return item[0];
    }),
});
```

---

## 5. API Procedures Specification

### 5.1 Submissions Procedures

| Method | Procedure | Input | Returns | Purpose |
|--------|-----------|-------|---------|---------|
| Query | `submissions.list` | `{ limit: number, offset: number }` | `Submission[]` | Get paginated submissions |
| Query | `submissions.getById` | `{ id: string }` | `Submission \| null` | Get single submission |
| Mutation | `submissions.create` | `{ code: string, language: string, title?: string, description?: string, roastMode?: boolean }` | `Submission` | Create new submission |
| Mutation | `submissions.update` | `{ id: string, ...updates }` | `Submission` | Update submission |
| Mutation | `submissions.delete` | `{ id: string }` | `{ success: boolean }` | Delete submission |

### 5.2 Feedback Procedures

| Method | Procedure | Input | Returns | Purpose |
|--------|-----------|-------|---------|---------|
| Query | `feedback.getBySubmissionId` | `{ submissionId: string }` | `Feedback[]` | Get feedback for submission |
| Mutation | `feedback.create` | `{ submissionId: string, feedbackType: string, content: string, issuesFound?: number }` | `Feedback` | Create feedback |

### 5.3 Roasts (Leaderboard) Procedures

| Method | Procedure | Input | Returns | Purpose |
|--------|-----------|-------|---------|---------|
| Query | `roasts.leaderboard` | `{ limit: number, offset: number }` | `Roast[]` | Get ranked submissions |
| Query | `roasts.getBySubmissionId` | `{ submissionId: string }` | `Roast \| null` | Get roast for submission |

### 5.4 Health Check

| Method | Procedure | Input | Returns | Purpose |
|--------|-----------|-------|---------|---------|
| Query | `health.status` | `{}` | `{ status: 'ok' }` | Verify API is running |

---

## 6. Testing Strategy

### Unit Tests

- [ ] Test Zod validation for all procedure inputs
- [ ] Test successful query returns correct data structure
- [ ] Test mutations correctly update database
- [ ] Test error handling (NOT_FOUND, UNAUTHORIZED, etc.)
- [ ] Test edge cases (empty lists, invalid IDs, etc.)

### Integration Tests

- [ ] Test server component prefetch → client hydration flow
- [ ] Test mutation cache invalidation on successful operations
- [ ] Test error boundary displays error from tRPC
- [ ] Test concurrent queries don't cause race conditions
- [ ] Test pagination works correctly across multiple requests

### E2E Tests

- [ ] User flow: View submissions → Filter/Sort → Open submission
- [ ] User flow: Submit code → View feedback → See leaderboard
- [ ] User flow: Create submission → Edit → Delete
- [ ] Network error handling and retry behavior
- [ ] Streaming from server and hydration on client

### Acceptance Criteria

- [ ] All tRPC procedures accessible from client with full type safety
- [ ] Server components can prefetch data before rendering
- [ ] Client components properly hydrate prefetched data
- [ ] No type mismatches between server and client
- [ ] Error messages are helpful and properly formatted
- [ ] Query caching works correctly (no unnecessary refetches)
- [ ] Mutations properly invalidate related queries
- [ ] All procedures validated with Zod schemas
- [ ] API endpoint responds to both GET and POST

---

## 7. Dependencies & Breaking Changes

### New Dependencies

- `@trpc/server` (v11.x): Backend RPC framework
- `@trpc/client` (v11.x): Client RPC library
- `@trpc/tanstack-react-query` (v11.x): React Query integration
- `@tanstack/react-query` (latest): Query client and caching
- `zod` (latest): Input/output validation
- `client-only`: Prevents server code in client bundles
- `server-only`: Prevents client code in server bundles

### New Environment Variables

None required for basic setup. Optional:
- `VERCEL_URL`: For Vercel deployments (auto-detected)

### Breaking Changes

None. tRPC is additive and doesn't conflict with existing REST API patterns.

### Migration Path

If existing REST API endpoints exist:
1. Create parallel tRPC routers
2. Gradually migrate client code to use tRPC
3. Keep old endpoints until all clients migrated
4. Remove old endpoints

---

## 8. Rollout Plan

### Phase 1: Setup & Foundation
- [ ] Install all dependencies
- [ ] Create tRPC initialization files
- [ ] Create API handler endpoint
- [ ] Set up client provider
- [ ] Update root layout

### Phase 2: Core Routers
- [ ] Implement submissions router
- [ ] Implement feedback router
- [ ] Implement roasts router
- [ ] Add health check procedure
- [ ] Test all procedures with tRPC Devtools

### Phase 3: Integration
- [ ] Create server.tsx helpers for prefetching
- [ ] Update submission list page to use tRPC
- [ ] Update submission detail page
- [ ] Update feedback display components
- [ ] Update leaderboard page

### Phase 4: Testing & Optimization
- [ ] Unit test all procedures
- [ ] Integration test RSC prefetch flow
- [ ] E2E test user flows
- [ ] Performance testing (query times, bundle size)
- [ ] Set up monitoring/logging

### Phase 5: Documentation & Deployment
- [ ] Document all API procedures
- [ ] Create developer guide
- [ ] Deploy to staging
- [ ] Deploy to production
- [ ] Monitor for errors

---

## 9. Performance Considerations

### Query Optimization

1. **Batch Requests**: tRPC automatically batches multiple queries into single HTTP request
2. **Stale Time**: Default 30 seconds - queries won't refetch within this window
3. **Server Prefetch**: Start queries on server before rendering client
4. **Streaming**: Hydrate boundaries allow data to stream as available

### Bundle Size

- tRPC adds ~5KB gzipped
- Only server types are imported (never sent to client)
- Use `import type` to strip type imports at compile time

### Data Transfer

- Use `httpBatchLink` to batch multiple queries
- Consider data transformer (superjson) for complex types
- Pagination prevents loading all data at once

---

## 10. References

### Official Documentation
- [tRPC Documentation](https://trpc.io/docs)
- [Server Components Setup](https://trpc.io/docs/client/tanstack-react-query/server-components)
- [TanStack React Query Setup](https://trpc.io/docs/client/tanstack-react-query/setup)
- [Next.js Integration](https://trpc.io/docs/client/nextjs)

### Related Specifications
- [DRIZZLE_IMPLEMENTATION.md](./DRIZZLE_IMPLEMENTATION.md) - Database layer

### Project Context
- Tech Stack: Next.js 16, React 19, Drizzle ORM, PostgreSQL
- Database: Already implemented with schema for submissions, feedback, roasts

---

**Authors**: Development Team  
**Created**: March 29, 2026  
**Last Updated**: April 7, 2026  
**Status**: Completed
