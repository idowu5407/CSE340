-- ============================================
-- 1. ORGANIZATIONS
-- ============================================

CREATE TABLE organizations (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    contact_email VARCHAR(255),
    logo_filename VARCHAR(255)
);

INSERT INTO organizations
    (name, description, contact_email, logo_filename)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);


-- ============================================
-- 2. SERVICE PROJECTS
-- ============================================

CREATE TABLE service_projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL
        REFERENCES organizations(organization_id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    date DATE NOT NULL
);

INSERT INTO service_projects
    (organization_id, title, description, location, date)
VALUES
(1, 'Community School Renovation',
 'Renovation of classrooms and improvement of school facilities.',
 'Lagos', '2026-10-05'),

(1, 'Community Center Construction',
 'Construction of a safe community center for local residents.',
 'Ogun', '2026-10-12'),

(1, 'Rural Road Improvement',
 'Improvement of roads connecting local communities.',
 'Ogun', '2026-10-20'),

(1, 'Clean Water Facility',
 'Construction of a sustainable clean water facility.',
 'Oyo', '2026-11-03'),

(1, 'Community Housing Project',
 'Construction support for affordable community housing.',
 'Lagos', '2026-11-15'),

(2, 'Community Vegetable Garden',
 'Development of a vegetable garden for local residents.',
 'Lagos', '2026-10-08'),

(2, 'Urban Farming Workshop',
 'Teaching residents sustainable urban farming methods.',
 'Ogun', '2026-10-18'),

(2, 'School Garden Project',
 'Creating a learning garden for students.',
 'Oyo', '2026-10-28'),

(2, 'Food Sustainability Program',
 'Promoting sustainable food production in the community.',
 'Lagos', '2026-11-07'),

(2, 'Community Tree Planting',
 'Planting fruit and shade trees around community farms.',
 'Ogun', '2026-11-20'),

(3, 'Food Donation Drive',
 'Collecting and distributing food to families in need.',
 'Lagos', '2026-10-10'),

(3, 'Community Cleanup',
 'Organizing volunteers to clean public community spaces.',
 'Ogun', '2026-10-22'),

(3, 'Charity Support Program',
 'Coordinating volunteers to support local charitable organizations.',
 'Lagos', '2026-11-01'),

(3, 'Senior Community Outreach',
 'Organizing volunteers for community outreach activities.',
 'Oyo', '2026-11-12'),

(3, 'Holiday Donation Campaign',
 'Coordinating donations and volunteers for a seasonal community campaign.',
 'Ogun', '2026-11-25');


-- ============================================
-- 3. CATEGORIES
-- ============================================

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) UNIQUE NOT NULL
);

INSERT INTO categories (category_name)
VALUES
    ('Environmental'),
    ('Food and Poverty Relief'),
    ('Community Service');


-- ============================================
-- 4. PROJECT-CATEGORIES JUNCTION TABLE
-- ============================================

CREATE TABLE project_categories (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    PRIMARY KEY (project_id, category_id),

    FOREIGN KEY (project_id)
        REFERENCES service_projects(project_id)
        ON DELETE CASCADE,

    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);


-- ============================================
-- 5. PROJECT-CATEGORY RELATIONSHIPS
-- ============================================

INSERT INTO project_categories
    (project_id, category_id)
VALUES

-- Environmental
(4, 1),   -- Clean Water Facility
(6, 1),   -- Community Vegetable Garden
(7, 1),   -- Urban Farming Workshop
(8, 1),   -- School Garden Project
(9, 1),   -- Food Sustainability Program
(10, 1),  -- Community Tree Planting
(12, 1),  -- Community Cleanup

-- Food and Poverty Relief
(9, 2),   -- Food Sustainability Program
(11, 2),  -- Food Donation Drive
(13, 2),  -- Charity Support Program
(15, 2),  -- Holiday Donation Campaign

-- Community Service
(1, 3),   -- Community School Renovation
(2, 3),   -- Community Center Construction
(3, 3),   -- Rural Road Improvement
(5, 3),   -- Community Housing Project
(6, 3),   -- Community Vegetable Garden
(8, 3),   -- School Garden Project
(10, 3),  -- Community Tree Planting
(12, 3),  -- Community Cleanup
(13, 3),  -- Charity Support Program
(14, 3),  -- Senior Community Outreach
(15, 3);  -- Holiday Donation Campaign


-- ============================================
-- 6. VERIFY THE DATA
-- ============================================

SELECT * 
FROM organizations
ORDER BY organization_id;

SELECT *
FROM service_projects
ORDER BY project_id;

SELECT *
FROM categories
ORDER BY category_id;

SELECT *
FROM project_categories
ORDER BY project_id, category_id;


-- ============================================
-- 7. VERIFY CATEGORY RELATIONSHIPS
-- ============================================

SELECT
    pc.project_id,
    sp.title,
    pc.category_id,
    c.category_name
FROM project_categories pc
JOIN service_projects sp
    ON pc.project_id = sp.project_id
JOIN categories c
    ON pc.category_id = c.category_id
ORDER BY pc.project_id, pc.category_id;


-- ============================================
-- 8. Roles Table
-- ============================================

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO roles (role_name, role_description) VALUES 
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

-- Verify the data was inserted
SELECT * FROM roles;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Insert a test user
INSERT INTO users (name, email, password_hash, role_id) 
VALUES ('testuser', 'test@example.com', 'placeholder_hash', 1);

-- Join users and roles to see complete information
SELECT u.user_id, u.name, u.email, r.role_name, r.role_description
FROM users u
JOIN roles r ON u.role_id = r.role_id;

-- Delete the test user
DELETE FROM users WHERE email = 'juniormicheal25@yahoo.com';


-- View all users and roles
SELECT * FROM users;
SELECT * FROM roles;

-- Update the dedicated admin testing account to have admin role
UPDATE users SET role_id = (SELECT role_id FROM roles WHERE role_name = 'admin') WHERE email = 'admin@example.com';

-- Verify the update by listing all users and their roles
SELECT users.user_id, users.email, roles.role_name FROM users JOIN roles ON users.role_id = roles.role_id;


 SELECT 
    u.user_id,
    u.email,
    r.role_name
FROM users u
JOIN roles r ON u.role_id = r.role_id
WHERE u.user_id = 12;

Select * from users;


-- Table to track volunteers for projects
CREATE TABLE project_volunteers (
    volunteer_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    project_id INT NOT NULL REFERENCES service_projects(project_id) ON DELETE CASCADE,
    UNIQUE (user_id, project_id)
);

-- Show all the table names
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;
