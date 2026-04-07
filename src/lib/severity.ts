/**
 * Utility function to extract severity breakdown from AI feedback
 * Uses the severity score and feedback content to estimate critical/warning/good issues
 */
export function extractSeverityBreakdown(
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
