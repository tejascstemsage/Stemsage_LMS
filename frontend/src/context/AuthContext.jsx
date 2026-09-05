import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [school, setSchool] = useState(() => {
    const stored = localStorage.getItem('school_data');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const { data } = await api.post('/school/auth/login', { email, password });
    localStorage.setItem('school_token', data.token);
    localStorage.setItem('school_data', JSON.stringify(data.school));
    setSchool(data.school);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('school_token');
    localStorage.removeItem('school_data');
    setSchool(null);
  };

  return (
    <AuthContext.Provider value={{ school, login, logout, isAuthenticated: !!school }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
