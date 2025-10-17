// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { useAuth } from '../hooks/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await register(formData.email, formData.password, formData.name);
            
            if (!result.success) {
                throw new Error(result.error || 'Registration failed.');
            }

            setSuccess('Registration successful! Redirecting to login...');
            
            // Redirect user to the login page after a delay
            setTimeout(() => {
                navigate('/login');
            }, 1500);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const StatusAlert = ({ message, type }) => {
        if (!message) return null;
        const baseClasses = "mt-4 p-4 rounded-xl shadow-md text-sm font-medium";
        const classes = type === 'error' 
            ? `${baseClasses} bg-red-100 text-red-700` 
            : `${baseClasses} bg-green-100 text-green-700`;
        return <div className={classes}>{message}</div>;
    };


    return (
        <div className="min-h-screen flex flex-col">
            <Header totalArticles={null} /> {/* Passing null as totalArticles is not relevant here */}
            
            <main className="flex-grow flex items-center justify-center bg-gray-50 p-4">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
                    <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
                        Create Your Account
                    </h2>
                    
                    <StatusAlert message={error} type="error" />
                    <StatusAlert message={success} type="success" />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                            <div className="relative">
                                <User className="absolute h-5 w-5 text-indigo-400 left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your Name"
                                    disabled={loading}
                                    className="block w-full rounded-lg border-gray-300 pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 transition border"
                                />
                            </div>
                        </div>

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
                                    placeholder="Minimum 8 characters"
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
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Log In
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Register;