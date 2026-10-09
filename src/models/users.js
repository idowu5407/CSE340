import db from './db.js'
import bcrypt from 'bcrypt';

// Create a new user in the database
const createUser = async (name, email, password) => {
    const default_role = 'user';
    const passwordHash = await bcrypt.hash(password, 10);
    const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
    const queryParams = [name, email, passwordHash, default_role];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

// Find a user by email in the database
const findUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id,  u.name, u.email, u.password_hash, r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1
    `;
    const queryParams = [email];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // User not found
    }
    
    return result.rows[0];
};

// Verify a user's password against the stored hash
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

// authenticateUser that takes an email and password as parameters.
const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);
    if (!user) {
        return null; // User not found
    }

    const isMatch = await verifyPassword(password, user.password_hash);
    if (!isMatch) {
        return null; // Password does not match
    }

    return user;
};

// Show the dashboard page
const showDashboard = (req, res) => {
    if (!req.session.user) {
        req.flash('error', 'You must be logged in to view the dashboard.');
        return res.redirect('/login');
    }

    res.render('dashboard', { 
        title: 'Dashboard',
        name: req.session.user.name,
        email: req.session.user.email
    });
};

// Get all users with their roles
const getAllUsers = async () => {
  const query = `
    SELECT u.user_id, u.name, u.email, r.role_name
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    ORDER BY u.name;
  `;
  const result = await db.query(query);
  return result.rows;
};

export { createUser, findUserByEmail, verifyPassword, authenticateUser, showDashboard, getAllUsers };