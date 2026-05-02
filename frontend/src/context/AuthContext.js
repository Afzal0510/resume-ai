import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [pendingResumeFile, setPendingResumeFile] = useState(null);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setPendingResumeFile(null);
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      user,
      login,
      logout,
      pendingResumeFile,
      setPendingResumeFile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
