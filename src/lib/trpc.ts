import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/server/trpc/router";

/**
 * Client-side tRPC client for making RPC calls to the backend
 * Configured to use POST requests with httpBatchLink
 */
export const trpc = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: "/api/trpc",
			// Force POST for all requests (avoids URL length issues with GET)
			methodOverride: "POST",
		}),
	],
});
