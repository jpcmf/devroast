DO $$ BEGIN
 CREATE TYPE "badge" AS ENUM('worst_naming', 'missing_error_handling', 'security_nightmare', 'spaghetti_code', 'no_documentation', 'performance_disaster', 'abandoned_variables', 'magic_numbers', 'cyclomatic_chaos', 'regex_nightmare');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "feedback_type" AS ENUM('roast', 'standard', 'review');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "issue_category" AS ENUM('naming', 'performance', 'security', 'error_handling', 'code_style', 'logic', 'complexity', 'best_practices', 'documentation', 'dependency_management');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "programming_language" AS ENUM('javascript', 'typescript', 'python', 'rust', 'golang', 'java', 'csharp', 'php', 'ruby', 'kotlin', 'sql', 'html', 'css', 'json', 'yaml', 'bash', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "severity_level" AS ENUM('critical', 'high', 'medium', 'low', 'minimal');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"feedback_type" "feedback_type" NOT NULL,
	"content" text NOT NULL,
	"issues_found" integer DEFAULT 0,
	"recommendations_count" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roasts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"rank_position" integer,
	"severity_rating" integer NOT NULL,
	"critical_issues_count" integer DEFAULT 0,
	"badges" text[] DEFAULT '{}',
	"last_ranked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "roasts_submission_id_unique" UNIQUE("submission_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"language" "programming_language" NOT NULL,
	"title" text,
	"description" text,
	"roast_mode" boolean DEFAULT false,
	"severity_score" integer DEFAULT 0,
	"view_count" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedback" ADD CONSTRAINT "feedback_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roasts" ADD CONSTRAINT "roasts_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
