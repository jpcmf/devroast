/**
 * Submissions Helper Functions for DevRoast
 * Handles submission creation and feedback processing
 */

import { createSubmission, updateSubmissionSeverity } from '@/db/queries/submissions'
import { createFeedback } from '@/db/queries/feedback'
import { createRoast } from '@/db/queries/roasts'
import { type NewSubmission, type NewFeedback } from '@/db/schema'
import { generateFeedback } from './gemini'

export interface CreateSubmissionInput {
  code: string
  language: string
  roastMode: boolean
}

/**
 * Creates a new submission and returns the submission ID
 */
export async function createNewSubmission(
  input: CreateSubmissionInput
): Promise<string> {
  const newSubmission: NewSubmission = {
    code: input.code,
    language: input.language as any,
    roastMode: input.roastMode,
    title: undefined,
    description: undefined,
  }

  const submission = await createSubmission(newSubmission)
  return submission.id
}

/**
 * Generates feedback for a submission and saves it to the database
 * This is meant to be called asynchronously in the background
 */
export async function generateAndSaveFeedback(
  submissionId: string,
  code: string,
  language: string,
  roastMode: boolean
): Promise<void> {
  try {
    console.log(`[generateAndSaveFeedback] Starting feedback generation for submission: ${submissionId}`)
    
    // Generate feedback from Gemini
    const { feedback: feedbackText, severity, issuesFound, recommendationsCount } = await generateFeedback({
      code,
      language,
      roastMode,
    })

    console.log(`[generateAndSaveFeedback] Feedback generated successfully for submission: ${submissionId}`)

    // Determine feedback type based on roast mode
    const feedbackType = roastMode ? 'roast' : 'standard'

    // Save feedback to database
    const newFeedback: NewFeedback = {
      submissionId,
      feedbackType: feedbackType as any,
      content: feedbackText,
      issuesFound,
      recommendationsCount,
    }

    await createFeedback(newFeedback)
    console.log(`[generateAndSaveFeedback] Feedback saved to database for submission: ${submissionId}`)

    // Update submission with severity score if available
    let normalizedSeverity = 0
    if (severity !== undefined) {
      // Map severity from 1-10 scale to 0-100 scale for consistency
      normalizedSeverity = Math.round((severity / 10) * 100)
      await updateSubmissionSeverity(submissionId, normalizedSeverity)
      console.log(`[generateAndSaveFeedback] Updated severity score for submission ${submissionId}: ${normalizedSeverity}`)
    }

    // Create roasts entry for leaderboard
    // Critical: This was missing and prevented new submissions from appearing on the leaderboard
    const roastEntry = await createRoast({
      submissionId,
      rankPosition: 1, // Will be updated by ranking algorithm if implemented
      severityRating: normalizedSeverity,
      criticalIssuesCount: issuesFound || 0,
      badges: [],
      lastRankedAt: new Date(),
    })
    console.log(`[generateAndSaveFeedback] Created roasts entry for submission ${submissionId}: ${roastEntry.id}`)
  } catch (error) {
    // Log error but don't throw - submission already created
    console.error(
      `[generateAndSaveFeedback] Failed to generate feedback for submission ${submissionId}:`,
      error
    )
  }
}
