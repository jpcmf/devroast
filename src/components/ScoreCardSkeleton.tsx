"use client";

/**
 * Skeleton loading state for score card
 * Shows animated placeholder while AI feedback is being generated
 */
export function ScoreCardSkeleton() {
	return (
		<div className="flex items-center gap-6 border border-gray-700 bg-gray-900 rounded-lg p-6">
			{/* Shame Score Skeleton */}
			<div className="flex-1">
				<p className="text-xs text-gray-500 font-jetbrains-mono uppercase tracking-wider">
					shame score
				</p>
				<div className="mt-2 space-y-2">
					{/* Large score number skeleton */}
					<div className="h-12 w-32 bg-gray-700 rounded animate-pulse" />
					{/* Smaller "/10" text skeleton */}
					<div className="h-6 w-16 bg-gray-700 rounded animate-pulse" />
				</div>
			</div>

			{/* Divider */}
			<div className="bg-gray-700" style={{ width: "1px", height: "80px" }} />

			{/* Roast Summary Skeleton */}
			<div className="space-y-3 text-xs font-jetbrains-mono">
				{/* Critical issues skeleton */}
				<div className="flex items-center gap-2">
					<div className="w-3 h-3 rounded-full bg-gray-700 animate-pulse" />
					<div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
				</div>

				{/* Warnings skeleton */}
				<div className="flex items-center gap-2">
					<div className="w-3 h-3 rounded-full bg-gray-700 animate-pulse" />
					<div className="h-4 w-28 bg-gray-700 rounded animate-pulse" />
				</div>

				{/* Good practices skeleton */}
				<div className="flex items-center gap-2">
					<div className="w-3 h-3 rounded-full bg-gray-700 animate-pulse" />
					<div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
				</div>
			</div>
		</div>
	);
}
