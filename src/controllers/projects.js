// Import any needed model functions
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getOrganizationDetails } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getCategoryById } from '../models/categories.js';

const NUMBER_OF_PROJECTS_TO_SHOW = 5;

// Define any controller functions
const showProjectsPage = async (req, res) => {
    // Only show the next 5 upcoming projects
    const projects = await getUpcomingProjects(NUMBER_OF_PROJECTS_TO_SHOW);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
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
    const categories = await getCategoriesByProjectId(projectId);
    const title = 'Project Details';
    
    res.render('project', { title, project, categories });
};

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;

    const category = await getCategoryById(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);

    const title = 'Category Details';

    res.render('category', {
        title,
        category,
        projects
    });
};

// Export any controller functions
export {
  showProjectsPage, showOrganizationDetailsPage, showProjectDetailsPage, showCategoryDetailsPage
 };
