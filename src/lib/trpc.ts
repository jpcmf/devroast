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
			// Optional: Add headers if needed
			headers() {
				return {
					"content-type": "application/json",
				};
			},
		}),
	],
});
