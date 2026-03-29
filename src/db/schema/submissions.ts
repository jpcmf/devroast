import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Enum definitions
export const programmingLanguageEnum = pgEnum("programming_language", [
	"javascript",
	"typescript",
	"python",
	"rust",
	"golang",
	"java",
	"csharp",
	"php",
	"ruby",
	"kotlin",
	"sql",
	"html",
	"css",
	"json",
	"yaml",
	"bash",
	"other",
]);

export const feedbackTypeEnum = pgEnum("feedback_type", ["roast", "standard", "review"]);

export const severityLevelEnum = pgEnum("severity_level", [
	"critical",
	"high",
	"medium",
	"low",
	"minimal",
]);

export const issueCategoryEnum = pgEnum("issue_category", [
	"naming",
	"performance",
	"security",
	"error_handling",
	"code_style",
	"logic",
	"complexity",
	"best_practices",
	"documentation",
	"dependency_management",
]);

export const badgeEnum = pgEnum("badge", [
	"worst_naming",
	"missing_error_handling",
	"security_nightmare",
	"spaghetti_code",
	"no_documentation",
	"performance_disaster",
	"abandoned_variables",
	"magic_numbers",
	"cyclomatic_chaos",
	"regex_nightmare",
]);

// Submissions table
export const submissions = pgTable("submissions", {
	id: uuid("id").primaryKey().defaultRandom(),
	code: text("code").notNull(),
	language: programmingLanguageEnum("language").notNull(),
	title: text("title"),
	description: text("description"),
	roastMode: boolean("roast_mode").default(false),
	severityScore: integer("severity_score").default(0),
	viewCount: integer("view_count").default(0),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
