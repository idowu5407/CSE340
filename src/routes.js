import express from 'express';

import { showHomePage } from './controllers/index.js';
import {
    showOrganizationsPage, showOrganizationDetailsPage,
    showNewOrganizationPage, processNewOrganizationForm
 } from './controllers/organizations.js';
import { showProjectsPage } from './controllers/projects.js';
import { showCategoriesPage } from './controllers/categories.js'; 
import { testErrorPage } from './controllers/error.js';  
import { showProjectDetailsPage } from './controllers/projects.js';
import { showCategoryDetailsPage } from './controllers/categories.js';  
import { organizationValidation } from './controllers/organizations.js'; // Import the validation rules
import { showEditOrganizationPage } from './controllers/organizations.js';
import { processEditOrganizationForm } from './controllers/organizations.js';
import { showNewProjectForm, processNewProjectForm } from './controllers/projects.js'; // Import the new project form controller functions
import { projectValidation } from './controllers/projects.js'; // Import the validation rules for projects
import { showAssignCategoriesForm, processAssignCategoriesForm } from './controllers/categories.js'; // Import the assign categories form controller functions
import { showEditProjectForm, processEditProjectForm } from './controllers/projects.js'; // Import the edit project form controller functions
import { showCreateCategoryForm, processCreateCategoryForm } from './controllers/categories.js'; // Import the create category form controller functions
import { showEditCategoryForm, processEditCategoryForm } from './controllers/categories.js'; // Import the edit category form controller functions

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/categories', showCategoriesPage);
router.get('/organizations/:id', showOrganizationDetailsPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/new-organization', showNewOrganizationPage);
router.post('/new-organization', organizationValidation, processNewOrganizationForm); // Apply validation rules to the POST route   
router.get('/edit-organization/:id', showEditOrganizationPage); // Show the edit organization form
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm); // Apply validation rules to the POST route for editing
router.get('/new-project', showNewProjectForm); // Show the new project form
router.post('/new-project', projectValidation, processNewProjectForm); // Handle the submission of the new project form
router.get('/project/:projectId/assign-categories', showAssignCategoriesForm); // Show the assign categories form
router.post('/project/:projectId/assign-categories', processAssignCategoriesForm); // Handle the submission of the assign categories form 
router.get('/edit-project/:projectId', showEditProjectForm); // Show the edit project form
router.post('/edit-project/:projectId', processEditProjectForm); // Handle the submission of the edit project form
router .get('/new-category', showCreateCategoryForm); // Show the create category form
router.post('/new-category', processCreateCategoryForm); // Handle the submission of the create category form
router.get('/edit-category/:id', showEditCategoryForm); // Show the edit category form
router.post('/edit-category/:id', processEditCategoryForm); // Handle the submission of the edit category form


//router.get('/test', (req, res) => {
    //res.send('TEST ROUTE IS WORKING');
//});

// error-handling routes
router.get('/test-error', testErrorPage);

// Route for organization details page
 // router.get('/organizations/:id', showOrganizationDetailsPage);

export default router;