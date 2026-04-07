# Testing Guide - DevRoast

This document explains how to run and manage the Playwright visual tests for the DevRoast application.

## Playwright Visual Tests

We use **Playwright** for end-to-end visual testing and regression detection. All tests verify that the application UI renders correctly across different pages and viewport sizes.

### Setup

Playwright and its browser dependencies are already configured:

```bash
pnpm install                    # Install dependencies (includes @playwright/test)
```

Browsers are downloaded automatically on first test run.

### Running Tests

#### Run all tests
```bash
pnpm exec playwright test visual-tests.spec.ts --config=playwright.config.ts
```

#### Run tests in headed mode (see browser window)
```bash
pnpm exec playwright test visual-tests.spec.ts --config=playwright.config.ts --headed
```

#### Run tests with visual debugging
```bash
pnpm exec playwright test visual-tests.spec.ts --config=playwright.config.ts --debug
```

#### View test report
```bash
pnpm exec playwright show-report
```

### Prerequisites

1. **Dev server must be running** on `http://localhost:3000`
   ```bash
   pnpm dev
   ```

2. **Database must have data** - Tests query real submissions from the database or fall back to mock data

### Test Coverage

The test suite includes **14 comprehensive tests** covering:

#### Home Page (4 tests)
- Page structure with all sections rendered
- Animated metrics (codes roasted, average score)
- Leaderboard preview with syntax highlighting
- Navigation links and interactions

#### Leaderboard Page (4 tests)
- Data rendering with proper loading states
- Syntax-highlighted code in table rows (100+ submissions)
- Scrollable code containers with max-height styling
- Clickable rows that link to results pages

#### Results Page (2 tests)
- Dynamic ID resolution from leaderboard
- Code feedback structure and display
- Syntax highlighting with Shiki renderer

#### Responsive Design (2 tests)
- Mobile viewport testing (375x667px)
- Home and leaderboard pages on mobile

#### Visual Regression (2 tests)
- Baseline snapshots for home page
- Baseline snapshots for leaderboard page

### Key Features

**Syntax Highlighting**
- Tests verify Shiki-rendered code is properly displayed
- Supports multiple languages with proper fallbacks
- Uses Vesper theme for dark aesthetic

**Scrollable Code**
- Leaderboard code containers have max-height: 120px
- Home preview code has max-height: 80px
- Tests verify overflow scrolling works correctly

**Dynamic Loading**
- Tests wait for `networkidle` state before assertions
- Handles async Suspense boundaries gracefully
- Timeouts set to 10 seconds for slow connections

**Visual Regression**
- Baseline images stored in `visual-tests.spec.ts-snapshots/`
- Automatic comparison on future test runs
- Captures full-page screenshots for comparison

### Troubleshooting

#### Tests timeout or fail to connect
- Ensure dev server is running: `pnpm dev`
- Check localhost:3000 is accessible
- Increase timeout if running on slow machine (edit `playwright.config.ts`)

#### Element not found errors
- Add `--headed` flag to see browser visually
- Use `--debug` flag for step-by-step debugging
- Check if page structure changed - update selectors

#### Visual regression snapshots different
- Expected: Database content varies between runs
- For intentional visual changes: run with `--update-snapshots`
  ```bash
  pnpm exec playwright test visual-tests.spec.ts --config=playwright.config.ts --update-snapshots
  ```

### Configuration

**File:** `playwright.config.ts`

Key settings:
- `baseURL`: `http://localhost:3000` (dev server URL)
- `timeout`: `30000ms` (per test timeout)
- `workers`: `1` (run sequentially to avoid port conflicts)
- `reporter`: `html` (generates detailed test report)
- `screenshot`: `only-on-failure` (capture failures for debugging)

**File:** `visual-tests.spec.ts`

The test file includes:
- 14 comprehensive test cases
- Smart selectors that adapt to page structure
- Proper loading state handling
- Accessibility-first assertions

### CI/CD Integration

To integrate tests into your CI pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run Playwright tests
  run: |
    pnpm install
    pnpm build
    pnpm dev &
    sleep 5
    pnpm exec playwright test visual-tests.spec.ts --config=playwright.config.ts
```

### Test Maintenance

When making UI changes:

1. **Run tests locally first**
   ```bash
   pnpm dev &
   pnpm exec playwright test visual-tests.spec.ts --config=playwright.config.ts
   ```

2. **Update selectors if HTML changes**
   - Edit selectors in `visual-tests.spec.ts`
   - Ensure selectors are resilient (e.g., use `has-text` for text content)

3. **Update visual baselines if intentional**
   ```bash
   pnpm exec playwright test visual-tests.spec.ts --config=playwright.config.ts --update-snapshots
   ```

4. **Commit updated snapshots with your changes**
   ```bash
   git add visual-tests.spec.ts-snapshots/
   git commit -m "test: update Playwright snapshots after UI changes"
   ```

### Files

- **`playwright.config.ts`** - Playwright configuration
- **`visual-tests.spec.ts`** - Test definitions (14 tests)
- **`visual-tests.spec.ts-snapshots/`** - Visual baseline images
  - `home-page-chromium-darwin.png`
  - `leaderboard-page-chromium-darwin.png`

### Next Steps

- Add tests for new features (code submission form, results interactions)
- Integrate with CI/CD pipeline for automated testing
- Monitor visual regressions in pull requests
- Add performance testing for page load times
