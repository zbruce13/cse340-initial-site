import pool from "./database.js";

// Get all organizations
const getOrganizations = async () => {
  const result = await pool.query(
    `SELECT
      organization_id,
      organization_name,
      description,
      contact_email,
      logo_filename
     FROM organizations
     ORDER BY organization_name`
  );

  return result.rows;
};

// Get one organization by ID
const getOrganizationById = async (organizationId) => {
  const result = await pool.query(
    `SELECT
      organization_id,
      organization_name,
      description,
      contact_email,
      logo_filename
     FROM organizations
     WHERE organization_id = $1`,
    [organizationId]
  );

  return result.rows[0];
};

export { getOrganizations, getOrganizationById };