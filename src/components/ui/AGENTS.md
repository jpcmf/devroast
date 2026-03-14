# UI Components Creation Pattern

This document outlines the recommended pattern for creating and maintaining UI components in this project.

## Directory Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx          # Component implementation
│   │   ├── agents.md           # This file - component documentation
│   │   └── index.ts            # Barrel export for ui components
│   └── index.ts                # Barrel export for all components
```

## Component Creation Pattern

### 1. File Naming

- Use **PascalCase** for component files: `Button.tsx`, `Card.tsx`, `Input.tsx`
- Create each component in its own file within `src/components/ui/`

### 2. Component Implementation

Follow this structure for UI components:

```typescript
'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

// 1. Define variants using tailwind-variants
const componentVariants = tv({
  base: 'base-classes',
  variants: {
    variant: {
      primary: 'primary-variant-classes',
      secondary: 'secondary-variant-classes',
    },
    size: {
      sm: 'small-size-classes',
      md: 'medium-size-classes',
      lg: 'large-size-classes',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

// 2. Extend native HTML element interface
interface ComponentProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {}

// 3. Create component with forwardRef for ref forwarding
const Component = forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <element
        ref={ref}
        className={componentVariants({ variant, size, class: className })}
        {...props}
      />
    )
  }
)

// 4. Set display name for debugging
Component.displayName = 'Component'

// 5. Use named exports
export { Component, componentVariants, type ComponentProps }
```

### 3. Key Guidelines

#### Tailwind Variants Configuration

- Use `tailwind-variants` (tv) for managing component variants
- Define variants for:
  - **variant**: different style variations (primary, secondary, danger, ghost)
  - **size**: different sizes (sm, md, lg)
  - **state**: different states (disabled, loading, active)
- Pass `className` to the `tv()` function using the `class` parameter instead of using `tailwind-merge`

#### HTML Element Extension

- Always extend the native HTML element interface corresponding to your component
- Examples:
  - Button → `ButtonHTMLAttributes<HTMLButtonElement>`
  - Input → `InputHTMLAttributes<HTMLInputElement>`
  - Div wrapper → `HTMLAttributes<HTMLDivElement>`

#### TypeScript Patterns

- Use `forwardRef` for components that may need direct DOM access
- Create a `ComponentProps` interface that combines:
  - Native HTML element attributes
  - Variant props from tailwind-variants
- Always type the ref with the appropriate HTML element type

#### Styling Approach

- Do NOT use `tailwind-merge` to combine classes
- Pass `className` directly to the `tv()` function using the `class` parameter
- Let tailwind-variants handle class merging and conflict resolution

#### Export Pattern

- Use **named exports only** (no default exports)
- Export:
  - `Component` - the component itself
  - `componentVariants` - the variant configuration (useful for extending)
  - `type ComponentProps` - the TypeScript interface

### 4. Example: Button Component

Location: `src/components/ui/Button.tsx`

```typescript
'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const buttonVariants = tv({
  base: 'inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  variants: {
    variant: {
      primary: 'bg-emerald-500 text-black hover:bg-emerald-600 focus-visible:ring-emerald-500',
      secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus-visible:ring-gray-600',
      link: 'bg-transparent text-gray-600 hover:text-gray-900 focus-visible:ring-gray-600',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
      ghost: 'text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-600',
    },
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-2.5 text-sm',
      lg: 'px-6 py-3 text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, class: className })}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants, type ButtonProps }
```

### 5. Usage

#### In Components

```tsx
import { Button } from '@/components'

export function MyComponent() {
  return (
    <>
      <Button variant="primary" size="md">
        Primary Button
      </Button>
      
      <Button variant="secondary" size="sm">
        Secondary Button
      </Button>
      
      <Button variant="danger" disabled>
        Disabled Danger Button
      </Button>
    </>
  )
}
```

#### With Custom Classes

Pass custom classes using the `className` prop:

```tsx
<Button 
  variant="primary" 
  size="md"
  className="w-full"
>
  Full Width Button
</Button>
```

### 6. Export Structure

#### Component Index (`src/components/ui/index.ts`)

```typescript
export { Button, buttonVariants, type ButtonProps } from './Button'
export { Card, cardVariants, type CardProps } from './Card'
// ... other components
```

#### Main Components Index (`src/components/index.ts`)

```typescript
export * from './ui'
```

## Design System Integration

When creating components from Pencil designs:

1. **Extract Design Specifications**:
   - Get the screenshot of the component from Pencil
   - Read the detailed structure using `pencil_batch_get`
   - Note colors, fonts, spacing, borders, shadows

2. **Map to Tailwind Classes**:
   - Convert color values to Tailwind color scales
   - Use the extracted font families and sizes
   - Apply spacing using Tailwind padding and margin utilities

3. **Create Variants**:
   - Identify different visual states from the design
   - Create variant groups (primary, secondary, etc.)
   - Define size variations if applicable

4. **Test in Examples**:
   - Create example pages under `src/app/examples/[component]/page.tsx`
   - Showcase all variants and states
   - Validate against Pencil design

## Best Practices

- ✓ Keep components small and focused on one responsibility
- ✓ Always use TypeScript for type safety
- ✓ Extend native HTML element interfaces
- ✓ Use named exports exclusively
- ✓ Include proper accessibility attributes (aria-*, disabled states, etc.)
- ✓ Support ref forwarding for complex interactions
- ✓ Document variant options in comments when necessary
- ✓ Use `tailwind-variants` for all style variations
- ✗ Do NOT use `tailwind-merge` for combining classes
- ✗ Do NOT use default exports
- ✗ Do NOT create component-specific CSS files
