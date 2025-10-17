// blog-api/utils/generateTitleImage.js

import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Helper to get directory name in ES Module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generates a PNG image with a title overlay using Sharp.
 * @param {string} title The text to display on the image.
 * @returns {Promise<string|null>} The relative file path (e.g., 'uploads/...') or null on failure.
 */
export const generateTitleImage = async (title) => {
    try {
        const projectRoot = path.join(__dirname, '..');
        const uploadDir = path.join(projectRoot, 'uploads');
        
        // Ensure uploads directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `title-image-${uniqueSuffix}.png`;
        const filePath = path.join(uploadDir, filename);
        
        // Image generation parameters
        const width = 800;
        const height = 400;
        const backgroundColor = '#0e0e0fff'; // Indigo color
        
        // Create an SVG with text overlay
        const svgImage = `
        <svg width="${width}" height="${height}">
            <rect width="100%" height="100%" fill="${backgroundColor}"/>
            <text 
                x="50%" 
                y="50%" 
                font-family="Arial, sans-serif" 
                font-size="48" 
                font-weight="bold"
                fill="white" 
                text-anchor="middle" 
                dominant-baseline="middle"
            >
                ${title.substring(0, 30)}${title.length > 30 ? '...' : ''}
            </text>
        </svg>`;
        
        // Generate the image using Sharp (SVG -> PNG)
        await sharp(Buffer.from(svgImage))
            .png()
            .toFile(filePath);
        
        // Return the path relative to the project root for DB storage
        const relativePath = path.join('uploads', filename).replace(/\\/g, '/');
        console.log(`Generated title image at: ${relativePath}`);
        
        return relativePath;
    } catch (error) {
        console.error('Error generating title image:', error);
        return null;
    }
};
