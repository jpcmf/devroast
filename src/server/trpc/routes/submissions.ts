/**
 * tRPC Submissions Router
 * Handles code submission and feedback generation
 */

import { z } from 'zod'
import { publicProcedure, router } from '../init'
import {
  checkRateLimit,
  recordSubmission,
  getMinutesUntilReset,
} from '@/server/lib/rate-limiter'
import {
  createNewSubmission,
  generateAndSaveFeedback,
} from '@/server/lib/submissions'
import { headers } from 'next/headers'

// Validation schema for code submission
const submitCodeSchema = z.object({
  code: z
    .string()
    .min(1, 'Code is required')
    .max(50000, 'Code is too long (max 50,000 characters)'),
  language: z.enum([
    'javascript',
    'typescript',
    'python',
    'rust',
    'golang',
    'java',
    'csharp',
    'php',
    'ruby',
    'kotlin',
    'sql',
    'html',
    'css',
    'json',
    'yaml',
    'bash',
    'other',
  ]),
  roastMode: z.boolean().default(false),
})

/**
 * Extract client IP from headers
 * Handles various proxy scenarios (x-forwarded-for, cloudflare, etc)
 */
async function getClientIp(): Promise<string> {
  const headersList = await headers()

  // Try various header sources in order of reliability
  const forwarded = headersList.get('x-forwarded-for')
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim()
  }

  const cfConnectingIp = headersList.get('cf-connecting-ip')
  if (cfConnectingIp) {
    return cfConnectingIp
  }

  const xRealIp = headersList.get('x-real-ip')
  if (xRealIp) {
    return xRealIp
  }

  // Fallback to localhost if no header found (should not happen in production)
  return '127.0.0.1'
}

/**
 * Check for HTML injection attempt
 * Basic protection against XSS in code submissions
 */
function containsHtmlInjection(code: string): boolean {
  const htmlTagRegex = /<\s*(?:script|style|img|iframe|object|embed|link)\b[^>]*>/i
  return htmlTagRegex.test(code)
}

export const submissionsRouter = router({
  create: publicProcedure
    .input(submitCodeSchema)
    .mutation(async ({ input }) => {
      // Validate input
      if (containsHtmlInjection(input.code)) {
        throw new Error('Invalid code: HTML injection detected')
      }

      // Get client IP for rate limiting
      const clientIp = await getClientIp()

      // Check rate limits
      const rateLimitResult = checkRateLimit(clientIp)
      if (!rateLimitResult.allowed) {
        if (rateLimitResult.reason === 'IP_LIMIT') {
          const minutesLeft = getMinutesUntilReset(
            rateLimitResult.resetTime || 0
          )
          throw new Error(
            `Rate limit exceeded. You can submit again in ${minutesLeft} minutes.`
          )
        }
        if (rateLimitResult.reason === 'GLOBAL_COOLDOWN') {
          throw new Error(
            'Please wait 30 seconds before submitting another code snippet.'
          )
        }
      }

      // Record this submission for rate limiting
      recordSubmission(clientIp)

      // Create submission in database
      const submissionId = await createNewSubmission({
        code: input.code,
        language: input.language,
        roastMode: input.roastMode,
      })

      // Generate feedback asynchronously in the background
      // Use setImmediate to ensure it runs even if the response is sent first
      setImmediate(() => {
        generateAndSaveFeedback(
          submissionId,
          input.code,
          input.language,
          input.roastMode
        ).catch((error) => {
          console.error('[Submissions] Background feedback generation failed:', error)
        })
      })

      // Return submission ID for redirect
      return {
        submissionId,
      }
    }),
})
