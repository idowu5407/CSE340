import db from './db.js';

// Get upcoming projects
const getUpcomingProjects = async (number_of_projects) => {
    const sql = `
        SELECT
            service_projects.project_id,
            service_projects.title,
            service_projects.description,
            service_projects.location,
            service_projects.date,
            organizations.organization_id,
            organizations.name AS organization_name
        FROM service_projects
        JOIN organizations
            ON service_projects.organization_id = organizations.organization_id
        WHERE service_projects.date >= CURRENT_DATE
        ORDER BY service_projects.date ASC
        LIMIT $1;
    `;
    const result = await db.query(sql, [number_of_projects]);
    return result.rows;
};
    


const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          service_projects.project_id,
          service_projects.organization_id,
          service_projects.title,
          service_projects.description,
          service_projects.location,
          service_projects.date
        FROM  service_projects
        JOIN organizations ON service_projects.organization_id = organizations.organization_id
        WHERE service_projects.organization_id = $1
        ORDER BY service_projects.date ASC;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};

// Get single project details
const getProjectDetails = async (Id) => {
    const sql = `
        SELECT
            service_projects.project_id,
            service_projects.title,
            service_projects.description,
            service_projects.location,
            service_projects.date,
            organizations.organization_id,
            organizations.name AS organization_name
        FROM service_projects
        JOIN organizations
            ON service_projects.organization_id = organizations.organization_id
        WHERE service_projects.project_id = $1;
    `;
    const result = await db.query(sql, [Id]);
    return result.rows[0];
};


// function to create a new project
const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO service_projects (title, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}

export { getUpcomingProjects, getProjectsByOrganizationId, getProjectDetails, createProject };
