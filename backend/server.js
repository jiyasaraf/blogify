// blog-api/server.js

// 1. Load environment variables
import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import path from 'path'; 
import { connectDB, initializeDB } from './config/db.js';

// Import Routers
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// --- Middleware Setup ---
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true
}));

initializeDB();

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads'))); 
app.use(express.json()); // For parsing application/json

// --- Connect Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// --- Server Start ---
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Express server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection failed:', err.message);
        // Do not exit process here, let the app run but log the error. 
        // We handle connection pooling in db.js, so the app can start even if the initial connection fails.
    });
