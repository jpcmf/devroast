import { desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { type NewRoast, type Roast, roasts, submissions } from "@/db/schema";

/**
 * Create a new roast record (leaderboard entry)
 */
export async function createRoast(data: NewRoast): Promise<Roast> {
	const result = await db.insert(roasts).values(data).returning();
	return result[0];
}

/**
 * Get roast by ID
 */
export async function getRoastById(id: string): Promise<Roast | null> {
	const result = await db.select().from(roasts).where(eq(roasts.id, id));
	return result[0] || null;
}

/**
 * Get roast by submission ID
 */
export async function getRoastBySubmissionId(submissionId: string): Promise<Roast | null> {
	const result = await db.select().from(roasts).where(eq(roasts.submissionId, submissionId));
	return result[0] || null;
}

/**
 * Get top roasts (leaderboard) - ranked by severity
 */
export async function getTopRoasts(
	limit: number = 10,
	offset: number = 0,
): Promise<
	(Roast & {
		submission: {
			title: string | null;
			language: string;
			code: string;
			createdAt: Date;
		};
	})[]
> {
	const result = await db
		.select({
			id: roasts.id,
			submissionId: roasts.submissionId,
			rankPosition: roasts.rankPosition,
			severityRating: roasts.severityRating,
			criticalIssuesCount: roasts.criticalIssuesCount,
			badges: roasts.badges,
			lastRankedAt: roasts.lastRankedAt,
			createdAt: roasts.createdAt,
			updatedAt: roasts.updatedAt,
			submission: {
				title: submissions.title,
				language: submissions.language,
				code: submissions.code,
				createdAt: submissions.createdAt,
			},
		})
		.from(roasts)
		.leftJoin(submissions, eq(roasts.submissionId, submissions.id))
		.orderBy(desc(roasts.severityRating))
		.limit(limit)
		.offset(offset);

	return result as any;
}

/**
 * Update roast record
 */
export async function updateRoast(id: string, data: Partial<NewRoast>): Promise<Roast | null> {
	const result = await db
		.update(roasts)
		.set({
			...data,
			updatedAt: new Date(),
		})
		.where(eq(roasts.id, id))
		.returning();

	return result[0] || null;
}

/**
 * Update roast ranking position
 */
export async function updateRoastRanking(id: string, rankPosition: number): Promise<Roast | null> {
	return updateRoast(id, {
		rankPosition,
		lastRankedAt: new Date(),
	});
}

/**
 * Add badge to roast
 */
export async function addBadgeToRoast(id: string, badge: string): Promise<Roast | null> {
	const roast = await getRoastById(id);
	if (!roast) return null;

	const currentBadges = roast.badges || [];
	if (currentBadges.includes(badge)) return roast;

	return updateRoast(id, {
		badges: [...currentBadges, badge],
	});
}

/**
 * Remove badge from roast
 */
export async function removeBadgeFromRoast(id: string, badge: string): Promise<Roast | null> {
	const roast = await getRoastById(id);
	if (!roast) return null;

	const currentBadges = roast.badges || [];
	return updateRoast(id, {
		badges: currentBadges.filter((b) => b !== badge),
	});
}

/**
 * Delete roast
 */
export async function deleteRoast(id: string): Promise<boolean> {
	const result = await db.delete(roasts).where(eq(roasts.id, id)).returning();

	return result.length > 0;
}

/**
 * Delete roast by submission ID
 */
export async function deleteRoastBySubmissionId(submissionId: string): Promise<boolean> {
	const result = await db.delete(roasts).where(eq(roasts.submissionId, submissionId)).returning();

	return result.length > 0;
}

/**
 * Get average severity score
 */
export async function getAverageSeverityScore(): Promise<number> {
	const allRoasts = await db.select().from(roasts);
	if (allRoasts.length === 0) return 0;

	const sum = allRoasts.reduce((acc, roast) => acc + roast.severityRating, 0);
	return sum / allRoasts.length;
}

/**
 * Get total number of roasts
 */
export async function getTotalRoastCount(): Promise<number> {
	const result = await db.select().from(roasts);
	return result.length;
}
