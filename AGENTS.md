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
- ✅ **Home Leaderboard Preview** - Top 3 worst submissions preview on home page
- ✅ **Results Page** - Dynamic results page that fetches from database with fallback to mock data
- ✅ **tRPC Integration** - Complete server-client RPC layer with type safety

## What NOT to Build Now

The following components are designed but deferred until feature building:
- **Diff Line** - For code comparison views
- **Score Ring** - For score visualization
- **Advanced Filtering/Sorting** - For leaderboard pagination and filtering

Build these only when their respective features are needed.


