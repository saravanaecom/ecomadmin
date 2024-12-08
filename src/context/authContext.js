import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for authentication
const AuthContext = createContext(null);

// Custom hook to access the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component that provides authentication state
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticatedName, setIsAuthenticatedName] = useState('');

  // Use useEffect to check authentication status on component mount
  useEffect(() => {
    const userLogin = localStorage.getItem('userLogin') === 'true';  // Check if user is logged in
    const userName = localStorage.getItem('userName');  // Get the encoded username
    setIsAuthenticated(userLogin);
    if (userName) {
      setIsAuthenticatedName((userName));  // Decode username from base64 if exists
    }
  }, []);

  // Function to log in the user
  const userLogin = (username) => {
    setIsAuthenticated(true);
    localStorage.setItem('userLogin', 'true'); 
    localStorage.setItem('userName', (username)); 
  };

  
  const userLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('userLogin');
    localStorage.removeItem('userName');
  };

  // Provide the authentication values to the context
  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      setIsAuthenticated, 
      isAuthenticatedName, 
      setIsAuthenticatedName, 
      userLogin, 
      userLogout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
