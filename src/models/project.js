import db from './db.js';

async function getAllProjects() {
    const sql = `
        SELECT
            service_projects.project_id,
            service_projects.title,
            service_projects.description,
            service_projects.location,
            service_projects.date,
            organizations.name AS organization_name
        FROM service_projects
        JOIN organizations
            ON service_projects.organization_id = organizations.organization_id
        ORDER BY service_projects.project_id;
    `;

    const result = await db.query(sql);

    return result.rows;
}

export { getAllProjects };