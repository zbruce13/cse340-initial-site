
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

// Create a new category
const createCategory = async (categoryName) => {
  const result = await pool.query(
    `INSERT INTO categories (category_name)
     VALUES ($1)
     RETURNING *`,
    [categoryName]
  );

  return result.rows[0];
};

// Update an existing category
const updateCategory = async (categoryId, categoryName) => {
  const result = await pool.query(
    `UPDATE categories
     SET category_name = $1
     WHERE category_id = $2
     RETURNING *`,
    [categoryName, categoryId]
  );

  return result.rows[0];
};

// Update the categories assigned to a project
const updateProjectCategories = async (projectId, categoryIds) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Remove previous category assignments
    await client.query(
      `DELETE FROM project_categories
       WHERE project_id = $1`,
      [projectId]
    );

    // Add the newly selected categories
    for (const categoryId of categoryIds) {
      await client.query(
        `INSERT INTO project_categories
          (project_id, category_id)
         VALUES ($1, $2)`,
        [projectId, categoryId]
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export {
  getCategories,
  getCategoryById,
  getCategoriesByProjectId,
  getProjectsByCategoryId,
  createCategory,
  updateCategory,
  updateProjectCategories,
};
