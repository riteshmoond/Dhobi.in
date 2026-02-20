import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("authUser"); // check login
  if (!user) {
    // agar login nahi hai to login page par bhej do
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
