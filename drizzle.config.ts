import type { Config } from "drizzle-kit";

export default {
	dialect: "postgresql",
	schema: "./src/db/schema",
	out: "./drizzle/migrations",
	dbCredentials: {
		url: process.env.DATABASE_URL || "postgresql://devroast:devroast@localhost:5432/devroast_db",
	},
} satisfies Config;
