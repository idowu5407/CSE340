import db from "./db.js";

const getAllCategories = async () => {
    const query = `
        SELECT category_id, category_name
        FROM public.categories;
    `;

    const result = await db.query(query);
    return result.rows;
};

// Retrieve a single category by its ID
const getCategoryById = async (categoryId) => {
    const query = `
        SELECT
            category_id,
            category_name
        FROM public.categories
        WHERE category_id = $1;
    `;

    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows[0] : null;
};


// Retrieve all categories for a given service project
const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT
            categories.category_id,
            categories.category_name
        FROM public.categories
        JOIN public.project_categories
            ON categories.category_id = project_categories.category_id
        WHERE project_categories.project_id = $1
        ORDER BY categories.category_name;
    `;

    const queryParams = [projectId];
    const result = await db.query(query, queryParams);

    return result.rows;
};


// Retrieve all service projects for a given category
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
            service_projects.project_id,
            service_projects.organization_id,
            service_projects.title,
            service_projects.description,
            service_projects.location,
            service_projects.date
        FROM public.service_projects
        JOIN public.project_categories
            ON service_projects.project_id = project_categories.project_id
        WHERE project_categories.category_id = $1
        ORDER BY service_projects.date;
    `;

    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

// Assign a category to a service project
const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_categories (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
};

// Retrieve all categories assigned to a specific service project
const getCategoriesByServiceProjectId = async (projectId) => {
  const sql = `
    SELECT c.category_id, c.category_name
    FROM project_categories pc
    JOIN categories c ON pc.category_id = c.category_id
    WHERE pc.project_id = $1
  `;
  const result = await db.query(sql, [projectId]);
  return result.rows;
};

// Update category assignments for a project
const updateCategoryAssignments = async (projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_categories
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};

const getProjectDetails = async (projectId) => {
    const query = `
        SELECT
            service_projects.project_id,
            service_projects.organization_id,
            service_projects.title,
            service_projects.description,
            service_projects.location,
            service_projects.date
        FROM public.service_projects
        WHERE service_projects.project_id = $1;
    `;

    const queryParams = [projectId];
    const result = await db.query(query, queryParams);

    return result.rows[0];
};

export { getAllCategories, getCategoryById, getCategoriesByProjectId,
    getProjectsByCategoryId, assignCategoryToProject, updateCategoryAssignments,
    getCategoriesByServiceProjectId, getProjectDetails
};