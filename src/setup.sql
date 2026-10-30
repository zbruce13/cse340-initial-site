-- ORGANIZATIONS TABLE
CREATE TABLE IF NOT EXISTS organizations (
    organization_id SERIAL PRIMARY KEY,
    organization_name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT
);

-- Add the required organization columns safely.
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255);

ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS logo_filename VARCHAR(255);


-- PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    organization_id INTEGER REFERENCES organizations(organization_id)
        ON DELETE SET NULL
);

-- Add the required project columns safely.
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS location VARCHAR(200);

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS project_date DATE;


-- CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);


-- PROJECT-CATEGORY RELATIONSHIP TABLE
CREATE TABLE IF NOT EXISTS project_categories (
    project_id INTEGER NOT NULL REFERENCES projects(project_id)
        ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(category_id)
        ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);


-- INSERT OR UPDATE ORGANIZATIONS
INSERT INTO organizations
    (organization_name, description, contact_email, logo_filename)
VALUES
    ('Green Future',
     'Environmental service organization',
     'greenfuture@example.com',
     'greenharvest.svg'),

    ('Learning Together',
     'Educational community organization',
     'learningtogether@example.com',
     'unityserve.svg'),

    ('Community Care',
     'Community support organization',
     'communitycare@example.com',
     'brightfuture.svg')

ON CONFLICT (organization_name)
DO UPDATE SET
    description = EXCLUDED.description,
    contact_email = EXCLUDED.contact_email,
    logo_filename = EXCLUDED.logo_filename;


-- INSERT OR UPDATE 15 SERVICE PROJECTS (5 PER ORGANIZATION)
INSERT INTO projects
    (project_name, description, organization_id, location, project_date)

SELECT
    p.project_name,
    p.description,
    o.organization_id,
    p.location,
    p.project_date

FROM (
    VALUES
    ('Community Cleanup',
     'Organize a neighborhood cleanup.',
     'Green Future',
     'City Community Park',
     DATE '2026-11-07'),

    ('Community Garden',
     'Plant and maintain a community garden.',
     'Green Future',
     'Green Valley Garden',
     DATE '2026-11-14'),

    ('Tree Planting',
     'Plant trees to improve the local environment.',
     'Green Future',
     'Riverside Park',
     DATE '2026-11-21'),

    ('Recycling Drive',
     'Collect recyclable materials from residents.',
     'Green Future',
     'Community Center',
     DATE '2026-11-28'),

    ('River Restoration',
     'Help remove litter and restore river areas.',
     'Green Future',
     'Riverside Trail',
     DATE '2026-12-05'),

    ('Youth Tutoring',
     'Provide tutoring for local students.',
     'Learning Together',
     'Learning Together Center',
     DATE '2026-11-07'),

    ('Reading Program',
     'Help children improve their reading skills.',
     'Learning Together',
     'Public Library',
     DATE '2026-11-14'),

    ('Computer Skills Workshop',
     'Teach basic computer skills to community members.',
     'Learning Together',
     'Community Computer Lab',
     DATE '2026-11-21'),

    ('School Supply Drive',
     'Collect school supplies for students.',
     'Learning Together',
     'Learning Together Center',
     DATE '2026-11-28'),

    ('After-School Mentoring',
     'Mentor students through after-school activities.',
     'Learning Together',
     'Local Elementary School',
     DATE '2026-12-05'),

    ('Food Drive',
     'Collect food for families in need.',
     'Community Care',
     'Community Care Center',
     DATE '2026-11-07'),

    ('Senior Support',
     'Assist senior citizens with daily needs.',
     'Community Care',
     'Sunrise Senior Center',
     DATE '2026-11-14'),

    ('Clothing Donation Drive',
     'Collect clothing for families in need.',
     'Community Care',
     'Community Care Center',
     DATE '2026-11-21'),

    ('Community Health Fair',
     'Help organize a community health event.',
     'Community Care',
     'Town Hall',
     DATE '2026-11-28'),

    ('Family Assistance Program',
     'Prepare and distribute essential care packages.',
     'Community Care',
     'Family Resource Center',
     DATE '2026-12-05')

) AS p(project_name, description, organization_name, location, project_date)

JOIN organizations o
    ON o.organization_name = p.organization_name

ON CONFLICT (project_name)
DO UPDATE SET
    description = EXCLUDED.description,
    organization_id = EXCLUDED.organization_id,
    location = EXCLUDED.location,
    project_date = EXCLUDED.project_date;


-- INSERT CATEGORIES
INSERT INTO categories (category_name)
VALUES
    ('Environmental'),
    ('Educational'),
    ('Community Service'),
    ('Health and Wellness')

ON CONFLICT (category_name) DO NOTHING;


-- ASSOCIATE EVERY PROJECT WITH ONE OR MORE CATEGORIES
INSERT INTO project_categories (project_id, category_id)

SELECT
    p.project_id,
    c.category_id

FROM (
    VALUES
    ('Community Cleanup', 'Environmental'),
    ('Community Cleanup', 'Community Service'),
    ('Community Garden', 'Environmental'),
    ('Community Garden', 'Community Service'),
    ('Tree Planting', 'Environmental'),
    ('Recycling Drive', 'Environmental'),
    ('Recycling Drive', 'Community Service'),
    ('River Restoration', 'Environmental'),

    ('Youth Tutoring', 'Educational'),
    ('Reading Program', 'Educational'),
    ('Computer Skills Workshop', 'Educational'),
    ('School Supply Drive', 'Educational'),
    ('School Supply Drive', 'Community Service'),
    ('After-School Mentoring', 'Educational'),

    ('Food Drive', 'Community Service'),
    ('Food Drive', 'Health and Wellness'),
    ('Senior Support', 'Community Service'),
    ('Senior Support', 'Health and Wellness'),
    ('Clothing Donation Drive', 'Community Service'),
    ('Community Health Fair', 'Health and Wellness'),
    ('Community Health Fair', 'Community Service'),
    ('Family Assistance Program', 'Community Service'),
    ('Family Assistance Program', 'Health and Wellness')

) AS pc(project_name, category_name)

JOIN projects p
    ON p.project_name = pc.project_name

JOIN categories c
    ON c.category_name = pc.category_name

ON CONFLICT DO NOTHING;