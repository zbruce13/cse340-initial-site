
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

// Create a new organization
const createOrganization = async (
  organizationName,
  description,
  contactEmail,
  logoFilename
) => {
  const result = await pool.query(
    `INSERT INTO organizations
      (organization_name, description, contact_email, logo_filename)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [organizationName, description, contactEmail, logoFilename]
  );

  return result.rows[0];
};

// Update an existing organization
const updateOrganization = async (
  organizationId,
  organizationName,
  description,
  contactEmail,
  logoFilename
) => {
  const result = await pool.query(
    `UPDATE organizations
     SET organization_name = $1,
         description = $2,
         contact_email = $3,
         logo_filename = $4
     WHERE organization_id = $5
     RETURNING *`,
    [
      organizationName,
      description,
      contactEmail,
      logoFilename,
      organizationId,
    ]
  );

  return result.rows[0];
};

export {
  getOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
};
