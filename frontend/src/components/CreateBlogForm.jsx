// src/components/CreateBlogForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, FileText, Type, UploadCloud, X, Trash2, Image } from 'lucide-react';
import { API_URL } from '../config/constants';

// --- Helper Components ---

const InputField = ({ label, name, Icon, type = "text", placeholder, value, onChange, isSubmitting }) => (
    <div className="relative">
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
        <div className="relative rounded-lg shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pt-6">
                <Icon className="h-5 w-5 text-indigo-400" aria-hidden="true" />
            </div>
            <input
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={name === 'title' || name === 'content'}
                disabled={isSubmitting}
                className="block w-full rounded-lg border-gray-300 pl-10 pr-4 py-3 
                            text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 
                            transition duration-150 ease-in-out border"
            />
        </div>
    </div>
);

const ModalHeader = ({ title, onClose }) => (
    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h3 className="text-2xl font-extrabold text-gray-900">{title}</h3>
        <button
            onClick={() => onClose(false)}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
        >
            <X className="h-6 w-6" />
        </button>
    </div>
);

// --- Main Component (Now accepts `token` prop) ---

const CreateBlogForm = ({ onClose, editingBlog, token }) => {
    // Determine if we are creating or editing
    const isEditing = !!editingBlog;

    const [formData, setFormData] = useState({
        title: editingBlog?.title || '',
        description: editingBlog?.description || '',
        content: editingBlog?.content || '',
        // The image_url is the current public URL, used for preview/deletion logic
        currentImageUrl: editingBlog?.imageUrl || null, 
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [clearImageFlag, setClearImageFlag] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [formDisabled, setFormDisabled] = useState(false);

    const fileInputRef = useRef(null);

    // Dynamic state for submit button text
    const submitText = isEditing ? 'Save Changes' : 'Create Post';
    const isImageClearing = isEditing && clearImageFlag;

    useEffect(() => {
        // Clear status messages when form state changes
        setError(null);
        setSuccess(null);
    }, [formData]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
            // If user selects a new image, they implicitly cancel the "clear image" action
            setClearImageFlag(false); 
        }
    };

    const handleClearImage = () => {
        if (isEditing && formData.currentImageUrl) {
            // In edit mode, set flag to nullify image_url on backend
            setClearImageFlag(true); 
            setSelectedImage(null);
            // Clear file input if there was a new image selected
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            // Ensure form remains enabled after image removal
            setFormDisabled(false);
        } else {
            // In create mode or if no current image, just clear the local state
            setSelectedImage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        // 1. Prepare Request Data (Use FormData for file uploads)
        const formPayload = new FormData();
        formPayload.append('title', formData.title);
        formPayload.append('description', formData.description);
        formPayload.append('content', formData.content);

        if (selectedImage) {
            formPayload.append('image', selectedImage);
        }
        
        // Explicitly handle image removal - ensure clear_image flag is set correctly
        if (isEditing) {
            // Always send the clear_image flag in edit mode
            formPayload.append('clear_image', clearImageFlag ? 'true' : 'false');
            console.log(`Image status: ${clearImageFlag ? 'Removing image' : 'Keeping current image'}`);
        }

        // 2. Determine API endpoint and method
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `${API_URL}/${editingBlog.id}` : API_URL;

        // 3. Define Headers (Crucial: JWT is included here)
        // NOTE: Do NOT manually set Content-Type to multipart/form-data. 
        // The browser sets the correct header and boundary when using FormData.
        const headers = {
            'Authorization': `Bearer ${token}`, // <-- JWT token included here
        };

        try {
            const response = await fetch(url, {
                method: method,
                // Don't set 'Content-Type' manually
                headers: headers,
                body: formPayload,
            });

            const responseData = await response.json();

            if (!response.ok) {
                // Handle 401 (Unauthorised) or 403 (Forbidden/Not Owner) errors
                if (response.status === 401 || response.status === 403) {
                     throw new Error(responseData.error || "Authorization failed. Please ensure you are logged in and own this post.");
                }
                throw new Error(responseData.error || `Failed to ${isEditing ? 'update' : 'create'} post.`);
            }

            setSuccess(`Post successfully ${isEditing ? 'updated' : 'created'}! Closing form...`);
            
            // Close modal and refresh the list after a delay
            setTimeout(() => {
                onClose(true); // Pass true to signal the parent component to refresh
            }, 1000);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const StatusAlert = () => {
        if (error) {
            return (
                <div className="mt-4 p-4 rounded-xl shadow-md text-sm font-medium bg-red-100 text-red-700">
                    <p>Error: {error}</p>
                </div>
            );
        }
        if (success) {
            return (
                <div className="mt-4 p-4 rounded-xl shadow-md text-sm font-medium bg-green-100 text-green-700">
                    <p>{success}</p>
                </div>
            );
        }
        return null;
    };

    // Determine which image to preview
    const imagePreviewUrl = selectedImage 
        ? URL.createObjectURL(selectedImage) 
        : (isEditing && formData.currentImageUrl && !clearImageFlag ? formData.currentImageUrl : null);


    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all max-h-[90vh] overflow-y-auto">
                
                <div className="p-6 sm:p-8 space-y-6">
                    <ModalHeader 
                        title={isEditing ? 'Edit your post' : 'Create New Blog Post'} 
                        onClose={onClose} 
                    />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Title */}
                       <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
  <div className="relative">
    <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
    <input
      type="text"
      name="title"
      placeholder="A compelling title for your post"
      value={formData.title}
      onChange={handleChange}
      disabled={isSubmitting}
      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
</div>


                        {/* Description (Optional) */}
                        <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Short Description (Optional)
  </label>
  <div className="relative">
    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
    <input
      type="text"
      name="description"
      placeholder="A brief summary for card view"
      value={formData.description}
      onChange={handleChange}
      disabled={isSubmitting}
      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
</div>


                        {/* Image Upload/Preview */}
                        <div className="border p-4 rounded-lg bg-gray-50">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Featured Image (Optional)</label>
                            
                            <input
                                ref={fileInputRef}
                                type="file"
                                name="image"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                                disabled={isSubmitting || formDisabled}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                            />

                            {imagePreviewUrl && (
                                <div className="mt-4 p-3 bg-white border rounded-lg flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <Image className="h-6 w-6 text-indigo-500" />
                                        <p className="text-sm font-medium text-gray-800">
                                            {selectedImage ? selectedImage.name : "Current Image"}
                                        </p>
                                        <img src={imagePreviewUrl} alt="Preview" className="h-10 w-10 object-cover rounded-md" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleClearImage}
                                        disabled={isSubmitting}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded-full transition"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            )}

                             {/* Hidden Message for Image Deletion */}
                             {isEditing && clearImageFlag && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <Trash2 className="h-4 w-4 mr-1"/> Current image marked for deletion upon save.
                                </p>
                             )}
                        </div>
                        
                        {/* Content */}
                        <div>
                            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-1">Content</label>
                            <textarea
                                name="content"
                                id="content"
                                rows="8"
                                value={formData.content}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                                placeholder="Write the full content of your amazing blog post here..."
                                className="block w-full rounded-lg border-gray-300 px-4 py-3 
                                           text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 
                                           transition duration-150 ease-in-out border shadow-sm"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent 
                                        rounded-xl shadow-lg text-lg font-bold text-white transition duration-300 
                                        ${isSubmitting 
                                            ? 'bg-indigo-400 cursor-not-allowed' 
                                            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                        }`}
                        >
                            <Send className="mr-3 h-5 w-5" />
                            {isSubmitting 
                                ? (isEditing ? 'Saving...' : 'Posting...') 
                                : submitText
                            }
                        </button>
                    </form>
                    <StatusAlert />
                </div>
            </div>
        </div>
    );
};

export default CreateBlogForm;