import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../context/useAuth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await loginAdmin(form.email, form.password);
    if (!result?.success) {
      setError(result?.message || "Invalid admin credentials");
      setLoading(false);
      return;
    }
    setLoading(false);
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e3f6ff] via-[#f7fbff] to-[#cfe9ff] pt-24 px-4">
      <div className="max-w-md mx-auto bg-white border border-sky-200 rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-5">
          <ShieldCheck className="w-7 h-7 text-sky-600" />
          <h1 className="text-2xl font-bold text-sky-700">Admin Login</h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className="mt-1 w-full border rounded-lg p-3"
              placeholder="admin@dhobi.in"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              className="mt-1 w-full border rounded-lg p-3"
              placeholder="••••••••"
              required
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <Button
            className="w-full bg-sky-600 hover:bg-sky-700 text-white"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-xs text-gray-500 mt-4">
          Demo credentials: admin@dhobi.in / admin123
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
