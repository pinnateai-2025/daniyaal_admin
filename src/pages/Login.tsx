import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  X,
  Info
} from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("daniyaalperfumery@gmail.com");
<<<<<<< HEAD
  const [password, setPassword] = useState("AmanKhan*1");
=======
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
>>>>>>> e8c0c3c4baeedd735da385d50185004179d0ffae
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password modal states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetInfo, setResetInfo] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate("/");
<<<<<<< HEAD
    } catch (err) {
      setError("Invalid credentials. Please check your email and password.");
=======
    } catch {
      setError("Invalid credentials. Please try again.");
>>>>>>> e8c0c3c4baeedd735da385d50185004179d0ffae
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = () => {
    if (!resetEmail) {
      setResetInfo("Please enter your email address.");
      return;
    }

    // MOCK behavior (replace with API later)
    setResetInfo(
      "Password reset is not enabled yet. Please contact the administrator."
    );
  };

  return (
<<<<<<< HEAD
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-6 md:p-10 shadow-xl border border-gray-100 transition-all">
=======
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-xl bg-white p-10 shadow-lg border border-gray-100 space-y-8">
>>>>>>> e8c0c3c4baeedd735da385d50185004179d0ffae

          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Admin Access</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to manage your store
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 pl-10 py-2
                  focus:border-[#e7b008] focus:ring-[#e7b008] sm:text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 pl-10 pr-10 py-2
                  focus:border-[#e7b008] focus:ring-[#e7b008] sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(true);
                  setResetEmail(email);
                  setResetInfo("");
                }}
                className="text-sm text-[#e7b008] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md py-2 font-medium text-white
              bg-[#e7b008] hover:bg-[#d6a707] transition disabled:opacity-70"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>

      {/* ================= FORGOT PASSWORD MODAL ================= */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Reset Password
              </h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Enter your admin email address to reset your password.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2
                  focus:border-[#e7b008] focus:ring-[#e7b008] sm:text-sm"
                />
              </div>

              {resetInfo && (
                <div className="flex gap-2 text-sm text-yellow-800 bg-yellow-50 p-3 rounded">
                  <Info size={18} />
                  <span>{resetInfo}</span>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowForgotModal(false)}
                className="rounded-md border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordReset}
                className="rounded-md bg-[#e7b008] px-4 py-2 text-sm font-medium text-white hover:bg-[#d6a707]"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
