import { createUser, authenticateUser, deleteUserById } from '../models/users.js';
import { getVolunteeredProjects } from '../models/volunteers.js';


// Show the user registration form
const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

// Process the user registration form submission
const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Pass the original password to createUser.
        // createUser will hash it before storing it.
        await createUser(name, email, password);

        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');

    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

// Show the login form
const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

// Process the login form submission
const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        if (user) {
            // Store user info in session
            req.session.user = user;
            req.flash('success', 'Login successful!');

            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }

            res.redirect('/dashboard'); // Redirect to the dashboard after successful login
        } else {
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

// Process the logout action
const processLogout = async (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }

    req.flash('success', 'Logout successful!');
    res.redirect('/login');
};

// Middleware to require login for certain routes
const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};


// Show the dashboard page
const showDashboard = async (req, res, next) => {
    try {
        const user = req.session.user;
        if (!user) {
            req.flash('error', 'You must be logged in to access that page.');
            return res.redirect('/login');
        }

        const userId = user.user_id;
        const volunteeredProjects = await getVolunteeredProjects(userId);

        res.render('dashboard', {
            title: 'Dashboard',
            name: user.name,
            email: user.email,
            user: user,
            volunteeredProjects
        });
    } catch (error) {
        next(error);
    }
};



/**
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 * 
 * @param {string} role - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
const requireRole = (role) => {
    return (req, res, next) => {
        // Check if user is logged in first
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // Check if user's role matches the required role
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        // User has required role, continue
        next();
    };
};

import { getAllUsers } from '../models/users.js';

// Show all registered users (admin only)
const showUsersPage = async (req, res) => {
  if (!req.session.user || req.session.user.role_name !== 'admin') {
    req.flash('error', 'You do not have permission to view the users page.');
    return res.redirect('/dashboard');
  }

  try {
    const users = await getAllUsers();
    res.render('users', { title: 'All Users', users });
  } catch (error) {
    console.error('Error fetching users:', error);
    req.flash('error', 'Unable to load users.');
    res.redirect('/dashboard');
  }
};

// Delete users


const deleteUser = async (req, res) => {
  if (!req.session.user || req.session.user.role_name !== 'admin') {
    console.log("❌ Delete attempt blocked: not an admin");
    req.flash('error', 'You do not have permission to delete users.');
    return res.redirect('/users');
  }

  const userId = req.params.userId;
  console.log("🟢 Delete route hit. User ID to delete:", userId);

  try {
    await deleteUserById(userId);
    console.log("✅ Controller finished delete for user:", userId);
    req.flash('success', 'User deleted successfully.');
    res.redirect('/users');
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    req.flash('error', 'Failed to delete user.');
    res.redirect('/users');
  }
};



export {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  showDashboard,
    requireRole,
    showUsersPage,
    deleteUser
};
