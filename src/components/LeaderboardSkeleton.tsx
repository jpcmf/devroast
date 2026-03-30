"use client";

/**
 * Skeleton loading state for leaderboard table
 * Shows animated placeholder rows while leaderboard loads from tRPC
 */
export function LeaderboardSkeleton() {
	return (
		<div className="border border-gray-700 bg-gray-900 overflow-hidden rounded-lg">
			{/* Table Header */}
			<div className="flex items-center border-b border-gray-700 bg-gray-800 px-5 text-xs font-bold text-gray-400 font-jetbrains-mono h-10">
				<div className="w-12">#</div>
				<div className="w-[70px]">score</div>
				<div className="flex-1">code</div>
				<div className="w-[100px]">lang</div>
			</div>

			{/* Skeleton Rows */}
			<div>
				{[...Array(10)].map((_, index) => (
					<div
						key={index}
						className="flex items-center border-b border-gray-700 px-5 text-xs text-gray-400 font-jetbrains-mono h-12"
					>
						<div className="w-12">
							<div className="h-4 w-6 bg-gray-700 rounded animate-pulse" />
						</div>
						<div className="w-[70px]">
							<div className="h-4 w-10 bg-gray-700 rounded animate-pulse" />
						</div>
						<div className="flex-1">
							<div className="h-4 w-96 bg-gray-700 rounded animate-pulse" />
						</div>
						<div className="w-[100px]">
							<div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
