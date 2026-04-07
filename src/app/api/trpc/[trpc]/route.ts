/**
 * tRPC HTTP API Route Handler
 * Handles tRPC requests over HTTP (POST for mutations/procedures)
 */

import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/server/trpc/router'
import { createTRPCContext } from '@/server/trpc/init'

// Create the HTTP handler for tRPC
const handler = async (req: Request) => {
  // Extract the procedure path from URL
  // Format: /api/trpc/[procedurePath]
  const url = new URL(req.url)
  const pathname = url.pathname

  // Remove /api/trpc prefix to get the procedure path
  const procedurePath = pathname.replace('/api/trpc/', '')

  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  })
}

export { handler as POST }
