"use client";

/**
 * Skeleton loading state for metrics display
 * Shows animated placeholder while metrics load from tRPC
 */
export function MetricsSkeleton() {
	return (
		<div className="flex items-center justify-center gap-6 text-xs text-gray-500 font-jetbrains-mono">
			{/* Total codes skeleton */}
			<div className="h-4 w-20 bg-gray-700 rounded animate-pulse" />

			{/* Separator */}
			<span>·</span>

			{/* Average score skeleton */}
			<div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
		</div>
	);
}
