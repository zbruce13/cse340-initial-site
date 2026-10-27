
import pool from "./database.js";

const getOrganizations = async () => {
  const result = await pool.query(
    `SELECT organization_id, organization_name, description
     FROM organizations
     ORDER BY organization_name`
  );

  return result.rows;
};

export { getOrganizations };
