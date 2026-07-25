/* eslint-disable */
import { createContext, useContext, useState, _useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, _setUser] = useState({ id: 1, name: 'Local User', email: 'local@localhost' });
  const [token, _setToken] = useState('local-token');
  const [loading, _setLoading] = useState(false);

  const login = async () => ({ token, user });
  const register = async () => ({ token, user });
  const logout = async () => {};
  const isAuthenticated = () => true;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
      }}
    >
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
