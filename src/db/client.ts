import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Debug: Check if DATABASE_URL is loaded
const databaseUrl = process.env.DATABASE_URL || "";
if (!databaseUrl) {
	console.warn("⚠️  WARNING: DATABASE_URL not found in environment variables");
	console.warn("Make sure .env.local is loaded");
}

// Create PostgreSQL connection pool
const pool = new Pool({
	connectionString: databaseUrl,
	max: 20,
});

// Create Drizzle database instance
export const db = drizzle(pool, { schema });

export type Database = typeof db;
