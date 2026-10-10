import db from "./db.js";

const addVolunteer = async (userId, projectId) => {
    const sql = `
        INSERT INTO project_volunteers (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING
        RETURNING volunteer_id;
    `;

    const result = await db.query(sql, [userId, projectId]);
    return result.rowCount > 0;
};

const removeVolunteer = async (userId, projectId) => {
    const sql = `
        DELETE FROM project_volunteers
        WHERE user_id = $1
          AND project_id = $2
        RETURNING volunteer_id;
    `;

    const result = await db.query(sql, [userId, projectId]);
    return result.rowCount > 0;
};

const hasVolunteered = async (userId, projectId) => {
    const sql = `
        SELECT 1
        FROM project_volunteers
        WHERE user_id = $1
          AND project_id = $2;
    `;

    const result = await db.query(sql, [userId, projectId]);
    return result.rowCount > 0;
};

const getVolunteeredProjects = async (userId) => {
    const sql = `
        SELECT sp.*, pv.volunteer_id
        FROM project_volunteers AS pv
        JOIN service_projects AS sp
            ON pv.project_id = sp.project_id
        WHERE pv.user_id = $1
        ORDER BY pv.volunteer_id DESC;
    `;

    const result = await db.query(sql, [userId]);
    return result.rows;
};

export {
    addVolunteer,
    removeVolunteer,
    hasVolunteered,
    getVolunteeredProjects
};