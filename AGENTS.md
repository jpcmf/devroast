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
- All other components are client components by default
- Use `useId()` hook for dynamic ID generation (not `Math.random()`)

## Scripts

```bash
pnpm dev           # Start development server
pnpm build         # Build for production
pnpm start         # Start production server
pnpm format        # Format code with Biome
pnpm lint          # Lint code with Biome
pnpm check         # Run all Biome checks
```

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

## What NOT to Build Now

The following components are designed but deferred until feature building:
- **Diff Line** - For code comparison views
- **Table Row** - For leaderboard and data tables
- **Score Ring** - For score visualization
- **Navbar** - Already in root layout

Build these only when their respective pages are implemented.

## File Locations Quick Reference

```
src/
├── app/
│   ├── layout.tsx              # Root layout with navbar
│   ├── page.tsx                # Home page
│   ├── globals.css             # Tailwind CSS import
│   └── examples/page.tsx       # Component examples
├── components/
│   ├── index.ts                # Main barrel export
│   └── ui/
│       ├── Button.tsx
│       ├── Toggle.tsx
│       ├── Card.tsx
│       ├── BadgeStatus.tsx
│       ├── CodeBlock.tsx
│       └── index.ts
└── types/
    └── css.d.ts                # CSS module types
```
