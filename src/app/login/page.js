"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Image from "next/image";
import logoImg from "@/assets/logo/Sabaa-LOGO.webp";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { loginAdmin } from "@/store/slices/adminAuthSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Dispatch Redux login action with backend API call
      const result = dispatch(
        loginAdmin({
          email: email.trim().toLowerCase(),
          password: password.trim(),
        })
      );

      // Handle the result
      result
        .then(() => {
          // Login successful, redirect to dashboard
          console.log("✅ Login successful, redirecting...");
          router.push("/");
        })
        .catch((err) => {
          // Login failed, show error message
          const errorMsg = err || "Login failed. Please try again.";
          setError(errorMsg);
          setLoading(false);
          console.error("❌ Login failed:", errorMsg);
        });
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(
        "An error occurred during login. Please check your credentials."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Illustration */}
      <div
        className="hidden lg:flex lg:w-1/2 items-center justify-center p-8"
        style={{ backgroundColor: "#f8f4ff" }}
      >
        <div className="max-w-md">
          <div className="text-center">
            {/* Sabaa Logo */}
            <div className="mb-12 flex justify-center">
              <Image
                src={logoImg}
                alt="SaBaa Logo"
                width={200}
                height={120}
                priority
                className="object-contain"
              />
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Secure Admin Access
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your jewelry business with confidence
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl text-center font-bold text-gray-900 mb-2">
              Login as a Admin User
            </h2>
            <p className="text-gray-600 text-center text-sm">
              Enter your credentials to access the dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors text-black"
                style={{ "--tw-ring-color": "var(--primary)" }}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors text-black"
                  style={{ "--tw-ring-color": "var(--primary)" }}
                  required
                />
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }}
                  className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer flex items-center justify-center"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <MdVisibilityOff className="w-5 h-5" />
                  ) : (
                    <MdVisibility className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-white font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 hover:shadow-lg"
              style={{
                backgroundColor: loading ? "#9ca3af" : "var(--primary)",
              }}
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
