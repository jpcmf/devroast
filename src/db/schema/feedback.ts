import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { feedbackTypeEnum, submissions } from "./submissions";

// Feedback table
export const feedback = pgTable("feedback", {
	id: uuid("id").primaryKey().defaultRandom(),
	submissionId: uuid("submission_id")
		.notNull()
		.references(() => submissions.id, { onDelete: "cascade" }),
	feedbackType: feedbackTypeEnum("feedback_type").notNull(),
	content: text("content").notNull(),
	issuesFound: integer("issues_found").default(0),
	recommendationsCount: integer("recommendations_count").default(0),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Feedback = typeof feedback.$inferSelect;
export type NewFeedback = typeof feedback.$inferInsert;
