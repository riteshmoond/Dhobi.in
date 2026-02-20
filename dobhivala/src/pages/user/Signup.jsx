import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("authUser", JSON.stringify(form.email));
    alert("Signup successful!");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-600 to-sky-400 px-4">
      <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-xl overflow-hidden w-full max-w-4xl">
        
        {/* LEFT SIDE */}
        <div className="md:w-1/2 bg-gradient-to-b from-blue-700 to-blue-500 text-white p-10 flex flex-col justify-center items-center">
          <div className="text-center">
            <div className="bg-white/20 p-4 rounded-full inline-block mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-2">Welcome to dobhiWala</h2>
            <p className="text-white/80 text-sm">
              Get your clothes cleaned, folded, and delivered with just one click.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Create your account</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border-b border-gray-300 focus:border-sky-500 outline-none py-2"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">E-mail Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border-b border-gray-300 focus:border-sky-500 outline-none py-2"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border-b border-gray-300 focus:border-sky-500 outline-none py-2"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex items-center text-sm text-gray-500">
              <input type="checkbox" className="mr-2 accent-sky-500" required />
              By signing up, I agree to the{" "}
              <span className="text-sky-500 ml-1 cursor-pointer">Terms & Conditions</span>
            </div>

            <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-lg">
              Sign Up
            </Button>

            <p className="text-center text-sm text-gray-500 mt-3">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-sky-600 cursor-pointer font-medium"
              >
                Sign In
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
