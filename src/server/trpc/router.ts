import { router } from "./init";
import { metricsRouter } from "./routes/metrics";
import { submissionsRouter } from "./routes/submissions";

export const appRouter = router({
	metrics: metricsRouter,
	submissions: submissionsRouter,
});

export type AppRouter = typeof appRouter;
