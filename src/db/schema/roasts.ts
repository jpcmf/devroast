import { integer, pgTable, text as pgText, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { badgeEnum, submissions } from "./submissions";

// Roasts table (Leaderboard)
export const roasts = pgTable("roasts", {
	id: uuid("id").primaryKey().defaultRandom(),
	submissionId: uuid("submission_id")
		.notNull()
		.unique()
		.references(() => submissions.id, { onDelete: "cascade" }),
	rankPosition: integer("rank_position"),
	severityRating: integer("severity_rating").notNull(),
	criticalIssuesCount: integer("critical_issues_count").default(0),
	badges: pgText("badges").array().default([]),
	lastRankedAt: timestamp("last_ranked_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Roast = typeof roasts.$inferSelect;
export type NewRoast = typeof roasts.$inferInsert;
