import { Suspense } from "react";
import { serverTrpc } from "@/server/trpc/server";
import { MetricsDisplay } from "./metrics-display";
import { MetricsSkeleton } from "./ui/MetricsSkeleton";

async function MetricsContent() {
	const [totalRoastsData, averageScoreData] = await Promise.all([
		serverTrpc.metrics.getTotalRoasts(),
		serverTrpc.metrics.getAverageScore(),
	]);

	return <MetricsDisplay totalRoasts={totalRoastsData} averageScore={averageScoreData.average} />;
}

export function MetricsSection() {
	return (
		<Suspense fallback={<MetricsSkeleton />}>
			<MetricsContent />
		</Suspense>
	);
}
