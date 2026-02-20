import { useContext } from "react";
import { AuthContext } from "./AuthContextValue";

// Hook for using auth context in components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
