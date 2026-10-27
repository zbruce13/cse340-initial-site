
import pool from "./database.js";

const getCategories = async () => {
  const result = await pool.query(
    "SELECT category_id, category_name FROM categories ORDER BY category_name"
  );

  return result.rows;
};

export { getCategories };
