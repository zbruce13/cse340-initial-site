
CREATE TABLE IF NOT EXISTS organizations (
    organization_id SERIAL PRIMARY KEY,
    organization_name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS projects (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    organization_id INTEGER REFERENCES organizations(organization_id)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS project_categories (
    project_id INTEGER NOT NULL REFERENCES projects(project_id)
        ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(category_id)
        ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

INSERT INTO organizations (organization_name, description)
VALUES
    ('Green Future', 'Environmental service organization'),
    ('Learning Together', 'Educational community organization'),
    ('Community Care', 'Community support organization')
ON CONFLICT (organization_name) DO NOTHING;

INSERT INTO projects (project_name, description, organization_id)
SELECT 'Community Cleanup', 'Organize a neighborhood cleanup.',
       organization_id
FROM organizations
WHERE organization_name = 'Green Future'
ON CONFLICT (project_name) DO NOTHING;

INSERT INTO projects (project_name, description, organization_id)
SELECT 'Youth Tutoring', 'Provide tutoring for local students.',
       organization_id
FROM organizations
WHERE organization_name = 'Learning Together'
ON CONFLICT (project_name) DO NOTHING;

INSERT INTO projects (project_name, description, organization_id)
SELECT 'Food Drive', 'Collect food for families in need.',
       organization_id
FROM organizations
WHERE organization_name = 'Community Care'
ON CONFLICT (project_name) DO NOTHING;

INSERT INTO categories (category_name)
VALUES
    ('Environmental'),
    ('Educational'),
    ('Community Service'),
    ('Health and Wellness')
ON CONFLICT (category_name) DO NOTHING;

INSERT INTO project_categories (project_id, category_id)
SELECT p.project_id, c.category_id
FROM projects p
CROSS JOIN categories c
WHERE (p.project_name = 'Community Cleanup'
       AND c.category_name IN ('Environmental', 'Community Service'))
   OR (p.project_name = 'Youth Tutoring'
       AND c.category_name = 'Educational')
   OR (p.project_name = 'Food Drive'
       AND c.category_name IN ('Community Service', 'Health and Wellness'))
ON CONFLICT DO NOTHING;
