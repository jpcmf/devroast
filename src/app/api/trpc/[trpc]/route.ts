/**
 * tRPC HTTP API Route Handler
 * Handles tRPC requests over HTTP (both GET and POST)
 */

import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/server/trpc/router'
import { createTRPCContext } from '@/server/trpc/init'

// Create the HTTP handler for tRPC
const handler = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  })
}

export { handler as GET, handler as POST }
