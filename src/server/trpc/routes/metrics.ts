import { avg, count, sql, desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { roasts, submissions } from "@/db/schema";
import { publicProcedure, router } from "../init";
import { z } from "zod";

// Note: roasts table is still imported for other queries (getAverageScore, getLeaderboard)

export const metricsRouter = router({
	getTotalRoasts: publicProcedure.query(async () => {
		const result = await db.select({ total: count() }).from(roasts);

		return result[0]?.total ?? 0;
	}),

	getAverageScore: publicProcedure.query(async () => {
		const result = await db.select({ average: avg(roasts.severityRating) }).from(roasts);

		const avgValue = result[0]?.average ? Number(result[0].average) : 0;
		return {
			average: Math.round(avgValue * 100) / 100,
		};
	}),

	getLeaderboard: publicProcedure
		.input(
			z.object({
				page: z.number().int().positive().default(1),
				pageSize: z.number().int().positive().max(100).default(10),
			}),
		)
		.query(async ({ input: { page = 1, pageSize = 10 } }) => {
			const offset = (page - 1) * pageSize;

			// Fetch total count
			const totalResult = await db
				.select({ total: count() })
				.from(submissions)
				.innerJoin(roasts, sql`${submissions.id} = ${roasts.submissionId}`);

			const totalCount = totalResult[0]?.total ?? 0;

			// Fetch paginated roasted submissions with their data, ordered by severity rating (worst first)
			const results = await db
				.select({
					id: submissions.id,
					code: submissions.code,
					language: submissions.language,
					severityRating: roasts.severityRating,
					rankPosition: roasts.rankPosition,
					createdAt: submissions.createdAt,
				})
				.from(submissions)
				.innerJoin(roasts, sql`${submissions.id} = ${roasts.submissionId}`)
				.orderBy(desc(roasts.severityRating))
				.limit(pageSize)
				.offset(offset);

			// Add rank based on position in results
			const items = results.map((item, index) => ({
				id: item.id,
				rank: offset + index + 1,
				score: String(item.severityRating),
				code: item.code,
				language: item.language,
				createdAt: item.createdAt,
			}));

			const totalPages = Math.ceil(totalCount / pageSize);

			return {
				items,
				pagination: {
					page,
					pageSize,
					totalCount,
					totalPages,
				},
			};
		}),

	getSubmissionById: publicProcedure
		.input(z.string().uuid())
		.query(async ({ input: submissionId }) => {
			// Fetch submission from database
			const submissionData = await db
				.select({
					id: submissions.id,
					code: submissions.code,
					language: submissions.language,
					severityScore: submissions.severityScore,
					roastMode: submissions.roastMode,
					viewCount: submissions.viewCount,
				})
				.from(submissions)
				.where(eq(submissions.id, submissionId));

			if (!submissionData || submissionData.length === 0) {
				return null;
			}

			const submission = submissionData[0];

			return {
				id: submission.id,
				code: submission.code,
				language: submission.language,
				severityScore: submission.severityScore ?? 0,
				roastMode: submission.roastMode,
				viewCount: submission.viewCount,
			};
		}),
});
