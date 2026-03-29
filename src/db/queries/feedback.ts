import { desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { type Feedback, feedback, type NewFeedback } from "@/db/schema";

/**
 * Create new feedback for a submission
 */
export async function createFeedback(data: NewFeedback): Promise<Feedback> {
	const result = await db.insert(feedback).values(data).returning();
	return result[0];
}

/**
 * Get feedback by ID
 */
export async function getFeedbackById(id: string): Promise<Feedback | null> {
	const result = await db.select().from(feedback).where(eq(feedback.id, id));
	return result[0] || null;
}

/**
 * Get all feedback for a submission
 */
export async function getFeedbackBySubmissionId(submissionId: string): Promise<Feedback[]> {
	return db
		.select()
		.from(feedback)
		.where(eq(feedback.submissionId, submissionId))
		.orderBy(desc(feedback.createdAt));
}

/**
 * Get latest feedback for a submission
 */
export async function getLatestFeedbackBySubmissionId(
	submissionId: string,
): Promise<Feedback | null> {
	const result = await db
		.select()
		.from(feedback)
		.where(eq(feedback.submissionId, submissionId))
		.orderBy(desc(feedback.createdAt))
		.limit(1);

	return result[0] || null;
}

/**
 * Get feedback by type
 */
export async function getFeedbackByType(
	feedbackType: string,
	limit: number = 10,
	offset: number = 0,
): Promise<Feedback[]> {
	return db
		.select()
		.from(feedback)
		.where(eq(feedback.feedbackType, feedbackType as any))
		.orderBy(desc(feedback.createdAt))
		.limit(limit)
		.offset(offset);
}

/**
 * Update feedback
 */
export async function updateFeedback(
	id: string,
	data: Partial<NewFeedback>,
): Promise<Feedback | null> {
	const result = await db
		.update(feedback)
		.set({
			...data,
			updatedAt: new Date(),
		})
		.where(eq(feedback.id, id))
		.returning();

	return result[0] || null;
}

/**
 * Delete feedback
 */
export async function deleteFeedback(id: string): Promise<boolean> {
	const result = await db.delete(feedback).where(eq(feedback.id, id)).returning();

	return result.length > 0;
}

/**
 * Delete all feedback for a submission
 */
export async function deleteFeedbackBySubmissionId(submissionId: string): Promise<number> {
	const result = await db
		.delete(feedback)
		.where(eq(feedback.submissionId, submissionId))
		.returning();

	return result.length;
}
