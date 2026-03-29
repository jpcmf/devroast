import { avg, count, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { roasts, submissions } from "@/db/schema";
import { publicProcedure, router } from "../init";

export const metricsRouter = router({
	getTotalRoasts: publicProcedure.query(async () => {
		const result = await db.select({ total: count() }).from(submissions);

		return result[0]?.total ?? 0;
	}),

	getAverageScore: publicProcedure.query(async () => {
		const result = await db.select({ average: avg(roasts.severityRating) }).from(roasts);

		const avgValue = result[0]?.average ? Number(result[0].average) : 0;
		return {
			average: Math.round(avgValue * 100) / 100,
		};
	}),
});
