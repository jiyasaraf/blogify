// blog-api/controllers/authController.js

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'Default_JWT_SECRET'; 

/**
 * Handles user registration.
 */
export const registerUser = async (req, res) => {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    
    try {
        // 1. Check if user already exists (Model call)
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists.' });
        }
        
        // 2. Hash password (Controller logic)
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // 3. Create new user (Model call)
        const user = await createUser(email, hashedPassword, name);
        
        // 4. Generate JWT token (Controller logic)
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.status(201).json({ 
            message: 'User registered successfully',
            token,
            user: { id: user.id, email: user.email, name: user.name }
        });
    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).json({ error: 'Failed to register user.' });
    }
};

/**
 * Handles user login.
 */
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    
    try {
        // 1. Find user by email (Model call)
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        
        // 2. Compare passwords (Controller logic)
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        
        // 3. Generate JWT token (Controller logic)
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, email: user.email, name: user.name }
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ error: 'Failed to login.' });
    }
};
