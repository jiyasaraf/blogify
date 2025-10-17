// src/config/constants.js
export const BLOGS_PER_PAGE = 6; // Changed to 6, matching the server default limit

// API_URL now points to your local Express server
export const API_URL = 'http://localhost:3001/api/blogs'; 


// export const BLOGS_PER_PAGE = 6;

// This variable will be automatically set by Vercel/Vite in the production build.
// If not set (i.e., local development), it defaults to your local Express API.
// export const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/blogs';
