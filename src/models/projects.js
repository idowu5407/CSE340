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

const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          date
        FROM project
        WHERE organization_id = $1
        ORDER BY date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};

export { getAllProjects, getProjectsByOrganizationId };