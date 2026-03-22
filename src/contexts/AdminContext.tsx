import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface AdminContextType {
  isAdmin: boolean;
  setAdminRole: (email: string, isAdmin: boolean) => void;
  checkAdminAccess: (email: string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const ADMIN_EMAIL = "rohitkhobare2005@gmail.com";

  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const setAdminRole = (email: string, isAdminRole: boolean) => {
    const admins = JSON.parse(localStorage.getItem("admin_users") || "[]");
    const index = admins.findIndex((a: string) => a === email);
    if (isAdminRole && index === -1) {
      admins.push(email);
    } else if (!isAdminRole && index !== -1) {
      admins.splice(index, 1);
    }
    localStorage.setItem("admin_users", JSON.stringify(admins));
  };

  const checkAdminAccess = (email: string): boolean => {
    if (email === ADMIN_EMAIL) return true;
    const admins = JSON.parse(localStorage.getItem("admin_users") || "[]");
    return admins.includes(email);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, setAdminRole, checkAdminAccess }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
