// src/pages/MyBlogs.jsx
import React, { useState, useEffect } from "react";
import { Edit, Trash2, AlertTriangle, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import CreateBlogForm from "../components/CreateBlogForm";
import { useAuth } from "../hooks/AuthContext";
import BlogCard from "../components/BlogCard";

const MyBlogs = () => {
  const { isAuthenticated, token, user } = useAuth();
  const navigate = useNavigate();
  
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch user's blogs
  useEffect(() => {
    const fetchUserBlogs = async () => {
      if (!token) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/blogs/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch your blogs");
        }
        
        const data = await response.json();
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        
        // Map blogs and ensure image paths are properly formatted
        const mappedBlogs = (data.blogs || []).map(blog => ({
          ...blog,
          imageUrl: (blog.image_url && !blog.image_url.startsWith('http') && !blog.image_url.startsWith('data:'))
            ? `${apiBaseUrl.split('/api')[0]}${blog.image_url}`
            : blog.image_url || `https://placehold.co/400x250/3730a3/ffffff?text=${blog.title || "Blog Post"}`
        }));
        
        setBlogs(mappedBlogs);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching user blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserBlogs();
  }, [token, refreshTrigger]);

  const handleEditStart = (blog) => {
    setEditingBlog(blog);
    setShowForm(true);
  };

  const handleDeleteConfirm = (blogId) => {
    setDeleteConfirmation(blogId);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation(null);
  };

  const handleDeleteBlog = async (blogId) => {
    if (!token) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete blog");
      }
      
      // Remove blog from state and update count
      setBlogs(blogs.filter(blog => blog.id !== blogId));
      setDeleteConfirmation(null);
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleBlogCreated = (newBlog) => {
    setBlogs([newBlog, ...blogs]);
    setShowForm(false);
  };

  const handleFormClose = (refreshNeeded = false) => {
    setShowForm(false);
    setEditingBlog(null);
    if (refreshNeeded) {
      setRefreshTrigger(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Blog Posts</h1>
            <p className="text-gray-600 mt-1">
              {loading ? "Loading..." : `You have ${blogs.length} blog post${blogs.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/')}
              className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition"
            >
              Explore All Blogs
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              Create New Post
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setRefreshTrigger(prev => prev + 1)}
              className="mt-2 flex items-center text-red-700 hover:text-red-900"
            >
              <RotateCcw className="h-4 w-4 mr-1" /> Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {/* No Blogs State */}
            {blogs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">You haven't created any blog posts yet.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                >
                  Create Your First Post
                </button>
              </div>
            ) : (
              /* Blog List */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map(blog => (
                  <div key={blog.id} className="relative">
                    <BlogCard 
                      blog={blog} 
                      viewMode="grid"
                      onEdit={handleEditStart}
                      onDelete={handleDeleteConfirm}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {/* Delete Confirmation Modal */}
        {deleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
              <p className="mb-6">Are you sure you want to delete this blog post? This action cannot be undone.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteBlog(deleteConfirmation)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Create/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CreateBlogForm 
                onClose={handleFormClose} 
                token={token}
                editingBlog={editingBlog}
              />
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default MyBlogs;