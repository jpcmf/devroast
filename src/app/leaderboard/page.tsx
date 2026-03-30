import { Button } from "@/components";
import Link from "next/link";
import { Suspense } from "react";
import { LeaderboardContent } from "@/components/LeaderboardContent";
import { LeaderboardSkeleton } from "@/components/LeaderboardSkeleton";
import { serverTrpc } from "@/server/trpc/server";

export default async function LeaderboardPage() {
	// Fetch stats on the server
	const [totalRoasts, { average }] = await Promise.all([
		serverTrpc.metrics.getTotalRoasts(),
		serverTrpc.metrics.getAverageScore(),
	]);

	return (
		<div className="min-h-screen">
			{/* Main Content */}
			<main className="flex flex-col items-center gap-8 px-10 py-20">
				{/* Header Section */}
				<div className="w-full max-w-3xl space-y-6">
					<div className="space-y-3">
						<h1 className="text-4xl font-bold text-gray-100 font-jetbrains-mono">
							<span className="text-emerald-500">{`$ `}</span>
							shame leaderboard
						</h1>
						<p className="text-sm text-gray-400 font-jetbrains-mono">
							{`// the worst code on the internet, ranked by shame`}
						</p>
					</div>

					{/* Stats */}
					<div className="flex items-center justify-between text-xs text-gray-500 font-jetbrains-mono border-l-2 border-emerald-500 pl-4">
						<span>total submissions: {totalRoasts}</span>
						<span>avg score: {average}/10</span>
					</div>
				</div>

				{/* Leaderboard Table with Suspense */}
				<div className="w-full max-w-3xl">
					<Suspense fallback={<LeaderboardSkeleton />}>
						<LeaderboardContent />
					</Suspense>
				</div>

				{/* CTA Section */}
				<div className="w-full max-w-3xl flex flex-col items-center gap-6">
					<div className="text-center space-y-2">
						<p className="text-sm text-gray-400 font-jetbrains-mono">
							see your code here? submit your worst code for review
						</p>
					</div>
					<Link href="/">
						<Button variant="primary" size="md">
							{`$ submit_my_code`}
						</Button>
					</Link>
				</div>

				{/* Bottom Padding */}
				<div className="h-12" />
			</main>
		</div>
	);
}
