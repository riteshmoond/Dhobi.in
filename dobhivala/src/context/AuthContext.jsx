import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContextValue";
import { apiFetch } from "../lib/apiClient";

export const AuthProvider = ({ children }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [customerToken, setCustomerToken] = useState(null);
  const [adminToken, setAdminToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const CUSTOMER_STORAGE_KEY = "dobhivala_customer_auth";
  const CUSTOMER_TOKEN_KEY = "dobhivala_customer_token";
  const ADMIN_STORAGE_KEY = "dobhivala_admin_auth";
  const ADMIN_TOKEN_KEY = "dobhivala_admin_token";
  const LEGACY_USER_STORAGE_KEY = "dobhivala_user_auth";
  const LEGACY_TOKEN_KEY = "dobhivala_auth_token";

  const clearCustomerState = () => {
    localStorage.removeItem(CUSTOMER_STORAGE_KEY);
    localStorage.removeItem(CUSTOMER_TOKEN_KEY);
    localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    setUser(null);
    setCustomerToken(null);
  };

  const clearAdminState = () => {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    setAdmin(null);
    setAdminToken(null);
  };

  const setCustomerSession = (sessionUser, sessionToken) => {
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(sessionUser));
    localStorage.setItem(CUSTOMER_TOKEN_KEY, sessionToken);
    setUser(sessionUser);
    setCustomerToken(sessionToken);
  };

  const setAdminSession = (sessionUser, sessionToken) => {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(sessionUser));
    localStorage.setItem(ADMIN_TOKEN_KEY, sessionToken);
    setAdmin(sessionUser);
    setAdminToken(sessionToken);
  };

  useEffect(() => {
    const storedCustomer = localStorage.getItem(CUSTOMER_STORAGE_KEY);
    const storedCustomerToken = localStorage.getItem(CUSTOMER_TOKEN_KEY);
    const storedAdmin = localStorage.getItem(ADMIN_STORAGE_KEY);
    const storedAdminToken = localStorage.getItem(ADMIN_TOKEN_KEY);

    if (storedCustomer && storedCustomerToken) {
      try {
        const parsedCustomer = JSON.parse(storedCustomer);
        if (parsedCustomer?.role === "customer") {
          setUser(parsedCustomer);
          setCustomerToken(storedCustomerToken);
        }
      } catch {
        clearCustomerState();
      }
    }

    if (storedAdmin && storedAdminToken) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);
        if (parsedAdmin?.role === "admin") {
          setAdmin(parsedAdmin);
          setAdminToken(storedAdminToken);
        }
      } catch {
        clearAdminState();
      }
    }

    setLoading(false);
  }, []);

  const token = location.pathname.startsWith("/admin")
    ? adminToken || customerToken
    : customerToken || adminToken;

  const signupCustomer = async (email, password, fullName) => {
    let result;
    try {
      result = await apiFetch("/auth/signup", {
        method: "POST",
        body: { email, password, fullName },
      });
    } catch {
      return {
        success: false,
        message: "Unable to connect to server",
      };
    }

    if (!result.success || !result.data?.user || !result.data?.token) {
      return {
        success: false,
        message: result.message || "Signup failed",
      };
    }

    setCustomerSession(result.data.user, result.data.token);
    return { success: true };
  };

  const loginCustomer = async (email, password) => {
    let result;
    try {
      result = await apiFetch("/auth/login", {
        method: "POST",
        body: { email, password },
      });
    } catch {
      return {
        success: false,
        message: "Unable to connect to server",
      };
    }

    if (!result.success || !result.data?.user || !result.data?.token) {
      return {
        success: false,
        message: result.message || "Login failed",
      };
    }

    setCustomerSession(result.data.user, result.data.token);
    return { success: true };
  };

  const logoutCustomer = () => {
    clearCustomerState();
  };

  const loginAdmin = async (email, password) => {
    let result;
    try {
      result = await apiFetch("/auth/admin/login", {
        method: "POST",
        body: { email, password },
      });
    } catch {
      return {
        success: false,
        message: "Unable to connect to server",
      };
    }

    if (!result.success || !result.data?.user || !result.data?.token) {
      return {
        success: false,
        message: result.message || "Admin login failed",
      };
    }

    setAdminSession(result.data.user, result.data.token);
    return { success: true };
  };

  const logoutAdmin = () => {
    clearAdminState();
  };

  const isUserLoggedIn = !!user && !!customerToken;
  const isAdminLoggedIn = !!admin && !!adminToken;

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        token,
        loading,
        isUserLoggedIn,
        isAdminLoggedIn,
        signupCustomer,
        loginCustomer,
        logoutCustomer,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
