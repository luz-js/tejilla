'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '../types/auth';
import { LoginDto } from '../dtos/auth'; // We need to create this DTO on the frontend too
import { loginUser, registerUser } from '../services/authApi'; // We will create this service next
import { CreateUserDto } from '../dtos/user'; // Frontend DTO
import apiClient from '../services/apiClient';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (loginDto: LoginDto) => Promise<void>;
  register: (createUserDto: CreateUserDto) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading true to check for existing session

  useEffect(() => {
    // Check for token in localStorage on initial component mount
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');

    if (storedToken && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        // Clear storage if data is corrupted
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
    setLoading(false);
  }, []);

  const handleAuthResponse = (data: AuthResponse) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('authUser', JSON.stringify(data.user));
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  };

  const login = async (loginDto: LoginDto) => {
    const response = await loginUser(loginDto); // loginUser will call the API
    handleAuthResponse(response.data); // Assuming API response is { data: AuthResponse, message: string }
  };

  const register = async (createUserDto: CreateUserDto) => {
    // This will just register the user, not log them in automatically
    await registerUser(createUserDto);
    // You might want to automatically log them in after registration,
    // in which case you'd call login() here. For now, we keep it separate.
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    delete apiClient.defaults.headers.common['Authorization'];
    // Redirect to home or login page
    window.location.href = '/login';
  };

  const value = {
    isAuthenticated: !!token,
    user,
    token,
    loading,
    login,
    register,
    logout,
  };

  // Don't render children until loading is false to prevent flash of unauthenticated content
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// We also need to create the DTOs for the frontend.
// I'll create them in `src/dtos/` to mirror the backend structure.
