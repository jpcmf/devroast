"use client";

import { useEffect } from "react";

interface MetricsDisplayProps {
	totalRoasts: number;
	averageScore: number;
}

export function MetricsDisplay({ totalRoasts, averageScore }: MetricsDisplayProps) {
	useEffect(() => {
		// Register the NumberFlow custom element on client side
		import("number-flow").catch(() => {
			// Silently fail if number-flow doesn't load
		});
	}, []);

	return (
		<div className="space-y-6">
			<div>
				<p className="text-sm text-gray-400 font-jetbrains-mono mb-2">codes roasted</p>
				<div className="text-4xl font-bold text-emerald-500">{totalRoasts.toLocaleString()}</div>
			</div>
			<div>
				<p className="text-sm text-gray-400 font-jetbrains-mono mb-2">average severity</p>
				<div className="text-4xl font-bold text-emerald-500">{averageScore.toFixed(2)}</div>
			</div>
		</div>
	);
}
