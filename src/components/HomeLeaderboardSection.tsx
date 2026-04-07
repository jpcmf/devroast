import Link from "next/link";
import { LeaderboardCodeBlock } from "@/components/ui";
import { serverTrpc } from "@/server/trpc/server";
import { Suspense } from "react";
import { HomeLeaderboardSkeleton } from "./HomeLeaderboardSkeleton";

/**
 * Server component that fetches leaderboard preview (top 3)
 */
async function HomeLeaderboardContent() {
	const leaderboardData = await serverTrpc.metrics.getLeaderboard({
		page: 1,
		pageSize: 3,
	});
	const totalCount = leaderboardData.pagination.totalCount;
	const items = leaderboardData.items;

	return (
		<>
			{/* Leaderboard Table Preview */}
			<div className="border border-gray-700 bg-gray-900 overflow-hidden">
				{/* Table Header */}
				<div className="flex items-center border-b border-gray-700 bg-gray-800 px-5 text-xs font-bold text-gray-400 font-jetbrains-mono h-10">
					<div className="w-12">#</div>
					<div className="w-[70px]">score</div>
					<div className="flex-1">code</div>
					<div className="w-[100px]">lang</div>
				</div>

				{/* Table Rows */}
				<div>
					{
						await Promise.all(
							items.map(async (item) => (
								<Link key={item.id} href={`/results/${item.id}`}>
									<div className="flex items-start gap-3 border-b border-gray-700 px-5 py-3 text-xs text-gray-400 font-jetbrains-mono hover:bg-gray-800 transition-colors cursor-pointer">
										{/* Rank */}
										<div className="w-12 font-bold text-gray-500 flex-shrink-0 pt-1">
											{item.rank}
										</div>

										{/* Score */}
										<div className="w-[70px] font-bold text-red-400 flex-shrink-0 pt-1">
											{item.score}
										</div>

										{/* Code with syntax highlighting and scroll - smaller for preview */}
										<div className="flex-1 min-w-0">
											<LeaderboardCodeBlock
												code={item.code}
												language={item.language}
												maxHeight="max-h-[80px]"
											/>
										</div>

										{/* Language */}
										<div className="w-[100px] text-gray-500 flex-shrink-0 pt-1">
											{item.language}
										</div>
									</div>
								</Link>
							)),
						)
					}
				</div>
			</div>

			{/* View More Hint */}
			<div className="flex items-center justify-center py-4 text-xs text-gray-600 font-jetbrains-mono">
				showing top 3 of {totalCount} ·{" "}
				<a href="/leaderboard" className="text-emerald-500 hover:text-emerald-400 ml-1">
					view full leaderboard &gt;&gt;
				</a>
			</div>
		</>
	);
}

/**
 * Public export with Suspense boundary
 * Shows skeleton while loading leaderboard preview
 */
export function HomeLeaderboardSection() {
	return (
		<div className="w-full max-w-3xl space-y-4" id="leaderboard">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-lg font-bold text-gray-100 font-jetbrains-mono">
						{`// `}
						<span className="text-emerald-500">shame leaderboard</span>
					</h2>
					<p className="text-xs text-gray-500 font-jetbrains-mono mt-2">
						{`// the worst code on the internet, ranked by shame`}
					</p>
				</div>
				<a
					href="/leaderboard"
					className="text-xs text-emerald-500 font-jetbrains-mono hover:text-emerald-400 transition-colors"
				>
					$ view_all &gt;&gt;
				</a>
			</div>

			<Suspense fallback={<HomeLeaderboardSkeleton />}>
				<HomeLeaderboardContent />
			</Suspense>
		</div>
	);
}
