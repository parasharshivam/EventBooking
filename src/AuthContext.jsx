import { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, registerUser as apiRegister } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = async (credentials) => {
    setError(null);
    const data = await apiLogin(credentials);
    // Expect backend to return at least a token; adjust keys as needed.
    const { token, ...rest } = data;
    if (token) {
      localStorage.setItem('authToken', token);
    }
    const userInfo = rest || null;
    if (userInfo) {
      localStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);
    }
    return data;
  };

  const handleRegister = async (payload) => {
    setError(null);
    return apiRegister(payload);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    setError,
    login: handleLogin,
    register: handleRegister,
    logout,
    isAuthenticated: !!user && !!localStorage.getItem('authToken'),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

