// Import any needed model functions
import {
    getAllCategories, getCategoryById, getProjectsByCategoryId,
    getCategoriesByServiceProjectId, updateCategoryAssignments,
    getProjectDetails, createCategory, updateCategory
} from '../models/categories.js';


// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};


// Category details page
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

// Show assign category to project form
const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByServiceProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    
    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

const showCreateCategoryForm = (req, res) => {
    res.render('new-category', { title: 'Create Category' });
    
}

const processCreateCategoryForm = async (req, res) => {
  const { categoryName } = req.body;

  if (!categoryName || categoryName.trim().length < 3) {
    req.flash('error', 'Category name must be at least 3 characters.');
    return res.redirect('/new-category');
  }

  try {
    await createCategory(categoryName.trim());
    req.flash('success', 'Category created successfully!');
    res.redirect('/categories');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error creating category.');
    res.redirect('/new-category');
  }
};

const showEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;
  const category = await getCategoryById(categoryId);

  if (!category) {
    req.flash('error', 'Category not found.');
    return res.redirect('/categories');
  }

  res.render('edit-category', { title: 'Edit Category', category });
};

const processEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;
  const { categoryName } = req.body;

  if (!categoryName || categoryName.trim().length < 3) {
    req.flash('error', 'Category name must be at least 3 characters.');
    return res.redirect(`/edit-category/${categoryId}`);
  }

  try {
    await updateCategory(categoryId, categoryName.trim());
    req.flash('success', 'Category updated successfully!');
    res.redirect('/categories');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error updating category.');
    res.redirect(`/edit-category/${categoryId}`);
  }
};



// Export any controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm, 
    showCreateCategoryForm,
    processCreateCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
};