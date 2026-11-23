
import pool from "./models/database.js";

const createUsersTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        user_name VARCHAR(100) NOT NULL,
        user_email VARCHAR(255) NOT NULL UNIQUE,
        user_password VARCHAR(255) NOT NULL,
        user_role VARCHAR(20) NOT NULL DEFAULT 'user'
          CHECK (user_role IN ('user', 'admin'))
      );
    `);

    console.log("Users table created successfully.");
  } catch (error) {
    console.error("Could not create users table:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

createUsersTable();
