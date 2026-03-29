import { router } from "./init";
import { metricsRouter } from "./routes/metrics";

export const appRouter = router({
	metrics: metricsRouter,
});

export type AppRouter = typeof appRouter;
