// blog-api/models/blogModel.js

import { pool } from '../config/db.js';

/**
 * Counts the total number of blogs.
 * @returns {Promise<number>} Total count.
 */
export const getBlogCount = async () => {
    const totalCountResult = await pool.query('SELECT COUNT(*) FROM blogs');
    return parseInt(totalCountResult.rows[0].count, 10);
};

/**
 * Fetches all blogs, paginated, and joins with user data.
 * @param {number} limit Max number of blogs to return.
 * @param {number} offset Number of rows to skip.
 * @returns {Promise<object[]>} Array of blog objects.
 */
export const findAllBlogs = async (limit, offset) => {
    const blogsQuery = `
        SELECT b.id, b.title, b.description, b.content, b.image_url, b.created_at, b.user_id, u.name
        FROM blogs b 
        JOIN users u ON b.user_id = u.id
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
    `;
    const blogsResult = await pool.query(blogsQuery, [limit, offset]);
    return blogsResult.rows;
};

/**
 * Fetches a single blog post by its ID.
 * @param {string} id Blog ID.
 * @returns {Promise<object|null>} The blog object or null.
 */
export const findBlogById = async (id) => {
    const result = await pool.query(
        `SELECT id, title, description, content, image_url, created_at, user_id FROM blogs WHERE id = $1`, 
        [id]
    );
    return result.rows[0] || null;
};

/**
 * Fetches all blogs created by a specific user.
 * @param {string} userId User ID.
 * @returns {Promise<object[]>} Array of blog objects.
 */
export const findBlogsByUserId = async (userId) => {
    const result = await pool.query(
        `SELECT b.id, b.title, b.description, b.content, b.image_url, b.created_at, b.user_id, u.name as username
         FROM blogs b 
         JOIN users u ON b.user_id = u.id
         WHERE user_id = $1
         ORDER BY created_at DESC`, 
        [userId]
    );
    return result.rows;
};


/**
 * Creates a new blog post.
 * @param {object} data Blog data.
 * @returns {Promise<object>} The created blog object.
 */
export const createBlog = async ({ title, description, content, imagePath, userId }) => {
    const result = await pool.query(
        `INSERT INTO blogs (title, description, content, image_url, user_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`, 
        [title, description, content, imagePath, userId]
    );
    return result.rows[0];
};

/**
 * Finds a blog by ID and checks ownership (returns image path and owner ID).
 * @param {string} blogId Blog ID.
 * @returns {Promise<object|null>} { image_url, user_id } or null.
 */
export const findBlogForUpdateOrDelete = async (blogId) => {
    const result = await pool.query('SELECT image_url, user_id FROM blogs WHERE id = $1', [blogId]);
    return result.rows[0] || null;
};

/**
 * Deletes a blog post, ensuring ownership.
 * @param {string} blogId Blog ID.
 * @param {string} userId User ID of the owner.
 */
export const deleteBlog = async (blogId, userId) => {
    await pool.query('DELETE FROM blogs WHERE id = $1 AND user_id = $2', [blogId, userId]);
};

/**
 * Updates an existing blog post.
 * @param {object} data Update data.
 * @returns {Promise<object>} The updated blog object.
 */
export const updateBlog = async ({ blogId, title, description, content, newImagePath, userId }) => {

    let queryFields = 'title = $1, description = $2, content = $3';
    let updateFields = [title, description, content];

    // Add image_url to fields if new image path is provided
    if (newImagePath !== undefined) {
        queryFields += `, image_url = $4`;
        updateFields.push(newImagePath); // add image path
        updateFields.push(userId, blogId); // add userId and blogId at end
    } else {
        updateFields.push(userId, blogId);
    }

    // Adjust parameter positions dynamically
    const userIdIndex = updateFields.length - 1;
    const blogIdIndex = updateFields.length;

    const result = await pool.query(
        `UPDATE blogs
         SET ${queryFields}
         WHERE id = $${blogIdIndex} AND user_id = $${userIdIndex}
         RETURNING *`,
        updateFields
    );

    return result.rows[0];
};
