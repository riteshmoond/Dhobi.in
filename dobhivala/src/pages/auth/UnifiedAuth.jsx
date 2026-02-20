import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const UnifiedAuth = () => {
  const navigate = useNavigate();
  const { loginCustomer, loginAdmin, signupCustomer } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [loginAs, setLoginAs] = useState("customer"); // "customer" or "admin"
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleLoginChange = (e) => {
    setLoginAs(e.target.value);
    setError("");
    setFormData({ email: "", password: "", confirmPassword: "", fullName: "" });
  };

  const validateForm = () => {
    if (!formData.email) {
      setError("Email is required");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (isSignup && !formData.fullName) {
      setError("Full name is required");
      return false;
    }
    if (isSignup && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (isSignup && formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (loginAs === "admin") {
        const result = await loginAdmin(formData.email, formData.password);
        if (!result?.success) {
          setError(result?.message || "Invalid admin credentials");
          setLoading(false);
          return;
        }
        setFormData({ email: "", password: "", confirmPassword: "", fullName: "" });
        setLoading(false);
        navigate("/admin");
      } else {
        if (isSignup) {
          const result = await signupCustomer(
            formData.email,
            formData.password,
            formData.fullName
          );
          if (!result?.success) {
            setError(result?.message || "Signup failed");
            setLoading(false);
            return;
          }
        } else {
          const result = await loginCustomer(formData.email, formData.password);
          if (!result?.success) {
            setError(result?.message || "Invalid email or password");
            setLoading(false);
            return;
          }
        }
        setFormData({ email: "", password: "", confirmPassword: "", fullName: "" });
        setLoading(false);
        navigate("/");
      }
    } catch {
      setError("Login failed. Please try again.");
      setLoading(false);
      return;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-2">
          dobhiWala
        </h1>
        <p className="text-gray-500 text-lg md:text-xl">
          Laundry Made Simple
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">
            {isSignup ? "Create a new account to get started" : "Sign in to your account to continue"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name - Only for signup */}
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="name@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          {/* Confirm Password - Only for signup */}
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Confirm your password"
              />
            </div>
          )}

          {/* Login As Dropdown - Only for login (non-signup) */}
          {!isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Login As
              </label>
              <div className="relative">
                <select
                  value={loginAs}
                  onChange={handleLoginChange}
                  className="w-full px-4 py-3 border-2 border-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 appearance-none bg-white cursor-pointer"
                >
                  <option value="customer">👤 Customer/Shopper</option>
                  <option value="admin">🔐 Admin</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none w-5 h-5" />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Sign In Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-yellow-400 text-base"
          >
            {loading ? "Processing..." : isSignup ? "Create Account" : "Sign In"}
          </Button>

          {/* Admin Demo Credentials - Show for admin login only */}
          {!isSignup && loginAs === "admin" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
              <p className="font-semibold text-blue-900 mb-2">Demo Credentials:</p>
              <p className="text-blue-800">
                <span className="font-mono">admin@dhobi.in</span>
              </p>
              <p className="text-blue-800">
                <span className="font-mono">admin123</span>
              </p>
            </div>
          )}
        </form>

        {/* Toggle Sign Up / Sign In */}
        {!isSignup ? (
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 mb-4">New to dobhiWala?</p>
            <Button
              type="button"
              onClick={() => {
                setIsSignup(true);
                setLoginAs("customer");
                setError("");
                setFormData({ email: "", password: "", confirmPassword: "", fullName: "" });
              }}
              className="w-full bg-white border-2 border-gray-300 text-gray-900 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors text-base"
            >
              Create Account
            </Button>
          </div>
        ) : (
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 mb-4">Already have an account?</p>
            <Button
              type="button"
              onClick={() => {
                setIsSignup(false);
                setError("");
                setFormData({ email: "", password: "", confirmPassword: "", fullName: "" });
              }}
              className="w-full bg-white border-2 border-gray-300 text-gray-900 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors text-base"
            >
              Sign In
            </Button>
          </div>
        )}

        {/* Terms */}
        <p className="text-center text-gray-500 text-xs mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default UnifiedAuth;
