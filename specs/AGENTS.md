# DevRoast - Specification Format Guide

This document outlines the standard format and structure for creating specifications in the `@specs/` folder before implementing new features.

---

## Purpose

Specifications serve as detailed blueprints for implementing features. They define:
- **What** needs to be built
- **Why** it's needed
- **How** it should be implemented
- **Technical requirements** and constraints
- **Testing criteria** for acceptance

Creating specs BEFORE implementation ensures:
- Clear requirements and reduced rework
- Better communication with team members
- Documented architectural decisions
- Easier code review and testing

---

## File Naming Convention

Specifications should follow this naming pattern:

```
{FEATURE_NAME}_SPECIFICATION.md
or
{FEATURE_NAME}_IMPLEMENTATION.md
```

**Examples:**
- `DRIZZLE_IMPLEMENTATION.md` - ORM implementation spec
- `LEADERBOARD_SPECIFICATION.md` - Leaderboard feature spec
- `API_ROUTES_SPECIFICATION.md` - API endpoints spec
- `AUTHENTICATION_IMPLEMENTATION.md` - Auth system spec

---

## Standard Specification Structure

All specifications MUST follow this structure:

### 1. **Header Section**

```markdown
# DevRoast - {Feature Name} Specification

**Document Version**: X.Y.Z  
**Last Updated**: March DD, 2026  
**Status**: [Ready for Implementation | In Progress | Completed]

---
```

**Requirements:**
- Clear title with feature name
- Version number (semantic versioning)
- Last updated date
- Current status indicator

---

### 2. **Overview Section**

```markdown
## 1. Overview

Brief description of what this feature/system is and why it's needed.

### Key Objectives

- Objective 1: Clear, measurable outcome
- Objective 2: User value or technical benefit
- Objective 3: System constraint or requirement
```

**Requirements:**
- 2-3 sentences explaining the feature
- 3-5 bullet points of key objectives
- Explain the "why" not just the "what"

---

### 3. **Tech Stack / Dependencies**

```markdown
## 2. Tech Stack

### Frontend
- Technology 1: Purpose
- Technology 2: Purpose

### Backend
- Technology 1: Purpose
- Technology 2: Purpose

### Database
- Technology 1: Purpose
- Technology 2: Purpose
```

**Requirements:**
- List all technologies that will be used
- Brief explanation of each technology's role
- Include versions if relevant
- Note any new dependencies to install

---

### 4. **Architecture / Design**

This section varies by feature type. Use ONE of these structures:

#### For Database Features:

```markdown
## 3. Database Schema

### 3.1 Core Tables

#### Table: `table_name`

**Purpose**: Description of what this table stores

```sql
CREATE TABLE table_name (
  id UUID PRIMARY KEY,
  column_name TYPE NOT NULL,
  ...
);
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `column` | type | Yes/No | What this field stores |

**Relationships**:
- FK: `foreign_key` → `other_table.column`

**Indexes**:
- PRIMARY: `id`
- INDEX: `column_name` (reason for index)
```

#### For API Features:

```markdown
## 3. API Design

### Endpoints Overview

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| GET | `/api/resource` | Get all items | Optional |
| POST | `/api/resource` | Create item | Required |

### Detailed Endpoints

#### GET /api/resource

**Description**: What this endpoint does

**Query Parameters**:
- `limit` (number): Max items to return
- `offset` (number): Pagination offset

**Response** (200 OK):
```json
{
  "data": [...],
  "total": 100
}
```

**Error** (400 Bad Request):
```json
{
  "error": "Invalid query parameter"
}
```
```

#### For Component Features:

```markdown
## 3. Component Architecture

### Component Hierarchy

```
ComponentName
├── ChildComponent1
│   ├── GrandchildComponent
│   └── GrandchildComponent
└── ChildComponent2
```

### Component Specifications

#### ComponentName

**Purpose**: What this component does

**Props**:
```typescript
interface ComponentNameProps {
  prop1: string;    // Description
  prop2?: boolean;  // Optional description
  onEvent?: () => void;
}
```

**State**:
- `state1`: Description and initial value
- `state2`: Description and initial value

**Behavior**:
- Handles user interaction X by doing Y
- Fetches data on mount
- Updates parent when Z changes
```

---

### 5. **Implementation Details**

```markdown
## 4. Implementation Details

### 4.1 Setup & Configuration

Steps to set up the feature:

1. Create necessary files/directories
2. Install dependencies: `npm install package-name`
3. Update configuration in `.env.local`
4. Run migrations if needed

### 4.2 Code Organization

```
src/
├── folder-name/
│   ├── component.tsx
│   ├── types.ts
│   └── utils.ts
```

### 4.3 Key Functions/Classes

#### functionName(param1, param2)

**Purpose**: What this function does

**Parameters**:
- `param1` (type): Description
- `param2` (type): Description

**Returns**: Description of return value

**Example**:
```typescript
const result = functionName("value1", 42);
// Returns: {...}
```
```

---

### 6. **Testing Strategy**

```markdown
## 5. Testing Strategy

### Unit Tests

- Test case 1: Describe what should happen
- Test case 2: Describe edge case behavior
- Test case 3: Describe error handling

### Integration Tests

- Test case 1: Component interaction with API
- Test case 2: Database query reliability
- Test case 3: User flow from start to finish

### Acceptance Criteria

- [ ] Feature works as described in overview
- [ ] All edge cases handled gracefully
- [ ] Code follows project standards
- [ ] Documentation is complete
```

**Requirements:**
- Define what "done" means
- Include both positive and negative test cases
- Specify manual testing scenarios if needed

---

### 7. **Dependencies & Breaking Changes**

```markdown
## 6. Dependencies & Breaking Changes

### New Dependencies

- `package-name` (v1.2.3): Why we need it

### Breaking Changes

- Change 1: Description and migration path
- Change 2: What needs updating elsewhere

### Migration Guide

If applicable, provide steps to migrate from old to new:

```bash
# Step 1: Update schema
npm run db:migrate

# Step 2: Update imports
# Before: import { old } from 'path'
# After: import { new } from 'path'
```
```

---

### 8. **Rollout Plan**

```markdown
## 7. Rollout Plan

### Phase 1: Development
- [ ] Implementation complete
- [ ] Unit tests passing
- [ ] Code review approved

### Phase 2: Testing
- [ ] Integration tests passing
- [ ] Manual QA complete
- [ ] Documentation updated

### Phase 3: Deployment
- [ ] Feature flag enabled (if applicable)
- [ ] Production database migrated
- [ ] Monitoring alerts configured
```

---

### 9. **References & Related Docs**

```markdown
## 8. References

- [Related Spec](./RELATED_SPECIFICATION.md)
- [Project Docs](../docs/feature-name.md)
- [External Reference](https://example.com)

---

**Authors**: Name  
**Reviewers**: Name(s)  
**Last Reviewed**: Date
```

---

## Minimal vs. Full Specifications

### Minimal Spec (for small features)

Include sections:
1. Overview
2. Tech Stack
3. Implementation Details (brief)
4. Testing Strategy
5. References

### Full Spec (for major features)

Include ALL sections listed above.

---

## Writing Guidelines

### Do's ✅

- **Be specific**: Use concrete examples, not vague descriptions
- **Use structured formatting**: Tables, lists, code blocks
- **Include examples**: Show expected inputs and outputs
- **Document decisions**: Explain WHY a choice was made
- **Keep it updated**: Update spec if requirements change
- **Use TypeScript/SQL blocks**: With syntax highlighting
- **Link between specs**: Reference related specifications

### Don'ts ❌

- **Don't be vague**: Avoid "should probably" or "might work"
- **Don't write novels**: Keep sections concise and scannable
- **Don't assume knowledge**: Explain context for new team members
- **Don't ignore edge cases**: Address error scenarios
- **Don't leave it outdated**: Update when implementation changes

---

## Review Checklist

Before marking a spec as "Ready for Implementation":

- [ ] Title clearly describes the feature
- [ ] Overview explains the "why"
- [ ] All required technologies listed
- [ ] Architecture is well-defined
- [ ] Implementation steps are clear
- [ ] Testing strategy covers main scenarios
- [ ] No ambiguous terms or missing details
- [ ] Code examples are syntactically correct
- [ ] Dependencies and breaking changes noted
- [ ] Rollout plan is realistic

---

## Examples

### ✅ Good Specification

Reference: `DRIZZLE_IMPLEMENTATION.md` in this folder

Structure:
- Clear versioning and status
- Comprehensive schema definitions
- Detailed field descriptions
- Testing and acceptance criteria
- Migration procedures documented

### How to Reference

When implementing a feature from a spec:

1. Read the entire spec first
2. Follow the implementation order suggested
3. Reference specific sections in commit messages
4. Update spec status as you progress
5. Document any deviations from the spec

---

## Questions?

When creating a spec, ask yourself:

- Would someone unfamiliar with the project understand what needs to be built?
- Are there edge cases I haven't considered?
- What could go wrong during implementation?
- How will this feature be tested?
- Is there anything ambiguous that needs clarification?

If you answer "no" to any of these, add more detail to your spec!
