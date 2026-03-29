import { desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { type NewSubmission, type Submission, submissions } from "@/db/schema";

/**
 * Create a new code submission
 */
export async function createSubmission(data: NewSubmission): Promise<Submission> {
	const result = await db.insert(submissions).values(data).returning();
	return result[0];
}

/**
 * Get submission by ID
 */
export async function getSubmissionById(id: string): Promise<Submission | null> {
	const result = await db.select().from(submissions).where(eq(submissions.id, id));
	return result[0] || null;
}

/**
 * Get all submissions with optional sorting and pagination
 */
export async function getAllSubmissions(
	limit: number = 10,
	offset: number = 0,
	sortBy: "recent" | "views" | "severity" = "recent",
): Promise<Submission[]> {
	let orderByClause: any;

	// Apply sorting
	switch (sortBy) {
		case "views":
			orderByClause = desc(submissions.viewCount);
			break;
		case "severity":
			orderByClause = desc(submissions.severityScore);
			break;
		case "recent":
		default:
			orderByClause = desc(submissions.createdAt);
	}

	return db.select().from(submissions).orderBy(orderByClause).limit(limit).offset(offset);
}

/**
 * Get submissions by programming language
 */
export async function getSubmissionsByLanguage(
	language: string,
	limit: number = 10,
	offset: number = 0,
): Promise<Submission[]> {
	return db
		.select()
		.from(submissions)
		.where(eq(submissions.language, language as any))
		.orderBy(desc(submissions.createdAt))
		.limit(limit)
		.offset(offset);
}

/**
 * Update submission severity score
 */
export async function updateSubmissionSeverity(
	id: string,
	severityScore: number,
): Promise<Submission | null> {
	const result = await db
		.update(submissions)
		.set({
			severityScore,
			updatedAt: new Date(),
		})
		.where(eq(submissions.id, id))
		.returning();

	return result[0] || null;
}

/**
 * Increment submission view count
 */
export async function incrementViewCount(id: string): Promise<Submission | null> {
	const submission = await getSubmissionById(id);
	if (!submission) return null;

	const result = await db
		.update(submissions)
		.set({
			viewCount: (submission.viewCount || 0) + 1,
			updatedAt: new Date(),
		})
		.where(eq(submissions.id, id))
		.returning();

	return result[0] || null;
}

/**
 * Delete submission
 */
export async function deleteSubmission(id: string): Promise<boolean> {
	const result = await db.delete(submissions).where(eq(submissions.id, id)).returning();

	return result.length > 0;
}
