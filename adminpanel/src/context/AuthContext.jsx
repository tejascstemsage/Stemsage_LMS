import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('admin_data');
    return stored ? JSON.parse(stored) : null;
  });

  // Stored admin_data says nothing about the token; a 401 here sends the user to /login
  // (axios interceptor) before they fill a form that would be rejected on save.
  useEffect(() => {
    if (admin) api.get('/admin/auth/me');
  }, []);

  const login = async (username, password) => {
    const { data } = await api.post('/admin/auth/login', { username, password });
    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_data', JSON.stringify(data.admin));
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_data');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
