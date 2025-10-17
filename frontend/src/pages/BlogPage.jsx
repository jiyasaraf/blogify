// src/pages/BlogPage.jsx
import React, { useState, useMemo, useCallback } from "react";
import { LayoutGrid, List, RotateCcw, AlertTriangle, Plus } from "lucide-react"; 
import BlogCard from "../components/BlogCard";
import Pagination from "../components/Pagination";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import CreateBlogForm from "../components/CreateBlogForm"; 
import { useFetchBlogs } from "../hooks/useFetchBlogs";
import { API_URL } from "../config/constants";
import { useAuth } from "../hooks/AuthContext"; 

const BlogPage = () => {
  const { isAuthenticated, token } = useAuth(); // NEW: Auth State

  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showForm, setShowForm] = useState(false); 
  const [editingBlog, setEditingBlog] = useState(null); 
  
  const { 
    data: { blogs, totalCount, totalPages }, 
    loading, 
    error,
    refetch,
  } = useFetchBlogs(API_URL, currentPage, refreshTrigger);
  // console.log

  const handleCreateStart = () => {
      setEditingBlog(null);
      setShowForm(true);
  };

  const handleEditStart = useCallback((blog) => {
      setEditingBlog(blog);
      setShowForm(true);
  }, []);

  const handleFormClose = useCallback((needsRefresh) => {
      setShowForm(false);
      setEditingBlog(null);
      if (needsRefresh) {
        setRefreshTrigger(prev => prev + 1); 
      }
  }, []);


  // --- UPDATED DELETE HANDLER (Requires JWT) ---
  const handleDeleteBlog = useCallback(async (id) => {
    if (!isAuthenticated || !token) {
        alert("You must be logged in to delete a blog post.");
        return;
    }

    if (window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
          // Pass JWT in the Authorization header
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });

        if (response.status === 403) {
             alert("Error: You can only delete blog posts you own.");
             return;
        }

        if (!response.ok) {
          throw new Error(`Failed to delete blog: HTTP ${response.status}`);
        }

        setRefreshTrigger((prev) => prev + 1);
        
      } catch (err) {
        console.error("Delete error:", err);
        alert(`Failed to delete blog post: ${err.message}`);
      }
    }
  }, [token, isAuthenticated]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  if (showForm) {
    return (
        <CreateBlogForm 
            onClose={handleFormClose} 
            editingBlog={editingBlog} 
            token={token} // Pass token to the form
        />
    );
  }

  // ... (Rest of the loading/error rendering logic) ...
  if (loading && totalCount === 0) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-xl text-indigo-600">Loading blog posts...</p>
        </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header totalArticles={totalCount} />
        <main className=" mx-auto py-12 px-4 sm:px-6 lg:px-8 flex-grow">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex justify-between items-center">
                <p className="font-bold flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" /> Error fetching data: {error}
                </p>
                <button
                    onClick={() => refetch()}
                    className="flex items-center text-sm font-medium bg-red-700 text-white px-3 py-1 rounded-lg hover:bg-red-800 transition"
                >
                    <RotateCcw className="h-4 w-4 mr-1" /> Try Again
                </button>
            </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header totalArticles={totalCount} />

      <main className="py-12 px-4 sm:px-6 lg:px-8 flex-grow">
        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-10">
          
          {/* NEW: Create Post Button (Conditional) */}
          {isAuthenticated && ( 
            <button
                onClick={handleCreateStart}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition duration-200 font-bold text-lg"
            >
                <Plus className="h-6 w-6" />
                <span>Create Blog Post</span>
            </button>
          )}

          {/* View Mode Toggle */}
          <button
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="flex items-center space-x-2 ml-auto px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-lg shadow-sm hover:bg-indigo-50 transition duration-200"
          >
            {viewMode === "grid" ? (
              <>
                <List className="h-5 w-5" />
                <span>List View</span>
              </>
            ) : (
              <>
                <LayoutGrid className="h-5 w-5" />
                <span>Grid View</span>
              </>
            )}
          </button>
        </div>

        {/* ------------------ Blog Cards Section ------------------ */}
        <section className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
          {blogs.map((blog) => (
            <BlogCard 
              key={blog.id} 
              blog={blog} 
              viewMode={viewMode} 
              onDelete={handleDeleteBlog} 
              onEdit={handleEditStart} 
            />
          ))}
        </section>

        {/* totalPages now comes directly from the API response */}
        {totalPages > 1 && (
            <Pagination 
                totalPages={totalPages} 
                currentPage={currentPage} 
                onPageChange={handlePageChange} 
            />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;