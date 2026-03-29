# DevRoast - Drizzle ORM Implementation Specification

**Document Version**: 1.0.0  
**Last Updated**: March 28, 2026  
**Status**: Ready for Implementation

---

## 1. Overview

This specification outlines the implementation of Drizzle ORM as the database layer for DevRoast. The project will use PostgreSQL as the primary database, managed via Docker Compose for local development and containerized deployment.

### Key Objectives

- Establish a robust database schema for code submissions, feedback, and leaderboard metrics
- Provide type-safe database access through Drizzle ORM
- Support AI-generated feedback storage and retrieval
- Enable efficient leaderboard queries and ranking calculations
- Maintain data integrity and query performance

---

## 2. Tech Stack

### Database & ORM

- **Database**: PostgreSQL 16+ (via Docker Compose)
- **ORM**: Drizzle ORM (latest version)
- **Migration Tool**: Drizzle Kit CLI
- **Connection Pool**: pg (native PostgreSQL driver)

### Environment

- **Development**: Docker Compose with PostgreSQL container
- **Local Development**: Can run with local PostgreSQL or Docker
- **Production**: PostgreSQL instance (to be configured per deployment strategy)

---

## 3. Database Schema

### 3.1 Core Tables

#### Table: `submissions`

Stores all code submissions to the platform.

```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  language VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  description TEXT,
  roast_mode BOOLEAN DEFAULT false,
  severity_score INTEGER DEFAULT 0 (0-100),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Unique identifier for the submission |
| `code` | TEXT | Yes | The actual code snippet submitted |
| `language` | VARCHAR(50) | Yes | Programming language (e.g., "javascript", "python", "rust") |
| `title` | VARCHAR(255) | No | Optional title/name for the submission |
| `description` | TEXT | No | Optional context/description from the user |
| `roast_mode` | BOOLEAN | No | Whether roast mode was enabled during submission |
| `severity_score` | INTEGER | No | Calculated severity of issues found (0-100) |
| `view_count` | INTEGER | No | Number of times viewed (for leaderboard ranking) |
| `created_at` | TIMESTAMP | Yes | When the submission was created |
| `updated_at` | TIMESTAMP | Yes | When the submission was last updated |

**Indexes**:

- PRIMARY: `id`
- INDEX: `created_at` (for sorting recent submissions)
- INDEX: `severity_score DESC` (for leaderboard ranking)
- INDEX: `language` (for filtering by language)

---

#### Table: `feedback`

Stores AI-generated feedback for each submission.

```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  feedback_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  issues_found INTEGER DEFAULT 0,
  recommendations_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Unique identifier for the feedback |
| `submission_id` | UUID | Yes | Foreign key reference to submissions |
| `feedback_type` | VARCHAR(50) | Yes | Type of feedback ("roast", "standard", "review") |
| `content` | TEXT | Yes | The actual feedback/review text |
| `issues_found` | INTEGER | No | Count of issues identified in the code |
| `recommendations_count` | INTEGER | No | Number of recommendations provided |
| `created_at` | TIMESTAMP | Yes | When feedback was generated |
| `updated_at` | TIMESTAMP | Yes | When feedback was last updated |

**Indexes**:

- PRIMARY: `id`
- FOREIGN KEY: `submission_id`
- INDEX: `submission_id` (for querying feedback by submission)

---

#### Table: `roasts`

Stores ranking/leaderboard data for shame leaderboard.

```sql
CREATE TABLE roasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL UNIQUE REFERENCES submissions(id) ON DELETE CASCADE,
  rank_position INTEGER,
  severity_rating INTEGER NOT NULL (0-100),
  critical_issues_count INTEGER DEFAULT 0,
  badges TEXT[] DEFAULT '{}',
  last_ranked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Unique identifier for the roast record |
| `submission_id` | UUID | Yes | Foreign key reference to submissions |
| `rank_position` | INTEGER | No | Current position on shame leaderboard |
| `severity_rating` | INTEGER | Yes | Severity score (0-100, determines ranking) |
| `critical_issues_count` | INTEGER | No | Number of critical issues found |
| `badges` | TEXT[] | No | Array of earned badges (e.g., ["worst_naming", "missing_error_handling"]) |
| `last_ranked_at` | TIMESTAMP | No | When rank was last calculated |
| `created_at` | TIMESTAMP | Yes | When the roast record was created |
| `updated_at` | TIMESTAMP | Yes | When the roast record was last updated |

**Indexes**:

- PRIMARY: `id`
- FOREIGN KEY: `submission_id` (UNIQUE)
- INDEX: `severity_rating DESC` (for leaderboard queries)
- INDEX: `rank_position ASC` (for leaderboard display)

---

### 3.2 Supporting Tables (Future)

#### Table: `audit_logs` (Future)

For tracking submission activity and changes (to be implemented in Phase 2).

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 4. Enums

### 4.1 Programming Languages

```typescript
enum ProgrammingLanguage {
  JAVASCRIPT = "javascript",
  TYPESCRIPT = "typescript",
  PYTHON = "python",
  RUST = "rust",
  GOLANG = "golang",
  JAVA = "java",
  CSHARP = "csharp",
  PHP = "php",
  RUBY = "ruby",
  KOTLIN = "kotlin",
  SQL = "sql",
  HTML = "html",
  CSS = "css",
  JSON = "json",
  YAML = "yaml",
  BASH = "bash",
  OTHER = "other"
}
```

### 4.2 Feedback Types

```typescript
enum FeedbackType {
  ROAST = "roast",           // Full brutal roast mode
  STANDARD = "standard",     // Regular constructive feedback
  REVIEW = "review"          // Detailed code review
}
```

### 4.3 Severity Levels

```typescript
enum SeverityLevel {
  CRITICAL = "critical",     // Score 80-100
  HIGH = "high",             // Score 60-79
  MEDIUM = "medium",         // Score 40-59
  LOW = "low",               // Score 20-39
  MINIMAL = "minimal"        // Score 0-19
}
```

### 4.4 Issue Categories

```typescript
enum IssueCategory {
  NAMING = "naming",                          // Poor variable/function naming
  PERFORMANCE = "performance",                // Performance issues
  SECURITY = "security",                      // Security vulnerabilities
  ERROR_HANDLING = "error_handling",          // Missing error handling
  CODE_STYLE = "code_style",                  // Code style violations
  LOGIC = "logic",                            // Logic errors
  COMPLEXITY = "complexity",                  // Overly complex code
  BEST_PRACTICES = "best_practices",          // Violation of best practices
  DOCUMENTATION = "documentation",            // Missing/poor documentation
  DEPENDENCY_MANAGEMENT = "dependency_management"  // Dependency issues
}
```

### 4.5 Badges (Achievements)

```typescript
enum Badge {
  WORST_NAMING = "worst_naming",
  MISSING_ERROR_HANDLING = "missing_error_handling",
  SECURITY_NIGHTMARE = "security_nightmare",
  SPAGHETTI_CODE = "spaghetti_code",
  NO_DOCUMENTATION = "no_documentation",
  PERFORMANCE_DISASTER = "performance_disaster",
  ABANDONED_VARIABLES = "abandoned_variables",
  MAGIC_NUMBERS = "magic_numbers",
  CYCLOMATIC_CHAOS = "cyclomatic_chaos",
  REGEX_NIGHTMARE = "regex_nightmare"
}
```

---

## 5. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)

- [ ] Set up Docker Compose with PostgreSQL
- [ ] Install Drizzle ORM and related packages
- [ ] Create Drizzle schema definitions (TypeScript)
- [ ] Configure Drizzle Kit migrations
- [ ] Create initial migration files
- [ ] Set up database connection pooling
- [ ] Create environment configuration (.env files)
- [ ] Write database initialization scripts

### Phase 2: Core Features (Weeks 3-4)

- [ ] Implement submission creation endpoint
- [ ] Implement AI feedback integration (placeholder/stub for now)
- [ ] Implement feedback storage
- [ ] Create queries for submissions retrieval
- [ ] Create leaderboard ranking queries
- [ ] Implement view count tracking
- [ ] Add proper error handling and logging

### Phase 3: Optimization & Testing (Weeks 5-6)

- [ ] Optimize database queries
- [ ] Add query caching layer (optional)
- [ ] Write integration tests
- [ ] Load testing on leaderboard queries
- [ ] Implement database migration rollback strategy
- [ ] Set up automated backups (production planning)

### Phase 4: Production Readiness (Week 7+)

- [ ] Database connection pooling optimization
- [ ] Production migration scripts
- [ ] Monitoring and alerting setup
- [ ] Performance monitoring
- [ ] Documentation completion
- [ ] Audit logging implementation

---

## 6. Docker Compose Setup

### 6.1 Docker Compose Configuration

**File**: `docker-compose.yml`

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: devroast-db
    environment:
      POSTGRES_USER: ${DB_USER:-devroast}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-devroast}
      POSTGRES_DB: ${DB_NAME:-devroast_db}
    ports:
      - "${DB_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-devroast}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - devroast-network

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: devroast-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@devroast.local
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD:-admin}
    ports:
      - "5050:80"
    depends_on:
      - postgres
    networks:
      - devroast-network

volumes:
  postgres_data:
    driver: local

networks:
  devroast-network:
    driver: bridge
```

### 6.2 Environment Variables

**File**: `.env.local` (for local development)

```bash
# Database Configuration
DB_USER=devroast
DB_PASSWORD=devroast_dev_password
DB_NAME=devroast_db
DB_HOST=localhost
DB_PORT=5432

# Database URL (for Drizzle)
DATABASE_URL=postgresql://devroast:devroast_dev_password@localhost:5432/devroast_db

# PgAdmin
PGADMIN_PASSWORD=admin_password

# Application
NODE_ENV=development
```

**File**: `.env.production` (for production)

```bash
# Database Configuration (to be set via CI/CD or secrets)
DB_USER=${SECRET_DB_USER}
DB_PASSWORD=${SECRET_DB_PASSWORD}
DB_NAME=devroast_db_prod
DB_HOST=${SECRET_DB_HOST}
DB_PORT=5432

# Database URL
DATABASE_URL=postgresql://${SECRET_DB_USER}:${SECRET_DB_PASSWORD}@${SECRET_DB_HOST}:5432/devroast_db_prod

# Application
NODE_ENV=production
```

---

## 7. Drizzle Configuration

### 7.1 Drizzle Kit Config

**File**: `drizzle.config.ts`

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema',
  out: './drizzle/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://devroast:devroast@localhost:5432/devroast_db'
  },
  migrations: {
    migrationsFolder: './drizzle/migrations'
  }
})
```

### 7.2 Database Schema File Structure

```
src/
├── db/
│   ├── schema/
│   │   ├── index.ts                    # Main schema export
│   │   ├── submissions.ts              # Submissions table
│   │   ├── feedback.ts                 # Feedback table
│   │   ├── roasts.ts                   # Roasts/leaderboard table
│   │   └── enums.ts                    # Enum definitions
│   ├── client.ts                       # Database connection
│   └── queries/
│       ├── submissions.ts              # Submission queries
│       ├── feedback.ts                 # Feedback queries
│       └── roasts.ts                   # Roast/leaderboard queries
```

---

## 8. Package Dependencies

Add to `package.json`:

```json
{
  "dependencies": {
    "drizzle-orm": "^0.30.0",
    "drizzle-kit": "^0.20.0",
    "pg": "^8.11.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/pg": "^8.11.0"
  },
  "scripts": {
    "db:generate": "drizzle-kit generate:pg",
    "db:migrate": "drizzle-kit migrate:pg",
    "db:studio": "drizzle-kit studio",
    "db:push": "drizzle-kit push:pg",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f postgres",
    "docker:reset": "docker-compose down -v && docker-compose up -d"
  }
}
```

---

## 9. Implementation Checklist

### Setup & Configuration

- [ ] Install Drizzle ORM and dependencies
- [ ] Create Docker Compose configuration
- [ ] Set up environment variables
- [ ] Configure Drizzle Kit
- [ ] Create database connection client

### Database Schema

- [ ] Define `submissions` table
- [ ] Define `feedback` table
- [ ] Define `roasts` table
- [ ] Define enum types (ProgrammingLanguage, FeedbackType, SeverityLevel, IssueCategory, Badge)
- [ ] Create indexes for performance
- [ ] Add foreign key constraints

### Migrations & Initialization

- [ ] Generate initial migrations
- [ ] Create database initialization script
- [ ] Test migrations locally
- [ ] Document migration strategy

### Queries & Services

- [ ] Implement submission creation query
- [ ] Implement submission retrieval queries
- [ ] Implement feedback creation query
- [ ] Implement leaderboard ranking query
- [ ] Implement view count update query
- [ ] Implement roast record creation
- [ ] Add query error handling

### Testing & Validation

- [ ] Set up integration tests
- [ ] Test all CRUD operations
- [ ] Test leaderboard queries
- [ ] Test foreign key constraints
- [ ] Validate schema with real data

### Documentation

- [ ] Document database setup
- [ ] Document query usage
- [ ] Document migration process
- [ ] Update README with database instructions

---

## 10. Query Patterns (Examples)

### Get Top Roasts (Leaderboard)

```typescript
// Fetch top 10 submissions by severity score
const topRoasts = await db
  .select({
    id: submissions.id,
    title: submissions.title,
    language: submissions.language,
    severity: submissions.severityScore,
    views: submissions.viewCount,
    createdAt: submissions.createdAt
  })
  .from(submissions)
  .leftJoin(roasts, eq(roasts.submissionId, submissions.id))
  .orderBy(desc(submissions.severityScore))
  .limit(10)
```

### Get Submission with Feedback

```typescript
// Fetch a submission with its associated feedback
const submission = await db
  .select()
  .from(submissions)
  .leftJoin(feedback, eq(feedback.submissionId, submissions.id))
  .where(eq(submissions.id, submissionId))
```

### Insert New Submission

```typescript
// Create a new code submission
const newSubmission = await db
  .insert(submissions)
  .values({
    code: userCode,
    language: selectedLanguage,
    title: userTitle,
    roastMode: isRoastMode
  })
  .returning()
```

---

## 11. Security Considerations

- [ ] Use prepared statements (Drizzle handles this automatically)
- [ ] Implement input validation before database queries
- [ ] Use environment variables for database credentials
- [ ] Implement SQL injection prevention
- [ ] Add rate limiting for API endpoints
- [ ] Sanitize user input for code storage
- [ ] Implement proper error messages (no SQL errors to users)
- [ ] Use PostgreSQL roles with least privilege principle

---

## 12. Performance Targets

- Leaderboard query: < 200ms
- Single submission retrieval: < 100ms
- Feedback generation storage: < 500ms
- Bulk insert operations: < 1s for 100 records

---

## 13. Future Considerations

- [ ] Read replicas for scaling
- [ ] Connection pooling optimization (pgBouncer)
- [ ] Full-text search on code/feedback content
- [ ] Caching layer (Redis for leaderboard)
- [ ] Sharding strategy for large datasets
- [ ] Time-series data for analytics
- [ ] Soft deletes for submissions
- [ ] Data archival strategy

---

## 14. References & Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Drizzle Kit CLI](https://orm.drizzle.team/docs/kit-overview)

---

## Appendix: Quick Start Commands

```bash
# Start database
pnpm docker:up

# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# View Drizzle Studio
pnpm db:studio

# Reset database (development only)
pnpm docker:reset

# View logs
pnpm docker:logs

# Stop database
pnpm docker:down
```

---

**Document prepared for implementation**  
*Ready for development phase to begin*
