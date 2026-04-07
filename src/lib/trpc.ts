import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/server/trpc/router";

/**
 * Client-side tRPC client for making RPC calls to the backend
 * Uses httpBatchLink which automatically uses GET for queries and POST for mutations
 */
export const trpc = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: "/api/trpc",
		}),
	],
});
