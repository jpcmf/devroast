# DevRoast

**The internet's most brutal code review platform.**

DevRoast is a web application where developers submit code snippets and receive honest, sometimes hilarious feedback from the community. Think of it as code review meets comedy — where bad code gets the roasting it deserves.

> Every great developer has written bad code. DevRoast is here to celebrate that journey. 🔥

---

## Table of Contents

- [What is DevRoast?](#what-is-devroast)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [API & Features](#api--features)
- [Database](#database)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

---

## What is DevRoast?

Tired of polite code reviews? DevRoast changes the game by offering a judgment-free zone where code gets roasted with style. Whether you're writing the worst code imaginable or just curious about how others will critique it, DevRoast has you covered.

### Key Features

- **Code Submission** - Submit any code snippet in your favorite language
- **AI-Powered Feedback** - Get instant feedback using Google Gemini API
- **Roast Mode** - Toggle between standard feedback and full roast mode for maximum entertainment
- **Real-time Updates** - Get feedback as soon as it's generated (no page refresh needed)
- **Shame Leaderboard** - See which code made it to the internet's hall of shame with pagination
- **Syntax Highlighting** - Code is displayed with beautiful syntax highlighting via Shiki
- **Dark Terminal Aesthetic** - A sleek, terminal-inspired design inspired by developer culture
- **Rate Limiting** - Spam protection with per-IP and global cooldown limits
- **Paginated Leaderboard** - Browse submissions with 10 items per page and smart navigation controls

## How It Works

1. **Paste Your Code** - Copy and paste any code snippet (1-50,000 characters) into the submission form
2. **Choose Mode** - Select between standard feedback (professional) or roast mode (sarcastic)
3. **Get Feedback** - Submit and receive AI-generated feedback in real-time
4. **View Results** - See your shame score, issue breakdown, and detailed feedback
5. **Check the Leaderboard** - See how your code ranks among the "worst" on the internet

## Getting Started

### For Users

1. Visit the DevRoast website
2. Paste your code in the submission form
3. Choose your preferred feedback mode (standard or roast)
4. Click "Start the Roast" and wait for your verdict
5. Share your results or learn from the shame leaderboard

### For Developers

See the [Development Setup](#development-setup) section below.

---

## Development Setup

### Prerequisites

- **Node.js** 18+ with pnpm
- **PostgreSQL** 16+ (Docker Compose included)
- **Google Gemini API Key** (free tier available at https://ai.google.dev)
- **Docker & Docker Compose** (for local database)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd devroast
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file with required variables
   echo "DATABASE_URL=postgresql://devroast:devroast_dev_password@localhost:5432/devroast_db" > .env.local
   echo "GEMINI_API_KEY=your-gemini-api-key" >> .env.local
   ```

4. **Start the database**
   ```bash
   # Start PostgreSQL with Docker Compose
   docker-compose up -d
   
   # Run migrations
   pnpm db:migrate
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

### Environment Variables

#### Development (`.env.local`)

```bash
# Database
DATABASE_URL=postgresql://devroast:devroast_dev_password@localhost:5432/devroast_db

# AI/Gemini
GEMINI_API_KEY=your-gemini-api-key

# Node Environment
NODE_ENV=development
```

#### Production (`.env.production`)

Set via CI/CD secrets or environment management:

```bash
DATABASE_URL=postgresql://[user]:[password]@[host]:5432/[database]
GEMINI_API_KEY=[your-gemini-key]
NODE_ENV=production
```

---

## Project Structure

```
devroast/
├── src/
│   ├── app/                          # Next.js app directory
│   │   ├── api/                      # API routes
│   │   │   ├── feedback/[id]/        # Feedback polling endpoint
│   │   │   ├── trpc/[trpc]/          # tRPC API handler
│   │   │   └── health/               # Health check endpoint
│   │   ├── leaderboard/              # Leaderboard pages
│   │   ├── results/[id]/             # Submission results page
│   │   ├── examples/                 # Example components page
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   └── globals.css               # Global styles
│   │
│   ├── components/                   # React components
│   │   ├── ui/                       # Core UI components
│   │   │   ├── Button.tsx            # Button component
│   │   │   ├── Card.tsx              # Card component
│   │   │   ├── Toggle.tsx            # Toggle component
│   │   │   ├── BadgeStatus.tsx       # Status badge component
│   │   │   ├── CodeBlock.tsx         # Code display component
│   │   │   └── index.ts              # Barrel export
│   │   ├── ScoreCardSkeleton.tsx     # Skeleton loader for score card
│   │   ├── LeaderboardContent.tsx    # Paginated leaderboard client component
│   │   ├── LeaderboardTable.tsx      # Leaderboard table display
│   │   ├── LeaderboardSkeleton.tsx   # Skeleton loader for leaderboard
│   │   ├── SubmissionForm.tsx        # Code submission form
│   │   ├── NavBar.tsx                # Navigation bar
│   │   └── index.ts                  # Main component export
│   │
│   ├── db/                           # Database layer
│   │   ├── schema/                   # Drizzle ORM schema definitions
│   │   │   ├── submissions.ts        # Submissions table
│   │   │   ├── feedback.ts           # Feedback table
│   │   │   ├── roasts.ts             # Roasts/leaderboard table
│   │   │   └── index.ts              # Re-exports
│   │   ├── queries/                  # Drizzle ORM queries
│   │   │   ├── submissions.ts        # Submission queries
│   │   │   ├── feedback.ts           # Feedback queries
│   │   │   ├── roasts.ts             # Roast queries
│   │   │   └── index.ts              # Re-exports
│   │   └── client.ts                 # Database connection
│   │
│   ├── server/                       # Server-side logic
│   │   ├── trpc/                     # tRPC setup
│   │   │   ├── router.ts             # Main router
│   │   │   ├── context.ts            # Request context
│   │   │   ├── server.tsx            # Server-side TRPC caller
│   │   │   └── routes/               # Route handlers
│   │   │       └── submissions.ts    # Submission procedures
│   │   ├── lib/                      # Server utilities
│   │   │   ├── submissions.ts        # Submission processing
│   │   │   ├── gemini.ts             # Gemini API integration
│   │   │   ├── rate-limiter.ts       # Rate limiting
│   │   │   └── logging.ts            # Logging utilities
│   │   └── env.ts                    # Environment validation
│   │
│   ├── lib/                          # Client/shared utilities
│   │   ├── severity.ts               # Severity calculation
│   │   └── trpc.ts                   # tRPC client setup
│   │
│   └── types/                        # TypeScript types
│       └── index.ts                  # Shared types
│
├── drizzle/                          # Database migrations
│   └── migrations/                   # Auto-generated migration files
│
├── scripts/                          # Utility scripts
│   ├── seed.ts                       # Database seeding
│   └── init.sql                      # SQL initialization
│
├── specs/                            # Project specifications
│   └── CODE_SUBMISSION_IMPLEMENTATION.md
│
├── docker-compose.yml                # Docker compose for local dev
├── drizzle.config.ts                 # Drizzle ORM config
├── next.config.ts                    # Next.js config
├── tailwind.config.js                # Tailwind CSS config
├── biome.json                        # Code linting/formatting
├── tsconfig.json                     # TypeScript config
├── package.json                      # Dependencies
└── README.md                         # This file
```

---

## Tech Stack

### Core Framework

- **Next.js 16** - React 19 framework with SSR/SSG
- **React 19** - Modern React with hooks and server components
- **TypeScript 5** - Type-safe JavaScript development

### Styling & UI

- **Tailwind CSS v4** - Utility-first CSS framework
- **tailwind-variants** - Type-safe variant composition
- **JetBrains Mono** - Monospace font for code and terminal aesthetic

### Database & ORM

- **PostgreSQL 16** - Production database
- **Drizzle ORM** - TypeScript-first ORM
- **Drizzle Kit** - Schema management and migrations

### AI & Code Analysis

- **Google Gemini API** - AI-powered code feedback generation
- **Shiki** - Server-side syntax highlighting

### Development Tools

- **Biome** - Code formatting and linting
- **pnpm** - Fast, space-efficient package manager
- **tRPC** - Type-safe API layer with end-to-end type safety
- **Zod** - Runtime schema validation
- **Docker & Docker Compose** - Local development environment

---

## API & Features

### Code Submission

**Endpoint:** `POST /api/trpc/submissions.create`

Submit code for analysis and feedback.

**Request:**
```typescript
{
  code: string              // 1-50,000 characters
  language: string          // See supported languages below
  roastMode: boolean        // true for sarcastic, false for professional
}
```

**Response:**
```typescript
{
  id: string               // UUID of submission
  code: string
  language: string
  roastMode: boolean
  createdAt: Date
}
```

**Supported Languages:**
- JavaScript/TypeScript
- Python
- Java
- C/C++
- Go
- Rust
- HTML/CSS
- JSON
- And more...

### Get Feedback

**Endpoint:** `GET /api/feedback/[submissionId]`

Poll for AI-generated feedback.

**Response:**
```typescript
{
  id: string
  content: string          // Feedback text
  issuesFound: number
  recommendationsCount: number
  severityScore: number    // 0-100 scale
}
// Returns null if feedback not yet generated
```

### Leaderboard

**Endpoint:** `GET /api/trpc/metrics.getLeaderboard`

Get paginated leaderboard submissions with filtering and sorting support.

**Request:**
```typescript
{
  page: number          // Page number (1-indexed, default: 1)
  pageSize: number      // Items per page (1-100, default: 10)
}
```

**Response:**
```typescript
{
  items: [
    {
      id: string
      rank: number
      score: string
      code: string
      language: string
      createdAt: Date
    },
    ...
  ],
  pagination: {
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
}
```

**Legacy Endpoint:** `GET /api/trpc/roasts.getTopRoasts`

Get the top "worst" code submissions (non-paginated, for home preview).

**Response:**
```typescript
[
  {
    id: string
    code: string
    language: string
    severityScore: number
    viewCount: number
    createdAt: Date
    feedback: {
      content: string
      severityScore: number
    }
  },
  ...
]
```

---

## Database

### Tables

#### `submissions`

Stores all code submissions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `code` | TEXT | Code snippet |
| `language` | ENUM | Programming language |
| `roast_mode` | BOOLEAN | Roast mode enabled |
| `severity_score` | INTEGER | 0-100 severity rating |
| `view_count` | INTEGER | Number of views |
| `created_at` | TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | Last update time |

#### `feedback`

Stores AI-generated feedback.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `submission_id` | UUID | Foreign key to submissions |
| `feedback_type` | ENUM | 'standard' or 'roast' |
| `content` | TEXT | Feedback text |
| `issues_found` | INTEGER | Number of issues |
| `recommendations_count` | INTEGER | Number of recommendations |
| `created_at` | TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | Last update time |

#### `roasts`

Leaderboard and ranking data.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `submission_id` | UUID | Foreign key to submissions |
| `rank_position` | INTEGER | Leaderboard position |
| `severity_rating` | INTEGER | 0-100 severity score |
| `critical_issues_count` | INTEGER | Critical issues |
| `badges` | TEXT[] | Earned badges |
| `last_ranked_at` | TIMESTAMP | Last ranking update |
| `created_at` | TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | Last update time |

### Database Commands

```bash
# Start PostgreSQL with Docker Compose
docker-compose up -d

# Stop Docker containers
docker-compose down

# View Docker logs
docker-compose logs -f postgres

# Run pending migrations
pnpm db:migrate

# Generate new migrations
pnpm db:generate

# Open Drizzle Studio (GUI)
pnpm db:studio

# Seed database with sample data
pnpm seed

# Reset everything (WARNING: deletes data)
docker-compose down -v && docker-compose up -d
```

### Database Access

**PostgreSQL Direct Connection:**
- Host: `localhost`
- Port: `5432`
- Username: `devroast`
- Password: `devroast_dev_password`
- Database: `devroast_db`

**PgAdmin (Web UI):**
- URL: http://localhost:5050
- Email: `admin@devroast.local`
- Password: `admin_password`

---

## Component Architecture

### Core Components

All components follow consistent patterns and use `tailwind-variants` for styling:

#### Button
```typescript
<Button variant="primary" size="md">Click me</Button>
```
**Variants:** primary, secondary, link, danger, ghost
**Sizes:** sm, md, lg

#### Card (Composable)
```typescript
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Badge>New</Card.Badge>
  </Card.Header>
  <Card.Description>Description text</Card.Description>
</Card>
```

#### Toggle
```typescript
<Toggle defaultChecked variant="primary">
  Toggle label
</Toggle>
```

#### BadgeStatus
```typescript
<BadgeStatus variant="critical">Critical Issue</BadgeStatus>
```
**Variants:** critical, warning, good, needs_serious_help

#### CodeBlock (Server Component)
```typescript
<CodeBlock code={code} language="javascript" />
```

#### ScoreCardSkeleton
```typescript
<ScoreCardSkeleton />
```
Shows animated placeholder while AI feedback is generating.

### Component Patterns

- ✅ Use `tailwind-variants` for all styling
- ✅ Use `forwardRef` for native element refs
- ✅ Use `HTMLAttributes` to extend native elements
- ✅ Named exports only (no default exports)
- ✅ Use `useId()` for dynamic IDs (SSR-safe)
- ✅ Pass className via `class:` parameter to `tv()`
- ✅ Async server components for data fetching
- ❌ Never use `tailwind-merge`
- ❌ Never use hex colors (Tailwind classes only)
- ❌ Never use default exports

---

## Scripts

### Development

```bash
pnpm dev              # Start Next.js dev server
pnpm build            # Build for production
pnpm start            # Start production server
```

### Code Quality

```bash
pnpm lint             # Run Biome linter
pnpm format           # Format code with Biome
pnpm check            # Run all Biome checks
```

### Database

```bash
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema (unsafe)
pnpm db:studio        # Open Drizzle Studio
pnpm seed             # Seed database
```

### Docker

```bash
docker-compose up -d              # Start containers
docker-compose down               # Stop containers
docker-compose logs -f postgres   # View logs
docker-compose down -v            # Remove volumes (reset data)
```

---

## Design Philosophy

DevRoast embraces a dark, terminal-inspired aesthetic that appeals to developers:

- **JetBrains Mono** - Monospace font that feels native to code editors
- **Dark Theme** - Reduced eye strain with `bg-gray-950` as primary background
- **Minimal Design** - Clean, focused layout with no distractions
- **Color-Coded Feedback**:
  - 🔴 Red for critical issues
  - 🟡 Amber for warnings
  - 🟢 Green for good code
  - 🔵 Blue for informational

### Color Palette

- **Background**: `bg-gray-950` (primary), `bg-gray-900` (containers)
- **Text**: `text-gray-100` (headings), `text-gray-300` (body), `text-gray-400` (labels)
- **Borders**: `border-gray-700`
- **Accent**: `emerald-500` (primary action/highlight)
- **Status**: Various Tailwind status colors

---

## Contributing

### Getting Started

1. Create a feature branch: `git checkout -b feat/your-feature-name`
2. Make your changes following the component patterns above
3. Run linting and formatting: `pnpm check && pnpm format`
4. Build to verify: `pnpm build`
5. Commit with clear messages (no automatic commits - ask first!)
6. Push and create a pull request

### Code Standards

- **Formatting**: Use Biome (`pnpm format`)
- **Linting**: Pass all Biome checks (`pnpm check`)
- **TypeScript**: No `any` types, strict mode enabled
- **Components**: Follow the component pattern documented in `AGENTS.md`
- **Naming**: Use clear, descriptive names for variables and functions
- **Documentation**: Add comments for complex logic

### Git Workflow

- Always ask for confirmation before creating commits
- Use descriptive commit messages
- Do not force push to main without explicit permission
- Keep feature branches small and focused

### Development Guides

- **Component Creation**: See `AGENTS.md` for detailed patterns
- **Database Queries**: See `DATABASE.md` for schema and query examples
- **Code Submission System**: See `specs/CODE_SUBMISSION_IMPLEMENTATION.md`

---

## Troubleshooting

### Development Server

**Port already in use:**
```bash
# Kill the process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use a different port
pnpm dev -- -p 3001
```

**Build errors:**
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
pnpm build
```

### Database Issues

**Docker container won't start:**
```bash
# Check logs
docker-compose logs -f postgres

# Reset (WARNING: deletes data)
docker-compose down -v && docker-compose up -d
```

**Cannot connect to database:**
```bash
# Verify containers are running
docker ps

# Check DATABASE_URL
cat .env.local

# Test connection
psql postgresql://devroast:devroast_dev_password@localhost:5432/devroast_db
```

**Migration failed:**
```bash
# Check applied migrations
psql -c "SELECT * FROM \"_drizzle_migrations\";" $DATABASE_URL

# Rollback manually if needed (see Drizzle docs)
```

### Gemini API

**API key not working:**
1. Verify key is in `.env.local`
2. Check key is valid at https://ai.google.dev
3. Ensure you have API credits (free tier available)
4. Check server logs for detailed error messages

**Feedback not generating:**
1. Check `[Gemini]` and `[Submissions]` logs in server output
2. Verify API response with: `curl -H "Authorization: Bearer YOUR_KEY" https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`
3. Check database that feedback row exists: `SELECT * FROM feedback WHERE submission_id = 'id';`

### Polling Issues

**Score card not updating:**
1. Open browser DevTools console
2. Check for `[ResultsContent]` logs
3. Verify `/api/feedback/[id]` returns null initially, then feedback object
4. Check that feedback row is being created (may take 5-30 seconds)

---

## Performance Optimization

### Database

Current indexes cover common queries. Consider adding for large datasets:

```sql
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX idx_submissions_severity ON submissions(severity_score DESC);
CREATE INDEX idx_roasts_severity ON roasts(severity_rating DESC);
```

### Rate Limiting

Rate limits prevent abuse:
- **Per-IP**: 10 submissions per hour (configurable)
- **Global**: 30-second cooldown between all submissions

Adjust in `src/server/lib/rate-limiter.ts` as needed.

### Caching

Consider adding Redis for:
- Leaderboard caching
- Feedback polling results
- User submission history

---

## Security

- ✅ Never commit `.env.local` (in `.gitignore`)
- ✅ Use prepared statements (Drizzle handles automatically)
- ✅ Validate user input (Zod schemas)
- ✅ Sanitize code submissions (blocked: `<script>`, `<style>`, etc.)
- ✅ Rate limiting to prevent spam
- ❌ Don't expose database credentials in client code
- ❌ Don't log sensitive data
- ❌ Don't commit `.env` files

---

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Drizzle ORM](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [Shiki Code Highlighter](https://shiki.matsu.io)
- [Google Gemini API](https://ai.google.dev)

### Project Documentation
- `AGENTS.md` - Development guide for agents and developers
- `DATABASE.md` - Database setup and configuration
- `specs/CODE_SUBMISSION_IMPLEMENTATION.md` - Implementation specifications
- `TESTING.md` - Testing guide and examples

### Related Files
- `.env.local.example` - Environment template
- `docker-compose.yml` - Docker configuration
- `tailwind.config.js` - Tailwind configuration
- `tsconfig.json` - TypeScript configuration

---

## Support & Feedback

### Getting Help

1. Check the [Troubleshooting](#troubleshooting) section
2. Review relevant documentation (AGENTS.md, DATABASE.md)
3. Check existing GitHub issues
4. Open a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment info (Node version, OS, etc.)

### Reporting Bugs

Report issues at: https://github.com/anomalyco/opencode

Include:
- Error messages and stack traces
- Environment variables (sanitized)
- Database logs if applicable
- Browser console errors if frontend issue

---

## License

See LICENSE file for details.

---

**Last Updated:** April 7, 2026

Made with ❤️ for developers who appreciate honest feedback.
