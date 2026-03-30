import { serverTrpc } from "@/server/trpc/server";
import { LeaderboardTable } from "./LeaderboardTable";

/**
 * Server component that fetches leaderboard data from tRPC
 * Used within Suspense boundary in the leaderboard page
 */
export async function LeaderboardContent() {
	const items = await serverTrpc.metrics.getLeaderboard();
	const totalCount = items.length;

	return <LeaderboardTable items={items} totalCount={totalCount} />;
}
