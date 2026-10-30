import pool from "./database.js";

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

export { getOrganizations };