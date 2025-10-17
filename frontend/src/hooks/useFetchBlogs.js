// src/hooks/useFetchBlogs.js
import { useState, useEffect } from "react";
import { BLOGS_PER_PAGE } from "../config/constants"; 

// Now accepts the current page number and the refresh trigger
export const useFetchBlogs = (url, currentPage, refreshTrigger) => {
  const [data, setData] = useState({ 
    blogs: [], 
    totalCount: 0, 
    totalPages: 1 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Construct the API URL with pagination query parameters
    const apiUrlWithPagination = `${url}?page=${currentPage}&limit=${BLOGS_PER_PAGE}`;
    console.log("fetch " + apiUrlWithPagination);
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(apiUrlWithPagination);
        console.log(response.json);
        
        if (!response.ok) {
          const errorDetail = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
          throw new Error(`API error: ${errorDetail.error || response.statusText}`);
        }

        const json = await response.json();
        console.log("My respo " + json)
        
        // --- CORRECTED DATA STRUCTURE MAPPING ---
        const mappedBlogs = json.blogs.map((blog) => ({
          id: blog.id,
          title: blog.title || "Untitled Post",
          description: blog.description || "No description available.",
          content: blog.content, 
          // Map the database's 'author_id' to the frontend's expected 'user_id'
          user_id: blog.user_id, 
            username: blog.username || "Anonymous", 
          imageUrl:
            // Ensure image_url is properly formatted with the API URL if it's a relative path
            (blog.image_url && !blog.image_url.startsWith('http') && !blog.image_url.startsWith('data:'))
              ? `${url.split('/api')[0]}${blog.image_url}`
              : blog.image_url ||
                `https://placehold.co/400x250/3730a3/ffffff?text=${blog.title || "Blog Post"}`,
          category: "User Generated",
          date: blog.created_at
            ? new Date(blog.created_at).toLocaleDateString()
            : "Date Unknown",

        }));
        console.log(mappedBlogs);

        setData({
            blogs: mappedBlogs,
            totalCount: json.totalCount,
            totalPages: json.totalPages
        });

      } catch (e) {
        console.error("Fetching error:", e);
        setError(`Failed to load blog posts: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [url, currentPage, refreshTrigger]);

  return { data, loading, error, refetch: () => setData(prev => ({ ...prev })) };
};