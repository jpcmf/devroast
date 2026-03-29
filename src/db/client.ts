import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Create PostgreSQL connection pool
const pool = new Pool({
	connectionString: process.env.DATABASE_URL || "",
	max: 20,
});

// Create Drizzle database instance
export const db = drizzle(pool, { schema });

export type Database = typeof db;
