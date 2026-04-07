import { getSubmissionById } from "@/data/submissions";
import { serverTrpc } from "@/server/trpc/server";
import { getLatestFeedbackBySubmissionId } from "@/db/queries/feedback";
import { incrementViewCount } from "@/db/queries/submissions";
import { notFound } from "next/navigation";
import ResultsContent from "./ResultsContent";
import { CodeBlock } from "@/components/ui/CodeBlock";

interface ResultsPageProps {
	params: Promise<{
		id: string;
	}>;
}

/**
 * Extract severity breakdown from AI feedback
 * Uses the severity score and feedback content to estimate critical/warning/good issues
 */
function extractSeverityBreakdown(
	aiFeedback: any,
	severityScore?: number
): { critical: number; warning: number; good: number } {
	if (!aiFeedback) {
		return { critical: 0, warning: 0, good: 0 };
	}

	const content = aiFeedback.content || "";
	const severity = severityScore ?? 0;

	// Count critical issues - high severity (8-10)
	// Use issuesFound as base, adjusted by severity
	const critical = Math.max(
		Math.floor((severity / 100) * 10 * 0.4), // 40% of issues are critical at high severity
		Math.min(aiFeedback.issuesFound ?? 0, 5) // Cap at 5
	);

	// Count warnings - medium severity (4-7)
	// Estimate from recommendations and issue count
	const warning = Math.max(
		Math.floor((aiFeedback.recommendationsCount ?? 0) * 0.6), // 60% of recommendations are warnings
		Math.floor(severity / 20) // Rough estimate based on severity
	);

	// Count good practices - positive notes
	// Estimate as a fraction of feedback length (longer = more potential positives)
	const contentLength = content.length;
	const good = Math.max(
		Math.ceil(contentLength / 500), // ~1 good practice per 500 chars
		severity <= 30 ? 3 : severity <= 60 ? 1 : 0 // More positives for lower severity
	);

	return {
		critical: Math.min(critical, 10),
		warning: Math.min(warning, 10),
		good: Math.min(good, 5),
	};
}

export default async function ResultsPage({ params }: ResultsPageProps) {
	const { id } = await params;
	console.log('[Results Page] Loading submission ID:', id);

	// Try to fetch from database first
	const dbSubmission = await serverTrpc.metrics.getSubmissionById(id);
	console.log('[Results Page] Database submission:', dbSubmission);

	// Fall back to mock data if not found in database
	const mockSubmission = getSubmissionById(id);
	console.log('[Results Page] Mock submission:', mockSubmission);

	const submission = dbSubmission || mockSubmission;

	if (!submission) {
		console.log('[Results Page] Submission not found, returning 404');
		notFound();
	}

	// Increment view count if submission exists in DB
	if (dbSubmission) {
		try {
			await incrementViewCount(id);
			console.log('[Results Page] View count incremented for submission:', id);
		} catch (error) {
			console.error('[Results Page] Error incrementing view count:', error);
		}
	}

	// Fetch AI feedback from database if submission exists in DB
	let aiFeedback = null;
	if (dbSubmission) {
		console.log('[Results Page] Fetching AI feedback for submission:', id);
		try {
			aiFeedback = await getLatestFeedbackBySubmissionId(id);
			console.log('[Results Page] AI Feedback retrieved:', aiFeedback);
		} catch (error) {
			console.error('[Results Page] Error fetching feedback:', error);
		}
	} else {
		console.log('[Results Page] Using mock submission, skipping feedback fetch');
	}

	// Calculate shame score: use severityScore for DB, score for mock
	let shameScore: string | number;
	let severityScore = 0;
	if ('severityScore' in submission) {
		// Database submission: convert 0-100 to 1-10 scale
		severityScore = (submission as any).severityScore ?? 0;
		shameScore = Math.round((severityScore / 100) * 10 * 10) / 10;
	} else {
		// Mock submission: use score as-is
		shameScore = (submission as any).score;
	}

	// Calculate roast summary from AI feedback or mock data
	let roastSummary: { critical: number; warning: number; good: number };
	if ("roastFeedback" in submission) {
		// Mock submission with roastFeedback array
		roastSummary = {
			critical: submission.roastFeedback.filter((f: any) => f.severity === "critical").length,
			warning: submission.roastFeedback.filter((f: any) => f.severity === "warning").length,
			good: submission.roastFeedback.filter((f: any) => f.severity === "good").length,
		};
	} else if (aiFeedback) {
		// Database submission with AI feedback
		roastSummary = extractSeverityBreakdown(aiFeedback, severityScore);
	} else {
		// No feedback available yet
		roastSummary = { critical: 0, warning: 0, good: 0 };
	}

	// Render CodeBlock on server side
	const codeBlock = (
		<CodeBlock 
			code={(submission as any).code} 
			language={(submission as any).language} 
		/>
	);

	return (
		<ResultsContent
			id={id}
			submission={submission}
			dbSubmission={dbSubmission}
			aiFeedback={aiFeedback}
			shameScore={shameScore}
			severityScore={severityScore}
			roastSummary={roastSummary}
			codeBlock={codeBlock}
		/>
	);
}
