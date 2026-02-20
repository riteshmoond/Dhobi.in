import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const parseJwtPayload = (token) => {
  try {
    const parts = String(token || "").split(".");
    if (parts.length !== 3) return null;

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const AdminRoute = ({ children }) => {
  const { isAdminLoggedIn, token, logoutAdmin, loading } = useAuth();
  const [shouldLogout, setShouldLogout] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!isAdminLoggedIn || !token) {
      return;
    }

    const payload = parseJwtPayload(token);
    const nowSeconds = Math.floor(Date.now() / 1000);
    const isExpired = Number(payload?.exp || 0) <= nowSeconds;
    const isAdminToken = payload?.role === "admin";

    if (!payload || isExpired || !isAdminToken) {
      setShouldLogout(true);
    }
  }, [token, isAdminLoggedIn, loading]);

  useEffect(() => {
    if (shouldLogout) {
      logoutAdmin();
    }
  }, [shouldLogout, logoutAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdminLoggedIn || !token || shouldLogout) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default AdminRoute;
