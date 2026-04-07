/**
 * Gemini API Client for DevRoast
 * Handles AI-powered code feedback generation
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent'

export interface GenerateFeedbackOptions {
  code: string
  language: string
  roastMode: boolean
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string
      }>
    }
  }>
}

export interface FeedbackAnalysis {
  feedback: string
  severity?: number
  issuesFound: number
  recommendationsCount: number
}

/**
 * Builds a standard (professional) feedback prompt
 */
function buildStandardPrompt(code: string, language: string): string {
  return `You are an expert code reviewer. Analyze the following ${language} code and provide constructive, professional feedback.

Focus on:
1. Code quality and best practices
2. Potential bugs or performance issues
3. Readability and maintainability
4. Security concerns
5. Suggestions for improvement

Code:
\`\`\`${language}
${code}
\`\`\`

Provide a concise, helpful code review (2-3 paragraphs max).

Then, on a new line, add:
SEVERITY: [number 1-10]`
}

/**
 * Builds a roast mode (sarcastic and harsh) feedback prompt
 */
function buildRoastModePrompt(code: string, language: string): string {
  return `You are a brutally honest code reviewer with a sarcastic sense of humor. Your job is to roast bad code while still being somewhat helpful.

Analyze the following ${language} code and provide HARSH, SARCASTIC feedback:
- Don't hold back - be brutally critical
- Use sarcasm and dark humor generously
- Point out every mistake, inefficiency, and bad practice
- Be mean but not offensive to the person (mock the code, not them)
- End with a severity rating from 1-10 of how bad this code is

Code:
\`\`\`${language}
${code}
\`\`\`

Deliver a roasting (2-3 paragraphs). THEN on a new line, add:
SEVERITY: [number 1-10]`
}

/**
 * Generates AI feedback for submitted code using Google Gemini
 */
export async function generateFeedback({
  code,
  language,
  roastMode,
}: GenerateFeedbackOptions): Promise<FeedbackAnalysis> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set')
  }

  const prompt = roastMode
    ? buildRoastModePrompt(code, language)
    : buildStandardPrompt(code, language)

  try {
    console.log('[Gemini] Calling Gemini API for feedback generation...')
    
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    })

    console.log('[Gemini] Response status:', response.status)

    if (!response.ok) {
      const error = await response.json()
      console.error('[Gemini] API error response:', error)
      throw new Error(
        `Gemini API error: ${response.status} - ${error.error?.message || 'Unknown error'}`
      )
    }

    const data = (await response.json()) as GeminiResponse

    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      console.error('[Gemini] Invalid response structure:', data)
      throw new Error('Invalid response structure from Gemini API')
    }

    const fullText = data.candidates[0].content.parts[0].text
    console.log('[Gemini] Feedback generated successfully, length:', fullText.length)
    
    let feedback = fullText
    let severity: number | undefined
    let issuesFound = 0
    let recommendationsCount = 0

    // Extract severity from both standard and roast mode responses
    const severityMatch = fullText.match(/SEVERITY:\s*(\d+)/)
    if (severityMatch) {
      severity = Math.min(10, Math.max(1, parseInt(severityMatch[1], 10)))
      feedback = fullText.replace(/\nSEVERITY:\s*\d+\s*$/m, '').trim()
      console.log('[Gemini] Extracted severity:', severity)
    }

    // Count issues (lines starting with "issue:", "bug:", "problem:", etc.)
    const issueMatches = feedback.match(/(?:issue|bug|problem|error|concern|mistake|flaw|bad)[\s:]+/gi)
    issuesFound = issueMatches ? issueMatches.length : 0

    // Count recommendations (lines with "should", "recommend", "consider", "try", "use", "replace", etc.)
    const recommendMatches = feedback.match(/(?:should|recommend|consider|try|use|replace|instead|suggest)[\s:]+/gi)
    recommendationsCount = recommendMatches ? recommendMatches.length : 0

    // If no issues found but severity is high, set a minimum
    if (issuesFound === 0 && severity && severity >= 7) {
      issuesFound = Math.max(1, Math.ceil(severity / 3))
    }

    // If no recommendations but feedback is longer, infer some
    if (recommendationsCount === 0 && feedback.length > 100) {
      recommendationsCount = Math.max(1, Math.floor(feedback.length / 200))
    }

    console.log('[Gemini] Feedback analysis complete:', { issuesFound, recommendationsCount, severity })

    return {
      feedback,
      severity,
      issuesFound,
      recommendationsCount,
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('[Gemini] Error generating feedback:', error.message)
      throw new Error(`Failed to generate feedback: ${error.message}`)
    }
    console.error('[Gemini] Unknown error:', error)
    throw error
  }
}
