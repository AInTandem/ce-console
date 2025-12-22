import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  getUsername: () => string | null;
  token: string | null;
}

const AUTH_TOKEN_STORAGE_KEY = 'authToken';
const AUTH_USER_STORAGE_KEY = 'authUser';

// Helper function to set auth token and user data
const setAuthData = (token: string, user: User): void => {
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
};

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
};

// Helper function to get user data
const getAuthUser = (): User | null => {
  const userData = localStorage.getItem(AUTH_USER_STORAGE_KEY);
  return userData ? JSON.parse(userData) : null;
};

// Helper function to clear auth
const clearAuth = (): void => {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_USER_STORAGE_KEY);
};

// Create the context with a default function for isAuthenticated
// This will be overridden by the provider
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  getUsername: () => null,
  token: null
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(getAuthToken());

  // Update the context value when authentication status changes
  useEffect(() => {
    // This will check authentication status on mount and when storage changes
    const eventHandler = () => {
      // Refresh token from storage
      const currentToken = getAuthToken();

      setToken(currentToken);
    };

    window.addEventListener('storage', eventHandler);
    return () => window.removeEventListener('storage', eventHandler);
  }, []);

  const login = (token: string, user: User): void => {
    setAuthData(token, user);
    setToken(token);
  };

  const logout = () => {
    clearAuth();
    setToken(null);
  };

  const getUsername = (): string | null => {
    const authUser = getAuthUser();
    return authUser?.username || null;
  };

  // Define the context value object with dynamic authentication status
  const contextValue: AuthContextType = {
    isAuthenticated: !!token,
    login,
    logout,
    getUsername,
    token
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};