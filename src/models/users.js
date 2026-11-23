
import pool from "./database.js";

export async function getAllUsers() {
  const result = await pool.query(`
    SELECT user_id, user_name, user_email, user_role
    FROM users
    ORDER BY user_name
  `);

  return result.rows;
}

export async function getUserByEmail(email) {
  const result = await pool.query(
    `SELECT * FROM users WHERE user_email = $1`,
    [email]
  );

  return result.rows[0];
}

export async function registerUser(name, email, hashedPassword) {
  const result = await pool.query(
    `INSERT INTO users (user_name, user_email, user_password)
     VALUES ($1, $2, $3)
     RETURNING user_id, user_name, user_email, user_role`,
    [name, email, hashedPassword]
  );

  return result.rows[0];
}
