import { Button } from "@/components";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { getSubmissionById } from "@/data/submissions";
import { serverTrpc } from "@/server/trpc/server";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ResultsPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function ResultsPage({ params }: ResultsPageProps) {
	const { id } = await params;

	// Try to fetch from database first
	const dbSubmission = await serverTrpc.metrics.getSubmissionById(id);

	// Fall back to mock data if not found in database
	const mockSubmission = getSubmissionById(id);

	const submission = dbSubmission || mockSubmission;

	if (!submission) {
		notFound();
	}

	const roastSummary =
		"roastFeedback" in submission
			? {
					critical: submission.roastFeedback.filter((f) => f.severity === "critical").length,
					warning: submission.roastFeedback.filter((f) => f.severity === "warning").length,
					good: submission.roastFeedback.filter((f) => f.severity === "good").length,
				}
			: {
					critical: 0,
					warning: 0,
					good: 0,
				};

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

					{/* Score Card */}
					<div className="flex items-center gap-6 border border-gray-700 bg-gray-900 rounded-lg p-6">
						<div className="flex-1">
							<p className="text-xs text-gray-500 font-jetbrains-mono uppercase tracking-wider">
								shame score
							</p>
							<p className="text-5xl font-bold text-red-400 font-jetbrains-mono mt-2">
								{submission.score}
								<span className="text-2xl text-gray-500">/10</span>
							</p>
						</div>
						<div className="bg-gray-700" style={{ width: "1px", height: "80px" }} />
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

					<div className="border border-gray-700 bg-gray-900 rounded-lg overflow-hidden">
						<CodeBlock code={submission.code} language={submission.language} />
					</div>
				</div>

				{/* Feedback Section */}
				{"roastFeedback" in submission && (
					<div className="w-full max-w-3xl space-y-4">
						<h2 className="text-lg font-bold text-gray-100 font-jetbrains-mono">
							{`// `}
							<span className="text-emerald-500">the roast</span>
						</h2>

						<div className="space-y-3">
							{submission.roastFeedback.map((feedback) => (
								<div
									key={feedback.line}
									className="border border-gray-700 bg-gray-900 rounded-lg p-4"
								>
									<div className="flex items-start gap-3">
										{/* Severity Indicator */}
										<div className="flex-shrink-0 pt-1">
											{feedback.severity === "critical" && (
												<div className="w-3 h-3 rounded-full bg-red-500" />
											)}
											{feedback.severity === "warning" && (
												<div className="w-3 h-3 rounded-full bg-amber-500" />
											)}
											{feedback.severity === "good" && (
												<div className="w-3 h-3 rounded-full bg-emerald-500" />
											)}
										</div>

										{/* Feedback Content */}
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-2">
												<span className="text-xs font-bold text-gray-400 font-jetbrains-mono uppercase tracking-wider">
													{feedback.severity === "critical"
														? "🚨 critical"
														: feedback.severity === "warning"
															? "⚠️ warning"
															: "✨ good"}
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
	);
}
