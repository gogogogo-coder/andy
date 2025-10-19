
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import * as api from '../services/api';

export interface LoginCredentials {
  email: string;
  password?: string;
}
export type RegisterData = Required<Pick<User, 'name' | 'email' | 'phone' | 'password'>>;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      // Check for a user session in localStorage
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const fetchedUser = await api.getUserById(userId);
          setUser(fetchedUser);
        } catch (error) {
          console.error("Session restore failed:", error);
          localStorage.removeItem('userId'); // Clear invalid session
        }
      }
      setIsLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const loggedInUser = await api.login(credentials);
    setUser(loggedInUser);
    localStorage.setItem('userId', loggedInUser._id);
  };

  const register = async (data: RegisterData) => {
    const newUser = await api.register(data);
    setUser(newUser);
    localStorage.setItem('userId', newUser._id);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
  };

  const value = { user, isLoading, login, register, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
