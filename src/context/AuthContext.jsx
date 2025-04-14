import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../utils/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        if (token) {
            fetchCartCount();
        }
    }, []);

    const fetchCartCount = async () => {
        try {
            const response = await axiosInstance.get('/cart');
            if (response.data.success) {
                const count = response.data.cart?.products?.length || 0;
                setCartCount(count);
            }
        } catch (error) {
            console.error('Error fetching cart count:', error);
            setCartCount(0);
        }
    };

    const login = () => {
        setIsAuthenticated(true);
        fetchCartCount();
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setCartCount(0);
    };

    const updateCartCount = () => {
        fetchCartCount();
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            cartCount,
            login,
            logout,
            updateCartCount
        }}>
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