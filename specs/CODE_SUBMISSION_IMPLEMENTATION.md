# DevRoast - Code Submission (Roasts) Implementation Specification

**Document Version**: 1.0.0  
**Last Updated**: April 7, 2026  
**Status**: Completed

---

## 1. Overview

This specification outlines the implementation of the core DevRoast feature: allowing users to submit code snippets and receive AI-powered feedback with optional sarcastic roasting. The flow is: user submits code → backend validates and stores → AI generates feedback → user is redirected to results page showing analysis.

### Key Objectives

- Enable users to submit code snippets with language selection and roast mode toggle
- Store submissions in database with metadata (language, roast_mode)
- Generate AI-powered code feedback using Google Gemini API
- Prevent spam through rate limiting (per IP + global cooldown)
- Provide fast UX with asynchronous feedback generation
- Display results immediately with loading state while feedback is being analyzed

---

## 2. Tech Stack

### Frontend
- **React 19** - Client component for form interaction
- **TanStack React Query** - Mutation handling for form submission
- **tRPC** - Type-safe API communication
- **Sonner** - Toast notifications for success/error feedback
- **Tailwind CSS** - Styling (existing)

### Backend
- **Next.js 16 Server Actions** - API route handling
- **tRPC** - Procedure definition and routing
- **Drizzle ORM** - Database queries
- **Google Gemini API** - AI feedback generation (gemini-flash-latest model)
- **TypeScript** - Type safety

### External APIs
- **Google Gemini API** - AI-powered code analysis
  - Model: `gemini-flash-latest` (fast, cost-effective)
  - Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`
  - Authentication: API key in `x-goog-api-key` header (stored in environment variables)

### Database
- **PostgreSQL** - Submissions and feedback storage (existing)
- **Drizzle ORM** - Type-safe queries

---

## 3. Architecture

### 3.1 Data Flow

```
User submits code
    ↓
[Frontend] React Query mutation → tRPC endpoint
    ↓
[Backend] Validate input, check rate limits
    ↓
[Database] Create submission record
    ↓
[Response] Return submission ID immediately
    ↓
[Frontend] Redirect to /results/{id}
    ↓
[Background] Trigger AI feedback generation (async)
    ↓
[Database] Store generated feedback
    ↓
[Results Page] Poll for feedback / Show loading state
    ↓
[Results Page] Display feedback when ready
```

### 3.2 Rate Limiting Strategy

**Combination approach:**
- **Per IP rate limit**: Max 5 submissions per hour per IP address
- **Global cooldown**: Minimum 30 seconds between ANY submissions (all users)
- **Enforcement**: Check both limits, fail if either exceeded

**Storage**: Use in-memory cache (simple) or Redis (scalable). For MVP, use in-memory Map with automatic cleanup.

### 3.3 AI Feedback Generation

**Prompt Design** (varies based on roast_mode):

**Standard Mode:**
```
Analyze this code and provide constructive feedback on:
1. Performance issues
2. Code style and readability
3. Best practices violations
4. Security concerns
5. Potential bugs

Be professional and helpful.

Code language: {language}
Code: {code}
```

**Roast Mode:**
```
You are a brutally sarcastic code reviewer. Analyze this code and absolutely roast it.
Be maximum sarcastic AND harsh. Point out every flaw with cutting humor.

1. Performance issues (with sarcasm)
2. Terrible style choices
3. Best practices violations (with mockery)
4. Security nightmares
5. Logic errors and bugs

Code language: {language}
Code: {code}
```

---

## 4. Database Schema

### Existing Tables (Reuse)

#### `submissions`
```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  language VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  description TEXT,
  roast_mode BOOLEAN DEFAULT false,
  severity_score INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `feedback`
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

### Rate Limiting (In-Memory)

**Structure** (not persisted):
```typescript
interface RateLimitEntry {
  count: number;
  timestamp: number;
  lastSubmission: number;
}

// Per IP tracking
const ipSubmissions: Map<string, RateLimitEntry> = new Map();

// Last global submission timestamp
let lastGlobalSubmission: number = 0;
```

---

## 5. API Design

### tRPC Procedure: `submissions.create`

**Location**: `src/server/trpc/routes/submissions.ts`

**Input Validation**:
```typescript
interface CreateSubmissionInput {
  code: string;              // Required, 1-50,000 chars, no HTML
  language: string;          // Required, enum: javascript|python|rust|go|java|cpp|csharp|typescript|jsx|tsx
  roastMode: boolean;        // Optional, default: false
  title?: string;            // Optional, max 255 chars
  description?: string;      // Optional, max 1000 chars
}
```

**Output**:
```typescript
interface CreateSubmissionResponse {
  id: string;               // UUID of created submission
  code: string;             // Echo back submitted code
  language: string;         // Language submitted
  roastMode: boolean;       // Roast mode setting
  createdAt: Date;          // Timestamp
}
```

**Error Cases**:
- `CODE_REQUIRED`: Code is empty
- `CODE_TOO_LONG`: Code exceeds 50KB
- `INVALID_LANGUAGE`: Language not in whitelist
- `RATE_LIMIT_PER_IP`: User's IP exceeded 5 submissions/hour
- `RATE_LIMIT_GLOBAL`: Global cooldown still active (< 30 seconds since last submission)
- `INVALID_CODE`: Contains HTML or suspicious content
- `INTERNAL_ERROR`: Database or AI service failure

**Behavior**:
1. Validate input (code length, language, content)
2. Check rate limits (IP-based + global cooldown)
3. Sanitize code (remove HTML/dangerous content)
4. Create submission in database
5. Trigger background AI feedback generation (don't await)
6. Return submission ID to client
7. Client redirects to `/results/{id}`

---

## 6. Implementation Details

### 6.1 File Structure

```
src/
├── server/
│   ├── trpc/
│   │   ├── routes/
│   │   │   ├── submissions.ts         [NEW] - Submission mutation
│   │   │   └── metrics.ts             [EXISTING]
│   │   ├── init.ts                    [EXISTING]
│   │   ├── router.ts                  [MODIFIED] - Add submissions
│   │   └── server.tsx                 [EXISTING]
│   └── lib/
│       ├── submissions.ts             [NEW] - DB helpers
│       ├── rate-limiter.ts            [NEW] - Rate limit logic
│       └── gemini.ts                  [NEW] - Gemini API client
├── components/
│   ├── CodeEditorSection.tsx          [MODIFIED] - Wire up mutation
│   └── ui/
│       └── CodeEditor.tsx             [MODIFIED] - Export language value
└── [rest of structure unchanged]
```

### 6.2 Key Implementation Functions

#### Rate Limiter (`src/server/lib/rate-limiter.ts`)

```typescript
interface RateLimitResult {
  allowed: boolean;
  reason?: 'IP_LIMIT' | 'GLOBAL_COOLDOWN';
  resetTime?: number; // Unix timestamp when they can try again
}

export function checkRateLimit(clientIp: string): RateLimitResult {
  // Implementation cleans old entries and checks limits
  // Returns { allowed: true } or { allowed: false, reason, resetTime }
}

export function recordSubmission(clientIp: string): void {
  // Records submission timestamp and increments counter
}
```

#### Gemini AI Client (`src/server/lib/gemini.ts`)

```typescript
export async function generateFeedback(
  code: string,
  language: string,
  roastMode: boolean
): Promise<string> {
  // Makes REST call to Gemini API with appropriate prompt
  // Returns generated feedback text
  // Throws on API errors
}
```

#### Submission Creation (`src/server/lib/submissions.ts`)

```typescript
export async function createSubmission(input: {
  code: string;
  language: string;
  roastMode: boolean;
  title?: string;
  description?: string;
}) {
  // Inserts into database
  // Returns created submission object
}

export async function saveFeedback(
  submissionId: string,
  content: string
): Promise<void> {
  // Saves feedback to database
  // Updates submission's updated_at timestamp
}
```

#### tRPC Submission Router (`src/server/trpc/routes/submissions.ts`)

```typescript
export const submissionsRouter = router({
  create: publicProcedure
    .input(z.object({
      code: z.string().min(1).max(50000),
      language: z.enum([...SUPPORTED_LANGUAGES]),
      roastMode: z.boolean().optional().default(false),
      title: z.string().max(255).optional(),
      description: z.string().max(1000).optional(),
    }))
    .mutation(async ({ input }) => {
      // 1. Get client IP from headers
      // 2. Check rate limits
      // 3. Validate input (no HTML)
      // 4. Create submission in DB
      // 5. Trigger async feedback generation
      // 6. Return submission details
    }),
});
```

---

## 7. Frontend Implementation

### 7.1 Updated CodeEditorSection Component

**Location**: `src/components/CodeEditorSection.tsx`

**Key Changes**:
- Add `useState` for language selection
- Use tRPC mutation hook for submission
- Handle loading states with button disabled + spinner
- Show toast notifications for success/error
- Handle rate limit errors with helpful message
- Redirect to results page after successful submission

**State to manage**:
- `code`: Current code in editor
- `roastMode`: Roast mode toggle
- `language`: Selected language (captured from CodeEditor)
- `isPending`: Mutation is in progress
- `error`: Mutation error (if any)

### 7.2 CodeEditor Component Update

**Small change**: Export selected language via callback

```typescript
// Ensure callback is triggered when language changes
onLanguageChange={(lang) => setSelectedLanguage(lang)}
```

---

## 8. Results Page Integration

### Current State
- Results page already displays feedback from database ✅
- Shows loading skeleton while feedback loads ✅

### No Changes Needed
- The results page at `/results/[id]` already handles dynamic loading
- It fetches from `metrics.getSubmissionById()` which returns feedback
- The async feedback generation means feedback might not be ready immediately
- Results page skeleton + "Loading feedback..." message is sufficient

---

## 9. Environment Variables

### Required (Add to .env.local and .env.production)

```bash
# Google Gemini API authentication
GEMINI_API_KEY=your_api_key_here
```

**Location**: 
- Development: `.env.local`
- Production: `.env.production` or environment variable in deployment

**Setup**:
1. Get API key from Google AI Studio: https://ai.google.dev/
2. Add to `.env.local` for development
3. Configure in deployment pipeline for production

---

## 10. Dependencies

### New Package to Install

```bash
# Toast notifications UI
pnpm add sonner
```

### Already Installed
- `@trpc/client` - tRPC client
- `@trpc/react-query` - React Query integration
- `@tanstack/react-query` - React Query itself
- `zod` - Input validation

---

## 11. Testing Strategy

### Unit Tests

- **Rate Limiter**:
  - ✓ Allows submission if no previous submissions
  - ✓ Blocks after 5 submissions in 1 hour (per IP)
  - ✓ Allows after 1 hour expires
  - ✓ Blocks if < 30 seconds since last submission
  - ✓ Allows after 30 second cooldown

- **Input Validation**:
  - ✓ Rejects empty code
  - ✓ Rejects code > 50KB
  - ✓ Rejects invalid language
  - ✓ Rejects code with HTML tags
  - ✓ Accepts valid code

- **Gemini Prompt**:
  - ✓ Standard mode generates professional feedback
  - ✓ Roast mode generates sarcastic feedback

### Integration Tests

- ✓ Submit code → Submission created in DB
- ✓ Submit code → Feedback generation triggered
- ✓ Submit code → Redirect to results page
- ✓ Results page → Shows feedback after generation
- ✓ Rate limit violation → Shows error toast

### Playwright Tests (Update existing)

- ✓ User can enter code and click "start the roast"
- ✓ User sees loading state during submission
- ✓ User is redirected to results page
- ✓ Results page shows feedback (after generation)
- ✓ Roast mode toggle affects generated feedback

---

## 12. Rollout Plan

### Phase 1: Backend Implementation (Estimated 1-2 hours)
- [x] Create `src/server/lib/rate-limiter.ts`
- [x] Create `src/server/lib/gemini.ts`
- [x] Create `src/server/lib/submissions.ts`
- [x] Create `src/server/trpc/routes/submissions.ts`
- [x] Update `src/server/trpc/router.ts`
- [x] Test API endpoint with curl/Postman

### Phase 2: Frontend Implementation (Estimated 1 hour)
- [x] Install `sonner` dependency
- [x] Update `src/components/CodeEditorSection.tsx`
- [x] Update `src/components/ui/CodeEditor.tsx`
- [x] Test UI interactions locally

### Phase 3: Integration & Testing (Estimated 1 hour)
- [x] End-to-end flow test (submit → redirect → results)
- [x] Rate limit testing (IP + cooldown)
- [x] Gemini API error handling
- [x] Update Playwright tests
- [x] Manual QA on multiple browsers

### Phase 4: Deployment
- [x] Set GEMINI_API_KEY in production environment
- [x] Deploy to production
- [x] Monitor error logs for Gemini API issues
- [x] Verify rate limiting works correctly

---

## 13. Error Handling & Edge Cases

### Gemini API Failures
- **Issue**: Gemini API is down or times out
- **Solution**: Background job fails silently, feedback shows as "pending" on results page
- **Future**: Add retry mechanism or manual regeneration button

### Rate Limit Exceeded
- **Issue**: User hits rate limit
- **Solution**: Return helpful error message with countdown
- **UX**: Toast notification shows "Too many submissions. Try again in X minutes."

### Invalid Code/HTML Injection
- **Issue**: User pastes HTML/suspicious content
- **Solution**: Reject at validation layer
- **UX**: Toast notification shows validation error

### Database Error
- **Issue**: Database insert fails
- **Solution**: Return 500 error, user sees "Something went wrong"
- **UX**: Toast notification with retry option

---

## 14. Supported Languages

The following programming languages are supported for submission:

- JavaScript / TypeScript
- JSX / TSX
- Python
- Rust
- Go
- Java
- C++
- C#

---

## 15. Future Enhancements

- **Polling for feedback**: Refresh results page when feedback is ready
- **WebSocket updates**: Real-time feedback streaming
- **Feedback caching**: Cache similar code to avoid duplicate AI calls
- **User accounts**: Track per-user rate limits instead of IP
- **Feedback ratings**: Let users rate feedback quality
- **Export/share**: Allow users to share results (implement after Phase 1)
- **Multiple AI providers**: Support OpenAI, Anthropic, etc.

---

## 16. References

- [Google Gemini API Docs](https://ai.google.dev/gemini-api/docs)
- [Gemini Models](https://ai.google.dev/models)
- [tRPC Documentation](https://trpc.io)
- [React Query (TanStack Query) Mutations](https://tanstack.com/query/latest/docs/react/guides/mutations)
- [Sonner Toast Library](https://sonner.emilkowal.ski)
- [Existing DevRoast Specs](./REACT_QUERY_IMPLEMENTATION.md)

---

**Authors**: OpenCode Agent  
**Status**: Completed  
**Next Step**: Phase 2 - Leaderboard and results page enhancements
