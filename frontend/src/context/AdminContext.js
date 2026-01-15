import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('admin_token'));

  useEffect(() => {
    verifyAdmin();
  }, [adminToken]);

  const verifyAdmin = async () => {
    if (!adminToken) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      await axios.get(`${API}/admin/verify`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setIsAdmin(true);
    } catch (error) {
      setIsAdmin(false);
      localStorage.removeItem('admin_token');
      setAdminToken(null);
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (email, password) => {
    const response = await axios.post(`${API}/admin/login`, { email, password });
    const token = response.data.token;
    localStorage.setItem('admin_token', token);
    setAdminToken(token);
    setIsAdmin(true);
    return response.data;
  };

  const adminLogout = () => {
    localStorage.removeItem('admin_token');
    setAdminToken(null);
    setIsAdmin(false);
  };

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${adminToken}` }
  });

  return (
    <AdminContext.Provider value={{
      isAdmin,
      loading,
      adminToken,
      adminLogin,
      adminLogout,
      getAuthHeaders
    }}>
      {children}
    </AdminContext.Provider>
  );
};
