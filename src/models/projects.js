import pool from "./database.js";

const getProjects = async () => {
  const result = await pool.query(
    `SELECT
        p.project_id,
        p.project_name,
        p.description,
        p.location,
        p.project_date,
        o.organization_name,
        COALESCE(
          array_agg(c.category_name)
            FILTER (WHERE c.category_name IS NOT NULL),
          ARRAY[]::varchar[]
        ) AS categories
     FROM projects p
     LEFT JOIN organizations o
       ON p.organization_id = o.organization_id
     LEFT JOIN project_categories pc
       ON p.project_id = pc.project_id
     LEFT JOIN categories c
       ON pc.category_id = c.category_id
     GROUP BY p.project_id, o.organization_name
     ORDER BY p.project_name`
  );

  return result.rows;
};

export { getProjects };