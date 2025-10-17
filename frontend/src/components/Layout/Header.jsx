// src/components/Layout/Header.jsx
import React from "react";
import { Link, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/AuthContext'; 

const Header = ({ totalArticles }) => {
    const { isAuthenticated, user, logout } = useAuth();
    const location = useLocation();
    const isMyBlogsPage = location.pathname === '/my-blogs';
// console.log(user);
    return (
        <header className="min-w-screen mx-auto pt-6 px-4 sm:px-6 lg:px-8 border-b border-gray-200 ">
            <div className="flex justify-start items-center pb-4 w-full">
                {/* Logo / Title Area */}
                <Link to="/" className="flex-shrink-0">
                    <h1 className="text-4xl font-extrabold text-gray-900 transition duration-150 hover:text-indigo-600">
                        The Custom Blog
                    </h1>
                </Link>

                {/* Auth Actions Area */}
                <div className="flex items-center space-x-4 ml-auto">
                    {isAuthenticated ? (
                        <>
                            <span className="text-lg font-semibold text-gray-700 hidden sm:block">
                                Welcome, {user.name||user.email}!
                            </span>
                            
                            <Link 
                                to="/my-blogs" 
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 font-medium text-sm"
                            >
                                My Blogs
                            </Link>

                            <button
                                onClick={logout}
                                className="flex items-center space-x-1 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-150 font-medium text-sm"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link 
                                to="/login" 
                                className="px-4 py-2 text-sm font-medium text-indigo-600 rounded-lg hover:text-indigo-800 transition duration-150"
                            >
                                Log In
                            </Link>

                            <Link 
                                to="/register" 
                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-indigo-700 transition duration-150"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Subtitle/Article Count Area */}
            {totalArticles !== null && !isMyBlogsPage && (
                <p className="text-lg text-gray-600 pb-4">
                    Viewing {totalArticles} articles, fetched from different sources.
                </p>
            )}
        </header>
    );
};

export default Header;
