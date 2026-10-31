import pool from "./database.js";

// Get all categories
const getCategories = async () => {
  const result = await pool.query(
    `SELECT category_id, category_name
     FROM categories
     ORDER BY category_name`
  );

  return result.rows;
};

// Get one category by ID
const getCategoryById = async (categoryId) => {
  const result = await pool.query(
    `SELECT category_id, category_name
     FROM categories
     WHERE category_id = $1`,
    [categoryId]
  );

  return result.rows[0];
};

// Get all categories for one project
const getCategoriesByProjectId = async (projectId) => {
  const result = await pool.query(
    `SELECT c.category_id, c.category_name
     FROM categories c
     JOIN project_categories pc
       ON c.category_id = pc.category_id
     WHERE pc.project_id = $1
     ORDER BY c.category_name`,
    [projectId]
  );

  return result.rows;
};

// Get all projects for one category
const getProjectsByCategoryId = async (categoryId) => {
  const result = await pool.query(
    `SELECT
      p.project_id,
      p.project_name,
      p.description,
      p.location,
      p.project_date
     FROM projects p
     JOIN project_categories pc
       ON p.project_id = pc.project_id
     WHERE pc.category_id = $1
     ORDER BY p.project_date ASC`,
    [categoryId]
  );

  return result.rows;
};

export {
  getCategories,
  getCategoryById,
  getCategoriesByProjectId,
  getProjectsByCategoryId,
};