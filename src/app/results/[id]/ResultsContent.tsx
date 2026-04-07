'use client'

import { useEffect, useState, ReactNode } from 'react'
import { Button } from '@/components'
import Link from 'next/link'
import { ScoreCardSkeleton } from '@/components/ScoreCardSkeleton'
import { extractSeverityBreakdown } from '@/lib/severity'

interface ResultsContentProps {
	id: string
	submission: any
	dbSubmission: any
	aiFeedback: any
	shameScore: string | number
	severityScore?: number
	roastSummary: {
		critical: number
		warning: number
		good: number
	}
	codeBlock: ReactNode
}

export default function ResultsContent({
	id,
	submission,
	dbSubmission,
	aiFeedback: initialFeedback,
	shameScore: initialShameScore,
	severityScore: initialSeverityScore,
	roastSummary: initialRoastSummary,
	codeBlock,
}: ResultsContentProps) {
	const [aiFeedback, setAiFeedback] = useState(initialFeedback)
	const [isLoading, setIsLoading] = useState(!initialFeedback && !!dbSubmission)
	const [error, setError] = useState<string | null>(null)
	
	// Real-time state for score card - updates when feedback arrives
	const [shameScore, setShameScore] = useState(initialShameScore)
	const [severityScore, setSeverityScore] = useState(initialSeverityScore ?? 0)
	const [roastSummary, setRoastSummary] = useState(initialRoastSummary)

	useEffect(() => {
		if (!dbSubmission || aiFeedback) {
			return // Don't poll if already have feedback or not a DB submission
		}

		console.log('[ResultsContent] Starting to poll for feedback, submission ID:', id)

		let pollCount = 0
		const MAX_POLLS = 90 // 90 polls × 2 seconds = 180 seconds (3 minutes) 
		const POLL_INTERVAL = 2000 // 2 seconds

		const pollInterval = setInterval(async () => {
			pollCount++
			try {
				const response = await fetch(`/api/feedback/${id}`, {
					signal: AbortSignal.timeout(5000), // 5-second fetch timeout
				})
				if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch feedback`)

				const feedback = await response.json()
				if (feedback) {
					console.log('[ResultsContent] Feedback received:', feedback)
					setAiFeedback(feedback)
					setIsLoading(false)
					setError(null)
					
					// Update score card in real-time with new values
					// Calculate shame score from severity (0-100 to 1-10 scale)
					const newSeverityScore = (submission as any).severityScore ?? 0
					setSeverityScore(newSeverityScore)
					setShameScore(Math.round((newSeverityScore / 100) * 10 * 10) / 10)
					
					// Calculate roast summary from feedback
					setRoastSummary(extractSeverityBreakdown(feedback, newSeverityScore))
				} else {
					console.log(`[ResultsContent] Feedback not yet available (poll ${pollCount}/${MAX_POLLS}), polling again...`)
				}
			} catch (err) {
				// Log but don't stop polling on fetch errors - the backend might be temporarily unavailable
				console.error(`[ResultsContent] Error polling for feedback (poll ${pollCount}):`, err)
				// Only set error if it's a persistent network issue (not after just a few attempts)
				if (pollCount > 10) {
					setError(`Feedback generation in progress... (attempt ${pollCount})`)
				}
			}
		}, POLL_INTERVAL)

		// Stop polling after max attempts
		const timeout = setTimeout(() => {
			clearInterval(pollInterval)
			if (!aiFeedback) {
				console.log(`[ResultsContent] Max polling attempts reached (${MAX_POLLS}), no feedback received`)
				setIsLoading(false)
				setError('Feedback generation took too long. The AI service may be temporarily unavailable. Please try again in a few moments.')
			}
		}, MAX_POLLS * POLL_INTERVAL)

		return () => {
			clearInterval(pollInterval)
			clearTimeout(timeout)
		}
	}, [id, aiFeedback, dbSubmission, submission])

	return (
		<div className="min-h-screen">
			{/* Main Content */}
			<main className="flex flex-col items-center gap-8 px-10 py-20">
				{/* Header Section */}
				<div className="w-full max-w-3xl space-y-6">
					{/* Title */}
					<div className="space-y-3">
						<h1 className="text-4xl font-bold text-gray-100 font-jetbrains-mono">
							<span className="text-emerald-500">{`$ `}</span>
							your roast results
						</h1>
						<p className="text-sm text-gray-400 font-jetbrains-mono">
							{`// here's what we think of your code`}
						</p>
					</div>

					{/* Score Card - Shows skeleton while loading, real values when feedback arrives */}
					{isLoading && !aiFeedback ? (
						<ScoreCardSkeleton />
					) : (
						<div className="flex items-center gap-6 border border-gray-700 bg-gray-900 rounded-lg p-6">
							<div className="flex-1">
								<p className="text-xs text-gray-500 font-jetbrains-mono uppercase tracking-wider">
									shame score
								</p>
								<p className="text-5xl font-bold text-red-400 font-jetbrains-mono mt-2">
									{shameScore}
									<span className="text-2xl text-gray-500">/10</span>
								</p>
							</div>
							<div className="bg-gray-700" style={{ width: '1px', height: '80px' }} />
							<div className="space-y-3 text-xs font-jetbrains-mono">
								<div className="flex items-center gap-2">
									<div className="w-3 h-3 rounded-full bg-red-500" />
									<span className="text-gray-400">{roastSummary.critical} critical issues</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="w-3 h-3 rounded-full bg-amber-500" />
									<span className="text-gray-400">{roastSummary.warning} warnings</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="w-3 h-3 rounded-full bg-emerald-500" />
									<span className="text-gray-400">{roastSummary.good} good practices</span>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Code Section */}
				<div className="w-full max-w-3xl space-y-4">
					<div className="space-y-2">
						<h2 className="text-lg font-bold text-gray-100 font-jetbrains-mono">
							{`// `}
							<span className="text-emerald-500">submitted code</span>
						</h2>
						<p className="text-xs text-gray-500 font-jetbrains-mono">
							Language: {submission.language}
						</p>
					</div>

					{codeBlock}
				</div>

				{/* AI Feedback Section */}
				{aiFeedback ? (
					<div className="w-full max-w-3xl space-y-4">
						<div className="space-y-2">
							<h2 className="text-lg font-bold text-gray-100 font-jetbrains-mono">
								{`// `}
								<span className="text-emerald-500">detailed_analysis</span>
							</h2>
							{(aiFeedback.issuesFound ?? 0) > 0 && (
								<p className="text-xs text-gray-500 font-jetbrains-mono">
									{aiFeedback.issuesFound ?? 0} issue{(aiFeedback.issuesFound ?? 0) !== 1 ? 's' : ''} found • {aiFeedback.recommendationsCount ?? 0} recommendation{(aiFeedback.recommendationsCount ?? 0) !== 1 ? 's' : ''}
								</p>
							)}
						</div>

						<div className="border border-gray-700 bg-gray-900 rounded-lg p-6 space-y-4">
							<div className="prose prose-invert max-w-none">
								<p className="text-sm text-gray-300 whitespace-pre-wrap font-jetbrains-mono leading-relaxed">
									{aiFeedback.content}
								</p>
							</div>
						</div>
					</div>
				) : isLoading ? (
					<div className="w-full max-w-3xl">
						<div className="border border-gray-700 bg-gray-900 rounded-lg p-6 text-center space-y-4">
							<div className="space-y-2">
								<p className="text-sm text-gray-300 font-jetbrains-mono">
									{`// `}
									<span className="text-emerald-500">generating your roast...</span>
								</p>
								<div className="flex items-center justify-center gap-2">
									<div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
									<p className="text-xs text-gray-500 font-jetbrains-mono">
										our AI is analyzing your code
									</p>
									<div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
								</div>
							</div>
						</div>
					</div>
				) : error ? (
					<div className="w-full max-w-3xl">
						<div className="border border-red-700 bg-gray-900 rounded-lg p-6 text-center space-y-4">
							<p className="text-sm text-red-400 font-jetbrains-mono">
								{`// error: ${error}`}
							</p>
							<button
								onClick={() => window.location.reload()}
								className="inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-jetbrains-mono rounded transition-colors"
							>
								retry
							</button>
						</div>
					</div>
				) : null}

				{/* Legacy Feedback Section (for mock data) */}
				{'roastFeedback' in submission && (
					<div className="w-full max-w-3xl space-y-4">
						<h2 className="text-lg font-bold text-gray-100 font-jetbrains-mono">
							{`// `}
							<span className="text-emerald-500">the roast</span>
						</h2>

						<div className="space-y-3">
							{submission.roastFeedback.map((feedback: any) => (
								<div
									key={feedback.line}
									className="border border-gray-700 bg-gray-900 rounded-lg p-4"
								>
									<div className="flex items-start gap-3">
										{/* Severity Indicator */}
										<div className="flex-shrink-0 pt-1">
											{feedback.severity === 'critical' && (
												<div className="w-3 h-3 rounded-full bg-red-500" />
											)}
											{feedback.severity === 'warning' && (
												<div className="w-3 h-3 rounded-full bg-amber-500" />
											)}
											{feedback.severity === 'good' && (
												<div className="w-3 h-3 rounded-full bg-emerald-500" />
											)}
										</div>

										{/* Feedback Content */}
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-2">
												<span className="text-xs font-bold text-gray-400 font-jetbrains-mono uppercase tracking-wider">
													{feedback.severity === 'critical'
														? '🚨 critical'
														: feedback.severity === 'warning'
															? '⚠️ warning'
															: '✨ good'}
												</span>
												<span className="text-xs text-gray-600 font-jetbrains-mono">
													line {feedback.line}
												</span>
											</div>

											<p className="text-sm text-gray-300 mb-2">{feedback.message}</p>

											<div className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-gray-400 font-jetbrains-mono">
												<span className="text-emerald-500">{`→ `}</span>
												{feedback.suggestion}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Actions */}
				<div className="w-full max-w-3xl flex flex-col sm:flex-row items-center gap-4 justify-center">
					<Link href="/leaderboard">
						<Button variant="secondary" size="md">
							{`$ back_to_leaderboard`}
						</Button>
					</Link>
					<Link href="/">
						<Button variant="primary" size="md">
							{`$ submit_your_code`}
						</Button>
					</Link>
				</div>

				{/* Bottom Padding */}
				<div className="h-12" />
			</main>
		</div>
	)
}
