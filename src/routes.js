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


const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/categories', showCategoriesPage);
router.get('/organizations/:id', showOrganizationDetailsPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/new-organization', showNewOrganizationPage);
router.post('/new-organization', processNewOrganizationForm);

//router.get('/test', (req, res) => {
    //res.send('TEST ROUTE IS WORKING');
//});

// error-handling routes
router.get('/test-error', testErrorPage);

// Route for organization details page
 //router.get('/organizations/:id', showOrganizationDetailsPage);

export default router;