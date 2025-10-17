# The Custom Blog

A modern, full-stack blog platform with user authentication, email verification, and content management capabilities.

## Description

The Custom Blog is a comprehensive blogging platform built with React and Express.js. It provides users with the ability to create, read, update, and delete blog posts, along with robust user authentication and account management features. The platform includes email verification for new accounts, image upload capabilities, and a responsive user interface.

### Key Features

- User registration and authentication with JWT
- Email verification via OTP
- Create and manage blog posts with rich text content
- Image upload for blog posts and profile pictures
- Responsive design for desktop and mobile devices
- PostgreSQL database for data persistence

## Installation Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- Gmail account (for email verification)

### Setup Steps

1. **Clone the repository**

```bash
git clone <repository-url>
cd blog-post-website
```

2. **Set up the backend**

```bash
cd blog-api
npm install
```

3. **Configure environment variables**

Create a `.env` file in the `blog-api` directory with the following variables:

```
# Database Configuration
DB_HOST=localhost
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=blog_db
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_gmail_address
EMAIL_PASSWORD=your_app_password
```

Note: For Gmail, you need to use an App Password. See [Google Account Help](https://support.google.com/accounts/answer/185833) for instructions.

4. **Initialize the database**

Run the SQL script to create the necessary tables:

```bash
psql -U your_db_username -d blog_db -f init_db.sql
```

5. **Set up the frontend**

```bash
cd ..
npm install
```

## Usage Examples

### Starting the Application

1. **Start the backend server**

```bash
cd blog-api
npm start
```

The API server will start on http://localhost:3001 by default.

2. **Start the frontend development server**

```bash
cd ..
npm run dev
```

The frontend will be available at http://localhost:5173.

### Using the Application

1. **Register a new account**
   - Navigate to the Register page
   - Fill in your details and submit
   - Check your email for the verification code
   - Enter the code to verify your account

2. **Create a new blog post**
   - Log in to your account
   - Click on "Create New Post"
   - Fill in the title, content, and optionally upload an image
   - Click "Publish" to make your post public

3. **View and manage your posts**
   - Navigate to "My Blogs" to see all your posts
   - Use the edit and delete options to manage your content

## Configuration Options

### Backend Configuration

The backend can be configured through the `.env` file with the following options:

- `PORT`: The port on which the API server runs (default: 3001)
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRES_IN`: Token expiration time (default: '1d')
- Email settings (`EMAIL_*`): Configure the email service for verification

### Frontend Configuration

The frontend API endpoint can be configured in `src/config/constants.js`:

```javascript
export const API_URL = 'http://localhost:3001/api';
```

## Dependencies

### Backend Dependencies

- express: Web server framework
- pg: PostgreSQL client
- bcrypt: Password hashing
- jsonwebtoken: JWT authentication
- nodemailer: Email sending
- multer: File upload handling
- sharp: Image processing
- dotenv: Environment variable management
- cors: Cross-origin resource sharing

### Frontend Dependencies

- react: UI library
- react-router-dom: Client-side routing
- tailwindcss: CSS framework
- lucide-react: Icon library
- vite: Build tool and development server

## Contributing Guidelines

We welcome contributions to improve The Custom Blog! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

## License Information

This project is licensed under the ISC License - see the LICENSE file for details.

## Contact/Support Details

For support or inquiries, please contact:

- Email: support@customblogs.com
- GitHub Issues: [Project Issues Page](https://github.com/yourusername/blog-post-website/issues)

---

© 2023 The Custom Blog. All rights reserved.
