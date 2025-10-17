// blog-api/models/userModel.js

import { pool } from '../config/db.js';

/**
 * Finds a user in the database by their email address.
 * @param {string} email The user's email.
 * @returns {Promise<object|null>} The user row or null.
 */
export const findUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
};

/**
 * Creates a new user in the database.
 * @param {string} email User email.
 * @param {string} hashedPassword Hashed password.
 * @param {string} name User name.
 * @returns {Promise<object>} The created user row (id, email, name).
 */
export const createUser = async (email, hashedPassword, name) => {
    const result = await pool.query(
        'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
        [email, hashedPassword, name]
    );
    return result.rows[0];
};
