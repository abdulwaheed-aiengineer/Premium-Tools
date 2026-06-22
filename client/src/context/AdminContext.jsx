import { createContext, useContext, useState, useEffect } from 'react';
import { adminAuthService } from '../services/adminService';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('pt_admin');
    const token = localStorage.getItem('pt_admin_token');
    if (stored && token) {
      try {
        setAdmin(JSON.parse(stored));
      } catch {
        localStorage.removeItem('pt_admin');
        localStorage.removeItem('pt_admin_token');
      }
    }
    setLoading(false);
  }, []);

  const loginAdmin = async (email, password) => {
    const data = await adminAuthService.login(email, password);
    localStorage.setItem('pt_admin_token', data.token);
    localStorage.setItem('pt_admin', JSON.stringify(data.admin));
    setAdmin(data.admin);
    return data;
  };

  const logoutAdmin = () => {
    localStorage.removeItem('pt_admin_token');
    localStorage.removeItem('pt_admin');
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, loading, loginAdmin, logoutAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
