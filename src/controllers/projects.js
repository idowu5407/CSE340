// Import any needed model functions
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';

const NUMBER_OF_PROJECTS_TO_SHOW = 5;

// Define any controller functions
const showProjectsPage = async (req, res) => {
    // Only show the next 5 upcoming projects
    const projects = await getUpcomingProjects(NUMBER_OF_PROJECTS_TO_SHOW);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};  

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

const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Organization Details';

    res.render('organization', {title, organizationDetails, projects});
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const title = 'Project Details';
    res.render('project', { title, project });
};

// Export any controller functions
export {
  showProjectsPage, showOrganizationDetailsPage, getProjectsByOrganizationId, getUpcomingProjects, showProjectDetailsPage
 };
