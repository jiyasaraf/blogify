// src/pages/SingleBlogPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Home, Calendar, AlertTriangle, RotateCcw } from 'lucide-react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { API_URL } from '../config/constants';

/**
 * Page component to display the full content of a single blog post fetched by its ID.
 */
const SingleBlogPage = () => {
    // Get the 'id' parameter from the URL (e.g., /blog/123 -> id = "123")
    const { id } = useParams();

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to map API data to frontend format
    const mapBlogData = useCallback((apiBlog) => ({
        id: apiBlog.id,
        title: apiBlog.title || "Untitled Post",
        description: apiBlog.description || "No description available.",
        content: apiBlog.content, 
        imageUrl:
            apiBlog.image_url ||
            `https://placehold.co/400x250/3730a3/ffffff?text=${apiBlog.title || "Blog Post"}`,
        category: "User Generated",
        date: apiBlog.created_at
            ? new Date(apiBlog.created_at).toLocaleDateString()
            : "Date Unknown",
    }), []);


    useEffect(() => {
        const fetchSingleBlog = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const url = `${API_URL}/${id}`;
                const response = await fetch(url);
                
                if (response.status === 404) {
                    setError(`Error: Blog post with ID ${id} not found.`);
                    return;
                }
                
                if (!response.ok) {
                    const errorDetail = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
                    throw new Error(`API error: ${errorDetail.error || response.statusText}`);
                }

                const json = await response.json();
                
                // Map the incoming data to the format expected by the component
                setBlog(mapBlogData(json));

            } catch (e) {
                console.error("Fetching single blog error:", e);
                setError(`Failed to load blog post: ${e.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchSingleBlog();
        }
    }, [id, mapBlogData]);


    // --- Loading State ---
    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center flex-col bg-gray-50 p-4">
                <RotateCcw className="animate-spin text-indigo-600 h-8 w-8 mb-4" />
                <p className="text-xl font-medium text-gray-700">Loading post details...</p>
            </div>
        );

    // --- Error/Not Found State ---
    if (error || !blog)
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
                <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg border border-red-300">
                    <AlertTriangle className="text-red-600 h-10 w-10 mb-4" />
                    <p className="text-2xl font-bold text-red-700 mb-2">Error Loading Post</p>
                    <p className="text-center text-gray-600 font-mono text-sm max-w-md">{error}</p>
                    <Link to="/" className="mt-6 flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition">
                        <Home className="h-4 w-4 mr-2" />
                        Go back to homepage
                    </Link>
                </div>
            </div>
        );
        
    // --- Render Blog Post ---

    // Check if the image is a placeholder or null, to adjust header styling
    const isPlaceholderImage = blog.imageUrl?.includes('placehold.co');
    const imageUrl = blog.imageUrl && !isPlaceholderImage ? blog.imageUrl : null;
    const imageAlt = blog.description || blog.title;

    return (
        <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-8">
            <Header totalArticles={1} /> 
            
            <main className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden my-10 border border-indigo-100">
                
                {/* Back Button */}
                <div className="p-4 border-b border-gray-100">
                    <Link to="/" className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition">
                        <Home className="h-4 w-4 mr-2" />
                        Back to All Posts
                    </Link>
                </div>
                
                {/* Image and Header Section (Adapted from BlogDetailModal) */}
                {imageUrl ? (
                    <div className="relative h-96 w-full overflow-hidden">
                        <img 
                            src={imageUrl} 
                            alt={imageAlt} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="p-6 sm:p-10 bg-indigo-600 flex items-center justify-start">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                            {blog.title}
                        </h1>
                    </div>
                )}
                
                {/* Content Body */}
                <div className="p-6 sm:p-10 space-y-6">
                    {/* Title (Rendered inside body if image header was used) */}
                    {imageUrl && (
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                            {blog.title}
                        </h1>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center text-sm font-medium text-gray-500 border-b pb-4">
                        <span className="text-indigo-600 font-bold uppercase tracking-wider mr-4">
                            {blog.category}
                        </span>
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Published on {blog.date}</span>
                    </div>

                    {/* Description and Full Content */}
                    <p className="text-xl font-semibold text-gray-700 italic">
                        {blog.description}
                    </p>
                    
                    {/* Full content */}
                    <div className="text-gray-800 leading-relaxed pt-4 whitespace-pre-wrap text-base">
                        {blog.content}
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SingleBlogPage;
