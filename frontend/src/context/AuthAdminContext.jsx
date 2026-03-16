import React, { createContext, useEffect, useState } from "react";

export const AuthAdminContext = createContext();

const AuthAdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    if (storedUser){
      setAdmin(JSON.parse(storedUser));
      setRole(storedRole);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    < AuthAdminContext.Provider
      value={{
        admin,
        setAdmin,
        setRole,
        role,
        isAuthenticated,
        loading,
        error,
        setLoading,
        setError,
      }}
    >
      {children}
    </ AuthAdminContext.Provider>
  );
};

export default  AuthAdminProvider;
