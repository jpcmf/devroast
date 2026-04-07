# DevRoast Database Setup Guide

## Overview

This guide covers the database setup, configuration, and usage for the DevRoast project using Drizzle ORM and PostgreSQL.

## Quick Start

### 1. Start the Development Server

The easiest way to start developing locally is to use the included `docker-compose.yml`:

```bash
# Ensure Docker is running, then start the containers
docker-compose up -d

# View logs to verify everything started correctly
docker-compose logs postgres
```

This will:
- Start a PostgreSQL 16 database container
- Create a persistent volume for data
- Expose the database on port 5432

**Connection Details**:
- Host: `localhost`
- Port: `5432`
- Username: `devroast`
- Password: `devroast_dev_password`
- Database: `devroast_db`

### 2. Run Database Migrations

```bash
# Run pending migrations against your database
pnpm db:migrate
```

### 3. Access the Database

**Using psql CLI**:
```bash
psql postgresql://devroast:devroast_dev_password@localhost:5432/devroast_db
```

**Using Drizzle Studio (GUI)**:
```bash
pnpm db:studio
```

**Using Docker logs**:
```bash
docker-compose logs -f postgres
```

## Project Structure

```
src/
├── db/
│   ├── schema/
│   │   ├── index.ts              # Re-exports all schema definitions
│   │   ├── submissions.ts        # Submissions table & enums
│   │   ├── feedback.ts           # Feedback table
│   │   └── roasts.ts             # Roasts/leaderboard table
│   ├── client.ts                 # Database connection client
│   └── queries/
│       ├── index.ts              # Re-exports all queries
│       ├── submissions.ts        # Submission queries
│       ├── feedback.ts           # Feedback queries
│       └── roasts.ts             # Roast/leaderboard queries
├── app/                          # Next.js application
├── components/                   # React components
└── types/                        # TypeScript types

drizzle/
└── migrations/                   # SQL migration files (auto-generated)

docker-compose.yml               # Docker Compose configuration
drizzle.config.ts               # Drizzle Kit configuration
.env.local                       # Local environment variables
.env.production                  # Production environment variables
scripts/
└── init.sql                     # Database initialization script
```

## Database Schema

### Tables

#### `submissions`
Stores all code submissions to the platform.

**Columns:**
- `id` (UUID) - Primary key
- `code` (TEXT) - The code snippet
- `language` (programming_language) - Programming language enum
- `title` (VARCHAR) - Optional title
- `description` (TEXT) - Optional description
- `roast_mode` (BOOLEAN) - Whether roast mode was enabled
- `severity_score` (INTEGER) - Calculated severity (0-100)
- `view_count` (INTEGER) - Number of views
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

#### `feedback`
Stores AI-generated feedback for submissions.

**Columns:**
- `id` (UUID) - Primary key
- `submission_id` (UUID) - Foreign key to submissions
- `feedback_type` (feedback_type) - Type of feedback (roast/standard/review)
- `content` (TEXT) - The feedback text
- `issues_found` (INTEGER) - Number of issues identified
- `recommendations_count` (INTEGER) - Number of recommendations
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

#### `roasts`
Manages leaderboard rankings and severity ratings.

**Columns:**
- `id` (UUID) - Primary key
- `submission_id` (UUID) - Foreign key to submissions (unique)
- `rank_position` (INTEGER) - Position on the leaderboard
- `severity_rating` (INTEGER) - Severity score (0-100)
- `critical_issues_count` (INTEGER) - Count of critical issues
- `badges` (TEXT[]) - Array of earned badges
- `last_ranked_at` (TIMESTAMP) - When ranking was last updated
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

## Using the Database

### In Next.js Server Components or API Routes

```typescript
import { createSubmission, getSubmissionById } from '@/db/queries'

// Create a new submission
const submission = await createSubmission({
  code: userCode,
  language: 'javascript',
  title: 'My Script',
  roastMode: true
})

// Fetch a submission
const result = await getSubmissionById(submission.id)
```

### Available Query Functions

#### Submissions
- `createSubmission(data)` - Create new submission
- `getSubmissionById(id)` - Get submission by ID
- `getAllSubmissions(limit, offset, sortBy)` - Get paginated submissions
- `getSubmissionsByLanguage(language, limit, offset)` - Filter by language
- `updateSubmissionSeverity(id, score)` - Update severity score
- `incrementViewCount(id)` - Increment view count
- `deleteSubmission(id)` - Delete submission

#### Feedback
- `createFeedback(data)` - Create feedback
- `getFeedbackById(id)` - Get feedback by ID
- `getFeedbackBySubmissionId(submissionId)` - Get all feedback for submission
- `getLatestFeedbackBySubmissionId(submissionId)` - Get most recent feedback
- `getFeedbackByType(type, limit, offset)` - Filter by feedback type
- `updateFeedback(id, data)` - Update feedback
- `deleteFeedback(id)` - Delete feedback
- `deleteFeedbackBySubmissionId(submissionId)` - Delete all feedback for submission

#### Roasts (Leaderboard)
- `createRoast(data)` - Create roast record
- `getRoastById(id)` - Get roast by ID
- `getRoastBySubmissionId(submissionId)` - Get roast for submission
- `getTopRoasts(limit, offset)` - Get leaderboard (top submissions)
- `updateRoast(id, data)` - Update roast
- `updateRoastRanking(id, position)` - Update ranking position
- `addBadgeToRoast(id, badge)` - Add badge
- `removeBadgeFromRoast(id, badge)` - Remove badge
- `deleteRoast(id)` - Delete roast
- `deleteRoastBySubmissionId(submissionId)` - Delete roast for submission
- `getAverageSeverityScore()` - Calculate average severity
- `getTotalRoastCount()` - Get total number of roasts

## Available NPM Scripts

```bash
# Development
pnpm dev                # Start Next.js dev server
pnpm lint              # Run Biome linter
pnpm format            # Format code with Biome
pnpm check             # Run all Biome checks

# Database
pnpm db:generate       # Generate migrations from schema
pnpm db:migrate        # Run pending migrations
pnpm db:studio         # Open Drizzle Studio GUI
pnpm db:push           # Push schema changes directly (unsafe)
pnpm seed              # Seed database with sample data
```

## Environment Configuration

### `.env.local` (Development)

```bash
DATABASE_URL=postgresql://devroast:devroast_dev_password@localhost:5432/devroast_db
NODE_ENV=development
```

### `.env.production` (Production)

Set via CI/CD secrets or environment variables:

```bash
DATABASE_URL=postgresql://[user]:[password]@[host]:5432/[database]
NODE_ENV=production
```

## Database Migrations

Migrations are automatically generated when you update the schema:

```bash
# Make changes to src/db/schema/*.ts
# Then generate the migration
pnpm db:generate

# Review the generated SQL in drizzle/migrations/
# When ready, run migrations
pnpm db:migrate
```

### How to Create a New Table

1. Create a new file in `src/db/schema/` (e.g., `my-table.ts`)
2. Define your table using Drizzle syntax
3. Export the table and types
4. Add re-export to `src/db/schema/index.ts`
5. Run `pnpm db:generate` to create migration
6. Run `pnpm db:migrate` to apply migration

### How to Modify an Existing Table

1. Update the table definition in `src/db/schema/`
2. Run `pnpm db:generate` to create a new migration
3. Review the generated SQL
4. Run `pnpm db:migrate` to apply

## Troubleshooting

### Docker container won't start
```bash
# Check logs
pnpm docker:logs

# Reset everything (WARNING: deletes data)
pnpm docker:reset
```

### Cannot connect to database
```bash
# Verify containers are running
docker ps

# Check DATABASE_URL in .env.local
cat .env.local

# Test connection
psql postgresql://devroast:devroast_dev_password@localhost:5432/devroast_db
```

### Migration failed
```bash
# Check which migrations have been applied
# You may need to manually roll back and retry

# View all migrations
ls -la drizzle/migrations/

# Get database URL from environment
echo $DATABASE_URL
```

### PgAdmin not accessible
- Ensure port 5050 is not in use: `lsof -i :5050`
- Check Docker container is running: `docker ps | grep pgadmin`
- Clear browser cache and try again

## Performance Considerations

### Indexes
Currently, the schema includes basic indexes. Consider adding more for large datasets:

```sql
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX idx_submissions_severity ON submissions(severity_score DESC);
CREATE INDEX idx_roasts_severity ON roasts(severity_rating DESC);
```

### Connection Pooling
The database client uses a connection pool with max 20 connections. Adjust in `src/db/client.ts` if needed.

### Query Optimization
For large datasets, use pagination with `limit` and `offset` parameters on list queries.

## Security Notes

- ✅ Never commit `.env.local` (it's in `.gitignore`)
- ✅ Use `prepared statements` (Drizzle handles this automatically)
- ✅ Validate user input before database queries
- ✅ Use parameterized queries (never concatenate SQL strings)
- ❌ Don't expose database credentials in client code
- ❌ Don't log sensitive data

## Next Steps

The database foundation is complete with full schema, migrations, and query functions. Future enhancements:

1. **Performance optimization** - Add indexes on frequently queried columns
2. **Connection pooling** - Fine-tune pool settings for production
3. **Automated backups** - Configure daily backups for production
4. **Read replicas** - For high-traffic scenarios
5. **Data archival** - Move old submissions to cold storage

## Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [DevRoast Specification](../specs/DRIZZLE_IMPLEMENTATION.md)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Drizzle ORM documentation
3. Check PostgreSQL error logs: `pnpm docker:logs`
4. Open an issue in the repository
