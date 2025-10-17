// blog-api/config/db.js
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

// Create a new Pool instance. It will automatically use the standard
// PG* environment variables (.env file) for connection details.
export const pool = new Pool({
    user:'jiya',
    host:'db',
    database:'mydb',
    password:'123123',
    port: '5432'
});

const createUserTable = async ()=> {
    const queryText = 
        `   CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );`
    try {
        await pool.query(queryText);
        console.log("BLOG TABLE IS INITIALIZED")
    } catch (error) {
        console.log('Error creating users table')
    }
}


const createBlogTable = async ()=> {
    const queryText = 
    `CREATE TABLE blogs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        content TEXT NOT NULL,
        image_url VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`

    try {
        await pool.query(queryText);
        console.log("Blog table created");
    } catch (error) {
        console.log("Erro from create blog table" + error);
    }
}
/**
 * Checks the database connection by attempting to query the pool.
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
    try {
        await pool.query('SELECT 1+1 AS result');
        console.log('PostgreSQL database connection successful!');
    } catch (error) {
        console.error('Initial database connection test failed:', error.message);
        throw new Error('Database connection failed.');
    }
};

export const initializeDB = async () => {
    await createUserTable();
    await createBlogTable();
}
