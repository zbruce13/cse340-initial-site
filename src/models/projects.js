
import pool from "./database.js";

// Get all projects
const getProjects = async () => {
  const result = await pool.query(
    `SELECT
      p.project_id,
      p.project_name,
      p.description,
      p.location,
      p.project_date,
      o.organization_id,
      o.organization_name
     FROM projects p
     LEFT JOIN organizations o
       ON p.organization_id = o.organization_id
     ORDER BY p.project_date ASC`
  );

  return result.rows;
};

// Get one project by ID
const getProjectById = async (projectId) => {
  const result = await pool.query(
    `SELECT
      p.project_id,
      p.project_name,
      p.description,
      p.location,
      p.project_date,
      o.organization_id,
      o.organization_name
     FROM projects p
     LEFT JOIN organizations o
       ON p.organization_id = o.organization_id
     WHERE p.project_id = $1`,
    [projectId]
  );

  return result.rows[0];
};

// Get projects for one organization
const getProjectsByOrganizationId = async (organizationId) => {
  const result = await pool.query(
    `SELECT
      project_id,
      project_name,
      description,
      location,
      project_date
     FROM projects
     WHERE organization_id = $1
     ORDER BY project_date ASC`,
    [organizationId]
  );

  return result.rows;
};

// Get the next five upcoming projects
const getUpcomingProjects = async () => {
  const result = await pool.query(
    `SELECT
      p.project_id,
      p.project_name,
      p.description,
      p.location,
      p.project_date,
      o.organization_id,
      o.organization_name
     FROM projects p
     LEFT JOIN organizations o
       ON p.organization_id = o.organization_id
     WHERE p.project_date >= CURRENT_DATE
     ORDER BY p.project_date ASC
     LIMIT 5`
  );

  return result.rows;
};

// Create a new project
const createProject = async (
  projectName,
  description,
  organizationId,
  location,
  projectDate
) => {
  const result = await pool.query(
    `INSERT INTO projects
      (project_name, description, organization_id, location, project_date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [projectName, description, organizationId, location, projectDate]
  );

  return result.rows[0];
};

// Update an existing project
const updateProject = async (
  projectId,
  projectName,
  description,
  organizationId,
  location,
  projectDate
) => {
  const result = await pool.query(
    `UPDATE projects
     SET project_name = $1,
         description = $2,
         organization_id = $3,
         location = $4,
         project_date = $5
     WHERE project_id = $6
     RETURNING *`,
    [
      projectName,
      description,
      organizationId,
      location,
      projectDate,
      projectId,
    ]
  );

  return result.rows[0];
};

export {
  getProjects,
  getProjectById,
  getProjectsByOrganizationId,
  getUpcomingProjects,
  createProject,
  updateProject,
};
