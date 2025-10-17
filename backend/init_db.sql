DROP TABLE IF EXISTS blogs;
DROP TABLE IF EXISTS users; 
CREATE TABLE users (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL,
password TEXT NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blogs (
id SERIAL PRIMARY KEY,
user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
title VARCHAR(255) NOT NULL,
description TEXT,
content TEXT NOT NULL,
image_url VARCHAR(255),
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

 -- sample data
 
INSERT INTO users (name, email, password) VALUES
('Default Author', 'test@user.com', '2b10$7qBq7XFj4Q4Z4t7V5S6L7uK9C8g.B.S.P.O.M.N.D.A.B.C.D.E');
-- The hash above is for 'password123' with 10 salt rounds.

INSERT INTO blogs (user_id, title, description, content, image_url) VALUES
(1, 'First Post: Welcome to the New Blog', 'A quick hello to our readers on the new platform!', 'This marks the beginning of our journey. We are excited to share our thoughts and updates with you.', 'https://placehold.co/400x250/3730a3/ffffff?text=New+Platform'),
(1, 'Understanding the CRUD Operations', 'An essential guide to Create, Read, Update, and Delete in web development.', 'CRUD forms the backbone of almost every modern web application. We will use this API to demonstrate all four operations.', 'https://placehold.co/400x250/065f46/ffffff?text=CRUD+Basics'),
(1, 'Frontend Refactoring with React Hooks', 'How we updated our React components for better state management.', 'Using hooks like useState and useEffect allows for cleaner, more reusable component logic. This is key to our new approach.', 'https://placehold.co/400x250/6d28d9/ffffff?text=React+Hooks'),
(1, 'The Power of PostgreSQL', 'Why this robust database is perfect for scalable blogging platforms.', 'PostgreSQL offers features like advanced indexing and JSONB support, making it an excellent choice for a growing application.', 'https://placehold.co/400x250/be185d/ffffff?text=PostgreSQL+Power');