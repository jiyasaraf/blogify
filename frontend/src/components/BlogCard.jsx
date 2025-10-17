// src/components/BlogCard.jsx
import React from "react";
import { Trash2, Pencil } from "lucide-react"; 
import { Link } from "react-router-dom"; 
import { useAuth } from "../hooks/AuthContext"; // NEW: Import auth hook

// BlogCard now expects 'blog' data to contain 'user_id' from the database
const BlogCard = React.memo(({ blog, viewMode, onDelete, onEdit }) => {
  const isGrid = viewMode === "grid";
//   console.log(users.name);
  
  // NEW: Get current user info
  const { isAuthenticated, user } = useAuth();
  
  // CRITICAL CHECK: Does the logged-in user's ID match the post's owner ID?
  const isOwner = isAuthenticated && user && user.userId === blog.user_id;

  // Handler to prevent opening the single post when clicking action buttons
  const stopPropagation = (e) => e.stopPropagation();

  // Function to handle blog card click - only navigate to blog if not clicking edit/delete buttons
  const handleCardClick = (e) => {
    // If the click is on or inside the action buttons container, don't navigate
    if (e.target.closest('.blog-action-buttons')) {
      e.preventDefault();
      return;
    }
    
    // Otherwise, allow navigation to proceed
  };

  return (
    <Link 
        to={`/blog/${blog.id}`} 
        role="article"
        onClick={handleCardClick}
        className={`bg-white shadow-xl rounded-xl transition-all duration-300 overflow-hidden hover:shadow-2xl hover:scale-[1.01] flex cursor-pointer ${
            isGrid ? "flex-col" : "flex-row md:h-40"
        } max-w-full relative`} 
    >
        {/* Blog Image */}
        <div className={`${isGrid ? "h-48 w-full" : "h-32 w-32 md:h-full md:w-56"} flex-shrink-0`}>
            <img
                src={blog.imageUrl}
                alt={`Image for ${blog.title}`}
                className="h-full w-full object-contain"
            />
        </div>

        <div>
            <h3>
                Post by : {blog.username}
            </h3>
        </div>
        {/* Blog Content */}
        <div className={`p-5 flex flex-col justify-between ${!isGrid && "flex-grow"}`}>
            <div>
                <h2 
                    className={`font-bold text-gray-900 line-clamp-2 ${
                        isGrid ? 'text-xl' : 'text-lg'
                    }`}
                >
                    {blog.title}
                </h2>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{blog.description}</p>
            </div>
            <p className="mt-3 text-xs text-gray-400">Published on {blog.date}</p>
        </div>

        {/* Edit and Delete Buttons Container (CONDITIONAL RENDERING) */}
        {isOwner && (
            <div 
                className={`absolute z-20 flex space-x-2 blog-action-buttons ${ 
                    isGrid 
                    ? 'top-2 right-2' 
                    : 'bottom-2 right-2' 
                }`}
            >
                
                {/* EDIT Button */}
                <button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent navigation
                      onEdit(blog);
                    }} 
                    className="p-2 text-white bg-indigo-500 rounded-full transition-colors duration-200 shadow-lg hover:bg-indigo-600"
                    aria-label={`Edit ${blog.title}`}
                >
                    <Pencil className="h-5 w-5" />
                </button>

                {/* DELETE Button */}
                <button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent navigation
                      onDelete(blog.id);
                    }}
                    className="p-2 text-white bg-red-500 rounded-full transition-colors duration-200 shadow-lg hover:bg-red-600"
                    aria-label={`Delete ${blog.title}`}
                >
                    <Trash2 className="h-5 w-5" />
                </button>
            </div>
        )}
    </Link>
  );
});

export default BlogCard;