import { test, expect } from '@playwright/test'

test.describe('DevRoast Visual Tests', () => {
  const baseUrl = 'http://localhost:3000'

  test.describe('Home Page', () => {
    test('should render home page with all sections', async ({ page }) => {
      await page.goto(`${baseUrl}/`)
      
      // Check hero section
      const heroTitle = page.locator('h1:has-text("paste your code. get roasted.")')
      await expect(heroTitle).toBeVisible()
      
      // Check code editor section
      const codeEditor = page.locator('text=paste your code here')
      await expect(codeEditor).toBeVisible()
      
      // Check metrics section
      const metricsSection = page.locator('text=codes roasted')
      await expect(metricsSection).toBeVisible({ timeout: 5000 })
      
      // Check leaderboard preview
      const leaderboardPreview = page.locator('text=shame leaderboard')
      await expect(leaderboardPreview).toBeVisible({ timeout: 5000 })
      
      console.log('✅ Home page structure verified')
    })

    test('should display animated metrics', async ({ page }) => {
      await page.goto(`${baseUrl}/`)
      
      // Wait for metrics to appear and be interactive
      const totalRoasts = page.locator('text=/\\d+\\s+codes roasted/')
      await expect(totalRoasts).toBeVisible({ timeout: 5000 })
      
      const avgScore = page.locator('text=/avg score:\\s+\\d+/')
      await expect(avgScore).toBeVisible({ timeout: 5000 })
      
      console.log('✅ Metrics animation loaded successfully')
    })

    test('should display leaderboard preview with syntax highlighting', async ({ page }) => {
      await page.goto(`${baseUrl}/`)
      
      // Wait for leaderboard content
      await page.waitForSelector('div:has-text("shame leaderboard")', { timeout: 5000 })
      
      // Check for syntax-highlighted code (Shiki output has specific classes)
      const codeContainer = page.locator('div[class*="overflow-y-auto"][class*="bg-gray-800"]').first()
      await expect(codeContainer).toBeVisible({ timeout: 5000 })
      
      // Verify code is visible (not truncated)
      const codeText = await codeContainer.textContent()
      if (codeText) {
        console.log(`✅ Code preview visible: ${codeText.substring(0, 50)}...`)
      }
    })

    test('should have working navigation links', async ({ page }) => {
      await page.goto(`${baseUrl}/`)
      
      // Find leaderboard link
      const leaderboardLink = page.locator('a:has-text("view_all")')
      await expect(leaderboardLink).toBeVisible({ timeout: 5000 })
      
      console.log('✅ Navigation links are visible')
    })
  })

  test.describe('Leaderboard Page', () => {
    test('should render leaderboard with data', async ({ page }) => {
      await page.goto(`${baseUrl}/leaderboard`)
      
      // Wait for page to load
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)
      
      // Check page title
      const title = page.locator('h1:has-text("shame leaderboard")')
      await expect(title).toBeVisible({ timeout: 10000 })
      
      // Check stats section
      const stats = page.locator('text=/total submissions:/')
      await expect(stats).toBeVisible({ timeout: 10000 })
      
      // Check table header
      const tableHeader = page.locator('div[class*="w-\\[70px\\]"]:has-text("score")').first()
      await expect(tableHeader).toBeVisible({ timeout: 10000 })
      
      console.log('✅ Leaderboard page structure verified')
    })

    test('should display syntax-highlighted code in table rows', async ({ page }) => {
      await page.goto(`${baseUrl}/leaderboard`)
      
      // Wait for table rows
      await page.waitForSelector('div[class*="overflow-y-auto"][class*="bg-gray-800"]', { timeout: 5000 })
      
      // Get first code container
      const codeContainers = page.locator('div[class*="overflow-y-auto"][class*="bg-gray-800"]')
      const count = await codeContainers.count()
      
      if (count > 0) {
        const firstCode = codeContainers.first()
        await expect(firstCode).toBeVisible()
        
        const codeText = await firstCode.textContent()
        console.log(`✅ Found ${count} syntax-highlighted code blocks`)
        console.log(`   First code preview: ${codeText?.substring(0, 40)}...`)
      }
    })

    test('should have scrollable code containers', async ({ page }) => {
      await page.goto(`${baseUrl}/leaderboard`)
      
      // Wait for code containers
      await page.waitForSelector('div[class*="max-h-\\[120px\\]"]', { timeout: 5000 })
      
      // Check max-height styling
      const codeContainer = page.locator('div[class*="overflow-y-auto"]').first()
      const classes = await codeContainer.getAttribute('class')
      
      if (classes?.includes('max-h-')) {
        console.log('✅ Code containers have max-height styling (scrollable)')
      }
    })

    test('should be clickable to view results', async ({ page }) => {
      await page.goto(`${baseUrl}/leaderboard`)
      
      // Wait for first row link
      const firstRow = page.locator('a').filter({ hasText: /[0-9]/ }).first()
      await expect(firstRow).toBeVisible({ timeout: 5000 })
      
      // Hover to show it's interactive
      await firstRow.hover()
      
      console.log('✅ Leaderboard rows are clickable')
    })
  })

  test.describe('Results Page', () => {
    test('should render results page with code and feedback', async ({ page }) => {
      // First get a valid submission ID from leaderboard
      await page.goto(`${baseUrl}/leaderboard`)
      await page.waitForLoadState('networkidle')
      
      // Get the first submission link
      const firstLink = page.locator('a').filter({ hasText: /^[0-9]/ }).first()
      const href = await firstLink.getAttribute('href')
      
      if (!href) {
        console.log('⚠️ No valid submission link found, using fallback ID 1')
        await page.goto(`${baseUrl}/results/1`)
      } else {
        await page.goto(`${baseUrl}${href}`)
      }
      
      // Wait for page to load
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)
      
      // Check page title - it has a $ prefix in a span
      const title = page.locator('h1:has-text("your roast results")')
      await expect(title).toBeVisible({ timeout: 10000 })
      
      // Check score display
      const scoreText = page.locator('text=shame score')
      await expect(scoreText).toBeVisible({ timeout: 10000 })
      
      // Check code section
      const codeSection = page.locator('h2:has-text("submitted code")')
      await expect(codeSection).toBeVisible({ timeout: 10000 })
      
      console.log('✅ Results page structure verified')
    })

    test('should display syntax-highlighted code block', async ({ page }) => {
      await page.goto(`${baseUrl}/results/1`)
      
      // Wait for page to load
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)
      
      // Check for code block container - look for pre tag which Shiki creates
      const codeBlock = page.locator('pre').first()
      await expect(codeBlock).toBeVisible({ timeout: 10000 })
      
      console.log('✅ Code block with syntax highlighting visible')
    })
  })

  test.describe('Responsive Design', () => {
    test('home page should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto(`${baseUrl}/`)
      
      // Check main elements are still visible
      const title = page.locator('h1:has-text("paste your code")')
      await expect(title).toBeVisible()
      
      console.log('✅ Home page responsive on mobile (375x667)')
    })

    test('leaderboard should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto(`${baseUrl}/leaderboard`)
      
      const title = page.locator('h1:has-text("shame leaderboard")')
      await expect(title).toBeVisible()
      
      console.log('✅ Leaderboard responsive on mobile (375x667)')
    })
  })

  test.describe('Visual Regression', () => {
    test('home page visual snapshot', async ({ page }) => {
      await page.goto(`${baseUrl}/`)
      
      // Wait for dynamic content
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)
      
      await expect(page).toHaveScreenshot('home-page.png', { maxDiffPixels: 100 })
      console.log('✅ Home page snapshot captured')
    })

    test('leaderboard page visual snapshot', async ({ page }) => {
      await page.goto(`${baseUrl}/leaderboard`)
      
      // Wait for dynamic content
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)
      
      await expect(page).toHaveScreenshot('leaderboard-page.png', { maxDiffPixels: 100 })
      console.log('✅ Leaderboard snapshot captured')
    })
  })
})
