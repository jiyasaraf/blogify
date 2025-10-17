// src/App.jsx
import React from "react";
// Removed 'BrowserRouter as Router' - only import core routing components
import { Routes, Route } from "react-router-dom"; 
import BlogPage from "./pages/BlogPage";
import SingleBlogPage from "./pages/SingleBlogPage"; 
import MyBlogs from "./pages/MyBlogs";

// Imports for Authentication
import { AuthProvider } from './hooks/AuthContext'; 
import Register from "./pages/Register"; 
import Login from "./pages/Login"; 

const AppContent = () => (
    // Routes component manages the declarative routing
    <Routes>
        {/* Public Routes */}
        <Route path="/" element={<BlogPage />} />
        <Route path="/blog/:id" element={<SingleBlogPage />} />
        
        {/* Auth Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-blogs" element={<MyBlogs />} />
        
        {/* Optional: Fallback for 404 pages */}
        <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center">
                <h1 className="text-3xl font-bold text-gray-700">404 - Page Not Found</h1>
            </div>
        } />
    </Routes>
);

const App = () => (
    // AuthProvider wraps the content to provide session context
    <AuthProvider>
        <AppContent />
    </AuthProvider>
);

export default App;