import { avg, count, sql, desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { roasts, submissions } from "@/db/schema";
import { publicProcedure, router } from "../init";
import { z } from "zod";

export const metricsRouter = router({
	getTotalRoasts: publicProcedure.query(async () => {
		const result = await db.select({ total: count() }).from(submissions);
		console.log('result', result[0]);
		

		return result[0]?.total ?? 0;
	}),

	getAverageScore: publicProcedure.query(async () => {
		const result = await db.select({ average: avg(roasts.severityRating) }).from(roasts);

		const avgValue = result[0]?.average ? Number(result[0].average) : 0;
		return {
			average: Math.round(avgValue * 100) / 100,
		};
	}),

	getLeaderboard: publicProcedure.query(async () => {
		// Fetch all roasted submissions with their data, ordered by severity rating (worst first)
		const results = await db
			.select({
				id: submissions.id,
				code: submissions.code,
				language: submissions.language,
				severityRating: roasts.severityRating,
				rankPosition: roasts.rankPosition,
			})
			.from(submissions)
			.innerJoin(roasts, sql`${submissions.id} = ${roasts.submissionId}`)
			.orderBy(desc(roasts.severityRating));

		// Add rank based on position in results
		return results.map((item, index) => ({
			id: item.id,
			rank: index + 1,
			score: String(item.severityRating),
			code: item.code,
			language: item.language,
		}));
	}),

	getSubmissionById: publicProcedure
		.input(z.string().uuid())
		.query(async ({ input: submissionId }) => {
			// Fetch submission with roast data
			const submissionData = await db
				.select({
					id: submissions.id,
					code: submissions.code,
					language: submissions.language,
					severityRating: roasts.severityRating,
				})
				.from(submissions)
				.leftJoin(roasts, sql`${submissions.id} = ${roasts.submissionId}`)
				.where(eq(submissions.id, submissionId));

			if (!submissionData || submissionData.length === 0) {
				return null;
			}

			const submission = submissionData[0];

			return {
				id: submission.id,
				code: submission.code,
				language: submission.language,
				score: String(submission.severityRating ?? 0),
			};
		}),
});
