import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import { useAuth } from "../../context/useAuth";
import { Button } from "@/components/ui/button";

const CUSTOMER_COPY = [
  "Doorstep pickup and delivery in minutes",
  "Live order tracking with secure checkout",
  "Fabric-safe wash, steam, and dry clean care",
];

const TRUST_STATS = [
  { label: "On-time deliveries", value: "99.2%" },
  { label: "Premium garment care", value: "24x7" },
  { label: "Happy households", value: "12k+" },
];

const INITIAL_FORM = {
  email: "",
  password: "",
  confirmPassword: "",
  fullName: "",
};

const UnifiedAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginCustomer, loginAdmin, signupCustomer } = useAuth();

  const [isSignup, setIsSignup] = useState(false);
  const [loginAs, setLoginAs] = useState("customer");
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const customerRedirectPath =
    typeof location.state?.from === "string" ? location.state.from : "/";
  const customerRedirectState = location.state?.checkoutState;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleLoginChange = (nextRole) => {
    setLoginAs(nextRole);
    setIsSignup(false);
    resetForm();
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!formData.password) {
      setError("Password is required");
      return false;
    }

    if (isSignup && !formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }

    if (isSignup && formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (isSignup && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

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

        resetForm();
        setLoading(false);
        navigate("/admin");
        return;
      }

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

      resetForm();
      setLoading(false);
      navigate(customerRedirectPath, {
        replace: true,
        state: customerRedirectState,
      });
    } catch {
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  const heading = isSignup ? "Create your premium laundry account" : "Welcome back";
  const subheading =
    loginAs === "admin"
      ? "Secure admin access for operations, pricing, and order control."
      : isSignup
        ? "Join Dhobi.in to book faster, track orders, and manage pickups with ease."
        : "Sign in to continue with your orders, cart, and saved details.";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4f8fb] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(3,105,161,0.14),transparent_28%),linear-gradient(135deg,#f7fbff_0%,#eef7fb_50%,#fdfdf8_100%)]" />
      <div className="absolute left-8 top-8 h-40 w-40 rounded-full bg-white/50 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 md:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-white/70 bg-white/70 shadow-[0_30px_100px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative hidden min-h-[760px] overflow-hidden bg-[linear-gradient(160deg,#0f4c81_0%,#0c6ca2_44%,#3cc7d8_100%)] p-8 text-white lg:flex lg:flex-col lg:justify-between xl:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.28),transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.2),transparent_20%)]" />

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/18 shadow-lg ring-1 ring-white/20">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/70">Dhobi.in</p>
                    <h1 className="font-serif text-3xl font-semibold tracking-wide">
                      Premium Care Access
                    </h1>
                  </div>
                </div>
              </div>

              <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur">
                Secure customer and admin portal
              </div>
            </div>

            <div className="relative z-10 max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-sm text-white/90">
                <ShieldCheck className="h-4 w-4" />
                Verified delivery workflow
              </div>
              <h2 className="max-w-lg font-serif text-5xl font-semibold leading-[1.05]">
                Clothing care that feels as polished as the experience.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/82">
                Book pickups, review premium service rates, manage your account, and keep every order organized in one elegant flow.
              </p>

              <div className="mt-8 grid gap-3">
                {CUSTOMER_COPY.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/16 bg-white/10 px-4 py-3 backdrop-blur-sm"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-200" />
                    <p className="text-sm text-white/92">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 grid gap-4 xl:grid-cols-3">
              {TRUST_STATS.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-white/16 bg-white/10 px-5 py-5 backdrop-blur-sm"
                >
                  <p className="text-3xl font-semibold tracking-tight">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-white/75">{item.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="flex min-h-[760px] flex-col justify-center bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,251,255,0.96))] px-5 py-8 sm:px-8 lg:px-10 xl:px-14">
            <div className="mx-auto w-full max-w-xl">
              <div className="mb-8 lg:hidden">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-sky-600">Dhobi.in</p>
                    <h1 className="font-serif text-3xl font-semibold text-slate-900">
                      Premium Access
                    </h1>
                  </div>
                </div>
              </div>

              <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-700">
                    {loginAs === "admin" ? "Admin Console" : "Customer Account"}
                  </p>
                  <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-slate-900">
                    {heading}
                  </h2>
                  <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">{subheading}</p>
                </div>

                <div className="rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleLoginChange("customer")}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        loginAs === "customer"
                          ? "bg-slate-900 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      Customer
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLoginChange("admin")}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        loginAs === "admin"
                          ? "bg-slate-900 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      Admin
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-6">
                <div className="mb-6 flex items-center justify-between gap-3 rounded-[22px] bg-slate-50 p-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignup(false);
                      resetForm();
                    }}
                    className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      !isSignup
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    disabled={loginAs === "admin"}
                    onClick={() => {
                      setIsSignup(true);
                      setLoginAs("customer");
                      resetForm();
                    }}
                    className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      isSignup
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    } ${loginAs === "admin" ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    Create Account
                  </button>
                </div>

                {loginAs === "admin" && (
                  <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    <p className="font-semibold">Admin access is sign-in only.</p>
                    <p className="mt-1 text-amber-800/90">
                      Use your secure admin credentials to enter the control panel.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignup && (
                    <Field
                      label="Full Name"
                      icon={UserRound}
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                    />
                  )}

                  <Field
                    label="Email Address"
                    icon={Mail}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    autoComplete="email"
                  />

                  <PasswordField
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    visible={showPassword}
                    onToggle={() => setShowPassword((prev) => !prev)}
                    placeholder={loginAs === "admin" ? "Enter admin password" : "Enter your password"}
                    autoComplete={isSignup ? "new-password" : "current-password"}
                  />

                  {isSignup && (
                    <PasswordField
                      label="Confirm Password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      visible={showConfirmPassword}
                      onToggle={() => setShowConfirmPassword((prev) => !prev)}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                    />
                  )}

                  {error && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="group mt-2 h-13 w-full rounded-2xl bg-[linear-gradient(135deg,#0f4c81_0%,#0c6ca2_55%,#22c7d6_100%)] text-base font-semibold text-white shadow-[0_16px_35px_rgba(12,108,162,0.28)] transition hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(12,108,162,0.35)] disabled:opacity-70"
                  >
                    {loading
                      ? "Please wait..."
                      : isSignup
                        ? "Create Account"
                        : loginAs === "admin"
                          ? "Enter Admin Console"
                          : "Continue to Dhobi.in"}
                    {!loading && <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5" />}
                  </Button>

                  {!isSignup && loginAs === "admin" && (
                    <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-4 text-sm text-sky-900">
                      <p className="font-semibold">Demo credentials</p>
                      <div className="mt-2 space-y-1 font-mono text-xs sm:text-sm">
                        <p>admin@dhobi.in</p>
                        <p>admin123</p>
                      </div>
                    </div>
                  )}
                </form>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Fast Booking</p>
                    <p className="mt-2 text-sm font-semibold text-slate-800">One-tap pickup scheduling</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Protected</p>
                    <p className="mt-2 text-sm font-semibold text-slate-800">Secure account and token flow</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Tracking</p>
                    <p className="mt-2 text-sm font-semibold text-slate-800">Live order updates after login</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 px-1 text-sm text-slate-500">
                <p>By continuing, you agree to our Terms and Privacy Policy.</p>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="inline-flex items-center gap-1 font-medium text-sky-700 transition hover:text-sky-900"
                >
                  Back to home
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const Field = ({
  label,
  icon: Icon,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
}) => (
  <label className="block">
    <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-sky-400 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(56,189,248,0.12)]">
      <Icon className="h-5 w-5 shrink-0 text-slate-400" />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
      />
    </div>
  </label>
);

const PasswordField = ({
  label,
  name,
  value,
  onChange,
  visible,
  onToggle,
  placeholder,
  autoComplete,
}) => (
  <label className="block">
    <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-sky-400 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(56,189,248,0.12)]">
      <LockKeyhole className="h-5 w-5 shrink-0 text-slate-400" />
      <input
        type={visible ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
      />
      <button
        type="button"
        onClick={onToggle}
        className="text-slate-400 transition hover:text-slate-700"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  </label>
);

export default UnifiedAuth;
