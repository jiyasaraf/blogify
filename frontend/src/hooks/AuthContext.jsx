// src/hooks/AuthContext.jsx
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

const AuthContext = createContext(null);

// Helper function to decode the base64 part of the JWT and extract user data
const decodeToken =  (token) => {
    try {
        if (!token) return null;
        const payloadBase64 = token.split('.')[1];
        // Handle URL-safe base64 encoding (if necessary)
        const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = JSON.parse(atob(base64));
        // const user = 
        return {
            // name: decodedPayload.name,
            userId: decodedPayload.userId, // CRITICAL: This must match the post's user_id
            email: decodedPayload.email,
        };
    } catch (e) {
        console.error("Failed to decode token:", e);
        return null;
    }
};


export const AuthProvider = ({ children }) => {
    // Initialize state from localStorage on first load
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        const storedToken = localStorage.getItem('token');
        return storedToken ? decodeToken(storedToken) : null;
    });

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            setUser(decodeToken(token));
        } else {
            localStorage.removeItem('token');
            setUser(null);
        }
    }, [token]);

    const login = useCallback(async (email, password) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Login failed');
            }

            const data = await response.json();
            setToken(data.token);
            setUser(data.user);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }, []);

    const register = useCallback(async (email, password, name) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, name }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Registration failed');
            }

            const data = await response.json();
            setToken(data.token);
            setUser(data.user);
            return { success: true };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    }, []);

    const contextValue = useMemo(() => ({
        token,
        user,
        isAuthenticated: !!token,
        login,
        logout,
        register
    }), [token, user, login, logout, register]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};