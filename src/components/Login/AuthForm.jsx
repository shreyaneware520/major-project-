import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function AuthForm({ mode, setMode }) {
  const { signup, login, loginWithGoogle } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Real-time password strength requirements (signup mode)
  const passwordRequirements = useMemo(() => {
    const pwd = formData.password;
    return [
      { label: "At least 8 characters", met: pwd.length >= 8 },
      { label: "One uppercase letter (A–Z)", met: /[A-Z]/.test(pwd) },
      { label: "One lowercase letter (a–z)", met: /[a-z]/.test(pwd) },
      { label: "One number (0–9)", met: /[0-9]/.test(pwd) },
      { label: "One special character (@#$%&!*)", met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pwd) },
      { label: "No leading or trailing spaces", met: pwd.length > 0 && pwd === pwd.trim() },
    ];
  }, [formData.password]);

  const isPasswordStrong = passwordRequirements.every((r) => r.met);
  const doPasswordsMatch =
    formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword;
  const isSignupDisabled =
    mode === "signup" && (!isPasswordStrong || !doPasswordsMatch);

  const [prevMode, setPrevMode] = useState(mode);
  if (mode !== prevMode) {
    setPrevMode(mode);
    setErrors({});
    setAuthError(null);
    setSuccessMessage(null);
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    });
  }

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "fullName":
        if (mode === "signup") {
          if (!value.trim()) {
            error = "Full Name is required";
          } else if (value.trim().length < 3) {
            error = "Name must be at least 3 characters";
          }
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email address is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "phoneNumber":
        if (mode === "signup" && value.trim()) {
          if (!/^\+?[0-9]{7,15}$/.test(value.replace(/[\s-]/g, ""))) {
            error = "Enter a valid phone number";
          }
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (mode === "signup") {
          if (value.length < 8) {
            error = "Password must be at least 8 characters";
          } else if (!/[A-Z]/.test(value)) {
            error = "Password must include an uppercase letter";
          } else if (!/[a-z]/.test(value)) {
            error = "Password must include a lowercase letter";
          } else if (!/[0-9]/.test(value)) {
            error = "Password must include a number";
          } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(value)) {
            error = "Password must include a special character";
          }
        } else if (mode === "login" && value.length < 6) {
          error = "Password must be at least 6 characters";
        }
        break;
      case "confirmPassword":
        if (mode === "signup") {
          if (!value) {
            error = "Confirm Password is required";
          } else if (value !== formData.password) {
            error = "Passwords do not match";
          }
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (authError) {
      setAuthError("");
    }
  };

  const getFriendlyErrorMessage = (error) => {
    const code = error?.code || "";
    switch (code) {
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Invalid email or password. Please verify your credentials and try again.";
      case "auth/email-already-in-use":
        return "Email already exists.";
      case "auth/too-many-requests":
        return "Access temporarily blocked due to multiple failed attempts. Please try again in a few minutes.";
      case "auth/user-disabled":
        return "This user account has been disabled. Please contact your facility administrator.";
      case "auth/invalid-email":
        return "Please provide a valid work email address format.";
      case "auth/network-request-failed":
        return "Network error. Please check your internet connection and try again.";
      case "auth/operation-not-allowed":
        return "Email/password authentication is currently disabled in your Firebase console.";
      default:
        return error?.message || "Something went wrong. Please try again.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setSuccessMessage(null);
    const newErrors = {};

    const fieldsToValidate =
      mode === "signup"
        ? ["fullName", "email", "phoneNumber", "password", "confirmPassword"]
        : ["email", "password"];

    fieldsToValidate.forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (mode === "signup") {
        const firstErrorMsg = Object.values(newErrors)[0];
        toast.error("Registration Error", firstErrorMsg);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "login") {
        const res = await login(formData.email, formData.password, rememberDevice);
        const role = res?.role || "user";
        if (role === "admin") {
          navigate("/user-management");
        } else {
          navigate("/dashboard");
        }
      } else {
        await signup(formData.email, formData.password, formData.fullName, formData.phoneNumber);
        
        // Trigger Green Top-Left Success Toast
        toast.success(
          "Account Created Successfully",
          "Your account has been created successfully.\nPlease sign in using your email and password.",
          2000
        );

        setSuccessMessage("Account created successfully. Please sign in using your credentials.");
        setIsSubmitting(false);

        // Wait 1.5–2 seconds before auto-redirecting to Login page
        setTimeout(() => {
          if (setMode) setMode("login");
          navigate("/login");
        }, 1800);
        return;
      }
    } catch (error) {
      console.error("Authentication error:", error);
      const friendlyMessage = getFriendlyErrorMessage(error);
      setAuthError(friendlyMessage);
      if (mode === "signup") {
        toast.error("Registration Failed", friendlyMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setIsSubmitting(true);
    try {
      const res = await loginWithGoogle();
      const role = res?.role || "user";
      if (role === "admin") {
        navigate("/user-management");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Google Auth Error:", error);
      let readableError = "Google sign-in failed. Please try again.";
      if (error.code === "auth/popup-closed-by-user" || error.code === "auth/cancelled-popup-request") {
        readableError = "Google sign-in was cancelled.";
      } else if (error.code === "auth/popup-blocked") {
        readableError = "Popup was blocked by the browser. Please allow popups and try again.";
      } else if (error.code === "auth/account-exists-with-different-credential") {
        readableError = "An account already exists with the same email address using a different sign-in method.";
      } else if (error.code === "auth/network-request-failed") {
        readableError = "Network error. Please check your connection.";
      }
      setAuthError(readableError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full transition-all duration-300">
      {/* Centered Heading */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <img src={logo} alt="कृषीDristi Logo" className="h-12 w-auto object-contain" />
          <h1 className="text-[28px] font-bold text-white tracking-tight">कृषीDristi</h1>
        </div>
        <p className="font-mono text-[#53E97F] text-[11px] font-medium tracking-[0.2em] uppercase">
          {mode === "login" ? "Secure Enterprise Access" : "Create Enterprise Account"}
        </p>
      </div>

      {/* Card */}
      <div className="bg-[#101B27] border border-[#1E2B38] rounded-xl p-[30px] shadow-2xl shadow-black/40 transition-all duration-300">
        {successMessage && (
          <div className="mb-6 p-4 rounded bg-[#53E97F]/10 border border-[#53E97F]/30 text-[#53E97F] font-mono text-[12px] flex items-start gap-2.5 animate-in fade-in duration-300">
            <svg className="w-4 h-4 shrink-0 mt-0.5 text-[#53E97F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div className="flex-1">{successMessage}</div>
          </div>
        )}

        {authError && (
          <div className="mb-6 p-4 rounded bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[12px] flex items-start gap-2.5">
            <svg className="w-4 h-4 shrink-0 mt-0.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">{authError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-[22px]" noValidate>
          {/* Full Name (Signup only) */}
          {mode === "signup" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label htmlFor="fullName" className="block font-mono text-[12px] text-[#A1AEB7] mb-2 tracking-wide">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-[#728392]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  disabled={isSubmitting}
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="John Doe"
                  className={`w-full pl-11 pr-4 h-[46px] bg-[#070F16] border ${
                    errors.fullName ? "border-red-500/50" : "border-transparent"
                  } rounded-[6px] font-mono text-white placeholder-[#4E6070] text-[13px] focus:outline-none focus:border-[#53E97F]/40 transition-all disabled:opacity-50`}
                  aria-invalid={!!errors.fullName}
                />
              </div>
              {errors.fullName && (
                <p className="mt-2 font-mono text-[11px] text-red-400 flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-red-400 rounded-full" /> {errors.fullName}
                </p>
              )}
            </div>
          )}

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block font-mono text-[12px] text-[#A1AEB7] mb-2 tracking-wide">
              Work Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-[#728392]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                disabled={isSubmitting}
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="name@company.com"
                className={`w-full pl-11 pr-4 h-[46px] bg-[#070F16] border ${
                  errors.email ? "border-red-500/50" : "border-transparent"
                } rounded-[6px] font-mono text-white placeholder-[#4E6070] text-[13px] focus:outline-none focus:border-[#53E97F]/40 transition-all disabled:opacity-50`}
                aria-invalid={!!errors.email}
              />
            </div>
            {errors.email && (
              <p className="mt-2 font-mono text-[11px] text-red-400 flex items-center gap-1.5">
                <span className="w-1 h-1 bg-red-400 rounded-full" /> {errors.email}
              </p>
            )}
          </div>

          {/* Phone Number (Signup only) */}
          {mode === "signup" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label htmlFor="phoneNumber" className="block font-mono text-[12px] text-[#A1AEB7] mb-2 tracking-wide">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-[#728392]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  disabled={isSubmitting}
                  autoComplete="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="1234567890"
                  className={`w-full pl-11 pr-4 h-[46px] bg-[#070F16] border ${
                    errors.phoneNumber ? "border-red-500/50" : "border-transparent"
                  } rounded-[6px] font-mono text-white placeholder-[#4E6070] text-[13px] focus:outline-none focus:border-[#53E97F]/40 transition-all disabled:opacity-50`}
                  aria-invalid={!!errors.phoneNumber}
                />
              </div>
              {errors.phoneNumber && (
                <p className="mt-2 font-mono text-[11px] text-red-400 flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-red-400 rounded-full" /> {errors.phoneNumber}
                </p>
              )}
            </div>
          )}

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="font-mono text-[12px] text-[#A1AEB7] tracking-wide">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-[#728392]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                disabled={isSubmitting}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                className={`w-full pl-11 pr-11 h-[46px] bg-[#070F16] border ${
                  errors.password ? "border-red-500/50" : "border-transparent"
                } rounded-[6px] font-mono text-white placeholder-[#4E6070] text-[14px] tracking-widest focus:outline-none focus:border-[#53E97F]/40 transition-all disabled:opacity-50`}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-4 flex items-center text-[#728392] hover:text-white transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 font-mono text-[11px] text-red-400 flex items-center gap-1.5">
                <span className="w-1 h-1 bg-red-400 rounded-full" /> {errors.password}
              </p>
            )}

            {/* Password Strength Checklist (Signup only) */}
            {mode === "signup" && formData.password.length > 0 && (
              <div className="mt-3 p-3 rounded-lg bg-[#070F16]/60 border border-[#1E2B38]/50 space-y-1.5 animate-in fade-in duration-300">
                <p className="font-mono text-[10px] text-[#55697A] uppercase tracking-[0.15em] mb-2">Password Requirements</p>
                {passwordRequirements.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2 font-mono text-[11px] transition-all duration-200">
                    <span className={`shrink-0 text-[12px] ${req.met ? "text-[#53E97F]" : "text-red-400/70"}`}>
                      {req.met ? "\u2714" : "\u2718"}
                    </span>
                    <span className={`transition-colors duration-200 ${req.met ? "text-[#53E97F]/80" : "text-[#728392]"}`}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password (Signup only) */}
          {mode === "signup" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label htmlFor="confirmPassword" className="block font-mono text-[12px] text-[#A1AEB7] mb-2 tracking-wide">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-[#728392]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-11 h-[46px] bg-[#070F16] border ${
                    errors.confirmPassword ? "border-red-500/50" : "border-transparent"
                  } rounded-[6px] font-mono text-white placeholder-[#4E6070] text-[14px] tracking-widest focus:outline-none focus:border-[#53E97F]/40 transition-all disabled:opacity-50`}
                  aria-invalid={!!errors.confirmPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute inset-y-0 right-4 flex items-center text-[#728392] hover:text-white transition-colors focus:outline-none"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 font-mono text-[11px] text-red-400 flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-red-400 rounded-full" /> {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {/* Remember this device (Login only) */}
          {mode === "login" && (
            <div className="flex items-center gap-3 mt-[18px] animate-in fade-in duration-300">
              <button
                type="button"
                role="checkbox"
                aria-checked={rememberDevice}
                disabled={isSubmitting}
                onClick={() => setRememberDevice((v) => !v)}
                className={`w-[14px] h-[14px] rounded-[3px] border flex items-center justify-center shrink-0 transition-all focus:outline-none focus:ring-2 focus:ring-[#53E97F]/40 cursor-pointer ${
                  rememberDevice ? "bg-[#53E97F] border-[#53E97F]" : "bg-[#06101A] border-[#2A3A4A]"
                }`}
                id="remember-device"
              >
                {rememberDevice && (
                  <svg className="w-2.5 h-2.5 text-[#040F18]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <label
                htmlFor="remember-device"
                className="font-mono text-[13px] text-[#A1AEB7] cursor-pointer select-none"
                onClick={() => setRememberDevice((v) => !v)}
              >
                Remember this device
              </label>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isSignupDisabled || !!successMessage}
              className="w-full h-[50px] bg-[#53E97F] hover:bg-[#68F090] disabled:opacity-70 text-[#040F18] font-bold rounded-lg text-[15px] tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-[#53E97F]/60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {mode === "login" ? "Authenticating..." : "Creating Account..."}
                </>
              ) : mode === "login" ? (
                "Login to Dashboard"
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          {/* OAuth Divider */}
          <div className="relative flex items-center gap-4 py-3 animate-in fade-in duration-300">
            <div className="flex-1 border-t border-[#1C2936]" />
            <span className="font-mono text-[10px] text-[#55697A] uppercase tracking-[0.15em]">
              {mode === "login" ? "or login with" : "or sign up with"}
            </span>
            <div className="flex-1 border-t border-[#1C2936]" />
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3 animate-in fade-in duration-300">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2.5 h-[46px] bg-transparent border border-[#1E2B38] hover:bg-white/[0.02] rounded-[6px] font-sans text-[13px] text-[#A1AEB7] hover:text-white transition-all focus:outline-none focus:ring-1 focus:ring-white/20 cursor-pointer col-span-2 disabled:opacity-50"
            >
              <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </div>
        </form>
      </div>

      {/* Footer Text (Outside Card) */}
      <div className="mt-8 text-center transition-all duration-300">
        {mode === "login" ? (
          <p className="text-[13px] text-[#8697A6]">
            New to the platform?{" "}
            <button
              type="button"
              onClick={() => setMode("signup")}
              className="font-bold text-[#53E97F] hover:text-[#79F29A] focus:outline-none rounded transition-colors cursor-pointer text-left inline"
            >
              Create New Account
            </button>
          </p>
        ) : (
          <p className="text-[13px] text-[#8697A6]">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("login")}
              className="font-bold text-[#53E97F] hover:text-[#79F29A] focus:outline-none rounded transition-colors cursor-pointer text-left inline"
            >
              Log In
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
