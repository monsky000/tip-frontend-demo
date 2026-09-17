"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthCard() {
  const { login, register } = useAuth();
  const [tab, setTab] = useState("login"); // "login" | "register"
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    address: "",
  });

  const handleLoginChange = (e) => {
    setLoginForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleRegisterChange = (e) => {
    setRegisterForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!loginForm.username || !loginForm.password) {
      setError("Please fill in both username and password.");
      return;
    }

    setIsLoading(true);
    try {
      await login(loginForm);
    } catch (err) {
      setError(err.message || "Login failed. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !registerForm.firstname ||
      !registerForm.lastname ||
      !registerForm.username ||
      !registerForm.email ||
      !registerForm.password ||
      !registerForm.address
    ) {
      setError("Please fill out all registration fields.");
      return;
    }

    setIsLoading(true);
    try {
      await register(registerForm);
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass-panel rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {tab === "login" ? "Welcome Back" : "Create an Account"}
          </h2>
          <p className="text-xs text-slate-400 mt-1.5">
            {tab === "login"
              ? "Sign in with your username to generate a secure JWT"
              : "Register a new user to store credentials in MySQL"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-900/90 rounded-2xl mb-6 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setTab("login");
              setError("");
              setSuccess("");
            }}
            className={`py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 ${tab === "login"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "text-slate-400 hover:text-white"
              }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("register");
              setError("");
              setSuccess("");
            }}
            className={`py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 ${tab === "register"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "text-slate-400 hover:text-white"
              }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start space-x-2">
            <svg
              className="w-4 h-4 text-rose-400 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Sign In Form */}
        {tab === "login" ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={loginForm.username}
                onChange={handleLoginChange}
                placeholder="e.g. john_doe"
                required
                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm placeholder:text-slate-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                placeholder="••••••••"
                required
                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm placeholder:text-slate-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In & Get Token</span>
              )}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={registerForm.firstname}
                  onChange={handleRegisterChange}
                  placeholder="John"
                  required
                  className="glass-input w-full px-3.5 py-2 rounded-xl text-sm placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={registerForm.lastname}
                  onChange={handleRegisterChange}
                  placeholder="Doe"
                  required
                  className="glass-input w-full px-3.5 py-2 rounded-xl text-sm placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={registerForm.username}
                onChange={handleRegisterChange}
                placeholder="johndoe"
                required
                className="glass-input w-full px-3.5 py-2 rounded-xl text-sm placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                placeholder="john@example.com"
                required
                className="glass-input w-full px-3.5 py-2 rounded-xl text-sm placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={registerForm.password}
                onChange={handleRegisterChange}
                placeholder="Create a strong password"
                required
                className="glass-input w-full px-3.5 py-2 rounded-xl text-sm placeholder:text-slate-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={registerForm.address}
                onChange={handleRegisterChange}
                placeholder="Your address"
                required
                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm placeholder:text-slate-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Creating User...</span>
                </>
              ) : (
                <span>Register & Auto Sign In</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
