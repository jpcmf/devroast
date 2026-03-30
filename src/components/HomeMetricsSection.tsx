import { serverTrpc } from '@/server/trpc/server'
import { AnimatedMetrics } from './HomeMetrics'

/**
 * Server component that fetches metrics and renders with animations
 * No Suspense boundary - metrics load as part of initial page render
 */
export async function HomeMetricsSection() {
	// Fetch both metrics on the server
	const [totalRoasts, { average }] = await Promise.all([
		serverTrpc.metrics.getTotalRoasts(),
		serverTrpc.metrics.getAverageScore(),
	])

	// Pass data directly to client component for animated display
	return <AnimatedMetrics totalRoasts={totalRoasts} averageScore={average} />
}
