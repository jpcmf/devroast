"use client";

import { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";

/**
 * Client component that displays metrics with animated number transitions
 * Uses @number-flow/react to animate from 0 to the actual values
 */
export function AnimatedMetrics({
	totalRoasts,
	averageScore,
}: {
	totalRoasts: number;
	averageScore: number;
}) {
	// Start with 0 values, then animate to actual values on mount
	const [displayTotalRoasts, setDisplayTotalRoasts] = useState(0);
	const [displayAverageScore, setDisplayAverageScore] = useState(0);

	useEffect(() => {
		// Small delay to ensure component is mounted and animation can trigger
		const timer = setTimeout(() => {
			setDisplayTotalRoasts(totalRoasts);
			setDisplayAverageScore(averageScore);
		}, 100);

		return () => clearTimeout(timer);
	}, [totalRoasts, averageScore]);

	return (
		<div className="flex items-center justify-center gap-6 text-xs text-gray-500 font-jetbrains-mono">
			<span>
				<NumberFlow
					value={displayTotalRoasts}
					format={{ notation: "standard", useGrouping: true }}
					transformTiming={{ duration: 1000, easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
					spinTiming={{ duration: 1000, easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
				/>
				{" codes roasted"}
			</span>
			<span>·</span>
			<span>
				avg score:{" "}
				<NumberFlow
					value={displayAverageScore}
					format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
					transformTiming={{ duration: 1000, easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
					spinTiming={{ duration: 1000, easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
				/>
				/10
			</span>
		</div>
	);
}
