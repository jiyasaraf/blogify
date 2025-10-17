// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { useAuth } from '../hooks/AuthContext'; // Import the custom authentication hook

const Login = () => {
    // 1. Get login function from AuthContext
    const { login } = useAuth(); 

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const result = await login(formData.email, formData.password);
            
            if (!result.success) {
                throw new Error(result.error || 'Login failed. Please check your credentials.');
            }

            // Redirect to the blog page on successful login
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const StatusAlert = ({ message }) => {
        if (!message) return null;
        const baseClasses = "mt-4 p-4 rounded-xl shadow-md text-sm font-medium";
        const classes = `${baseClasses} bg-red-100 text-red-700`;
        return <div className={classes}>{message}</div>;
    };


    return (
        <div className="min-h-screen flex flex-col">
            <Header totalArticles={null} />
            
            <main className="flex-grow flex items-center justify-center bg-gray-50 p-4">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
                    <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
                        Log in to Access Features
                    </h2>
                    
                    <StatusAlert message={error} />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute h-5 w-5 text-indigo-400 left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    disabled={loading}
                                    className="block w-full rounded-lg border-gray-300 pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 transition border"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute h-5 w-5 text-indigo-400 left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Your Password"
                                    disabled={loading}
                                    className="block w-full rounded-lg border-gray-300 pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 transition border"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent 
                                        rounded-xl shadow-lg text-lg font-bold text-white transition duration-300 
                                        ${loading 
                                            ? 'bg-indigo-400 cursor-not-allowed' 
                                            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                        }`}
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Register Here
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Login;