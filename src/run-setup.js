
import "dotenv/config";
import { readFile } from "node:fs/promises";
import pool from "./models/database.js";

try {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing from .env");
  }

  const sql = await readFile(
    new URL("./setup.sql", import.meta.url),
    "utf8"
  );

  await pool.query(sql);
  console.log("Database tables and sample records created successfully.");
} catch (error) {
  console.error("Database setup failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
