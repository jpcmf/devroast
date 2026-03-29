interface MetricsSkeletonProps {
	className?: string;
}

export function MetricsSkeleton({ className = "" }: MetricsSkeletonProps) {
	return (
		<div className={`space-y-6 ${className}`}>
			<div className="space-y-2">
				<div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
				<div className="h-10 w-24 bg-gray-700 rounded animate-pulse" />
			</div>
			<div className="space-y-2">
				<div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
				<div className="h-10 w-24 bg-gray-700 rounded animate-pulse" />
			</div>
		</div>
	);
}
