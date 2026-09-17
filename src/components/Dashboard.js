"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import EmployeeManagement from "@/components/EmployeeManagement";

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("employees"); // 'employees' or 'overview'
  const [apiResponse, setApiResponse] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [copied, setCopied] = useState(false);

  // Decode JWT payload for inspection (base64 decode of middle part)
  const decodeJwt = (jwtToken) => {
    try {
      if (!jwtToken) return null;
      const parts = jwtToken.split(".");
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch {
      return null;
    }
  };

  const tokenPayload = decodeJwt(token);

  const handleTestProtectedEndpoint = async () => {
    setApiLoading(true);
    setApiError("");
    setApiResponse(null);

    try {
      const data = await api.getProfile(token);
      setApiResponse(data);
    } catch (err) {
      setApiError(err.message || "Failed to call protected endpoint");
    } finally {
      setApiLoading(false);
    }
  };

  const handleCopyToken = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Top Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-indigo-500/20">
            {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Hello, <span className="gradient-text">{user?.firstname || user?.username || "User"}</span>
              </h1>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {user?.role || "ROLE_USER"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {user?.address || "Authenticated via JWT"}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all duration-200 flex items-center space-x-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>End Session</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab("employees")}
          className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 flex items-center space-x-2 ${
            activeTab === "employees"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Employee Management</span>
        </button>

        <button
          onClick={() => setActiveTab("overview")}
          className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 flex items-center space-x-2 ${
            activeTab === "overview"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>JWT API Tester & Claims</span>
        </button>
      </div>

      {activeTab === "employees" ? (
        <EmployeeManagement />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Protected Endpoint Verification */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <h3 className="text-base font-bold text-white">Protected Endpoint Test</h3>
              </div>
              <span className="text-[11px] font-mono bg-slate-900 text-indigo-300 px-2 py-1 rounded-md border border-slate-800">
                GET /api/profile/me
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Calls the secured Spring Boot controller endpoint requiring the{" "}
              <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">
                Authorization: Bearer &lt;token&gt;
              </code>{" "}
              header.
            </p>

            <button
              onClick={handleTestProtectedEndpoint}
              disabled={apiLoading}
              className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {apiLoading ? (
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
                  <span>Verifying Bearer Token...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Execute Test Request</span>
                </>
              )}
            </button>
          </div>

          {/* Response Container */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 font-mono text-xs overflow-x-auto min-h-[140px] flex flex-col justify-center">
            {apiError ? (
              <div className="text-rose-400 space-y-1">
                <p className="font-semibold">Request Failed:</p>
                <p className="text-[11px] opacity-90">{apiError}</p>
              </div>
            ) : apiResponse ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>HTTP 200 OK — Authorized</span>
                </div>
                <pre className="text-slate-300 text-[11px] whitespace-pre-wrap">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-slate-500 text-center italic">
                Click &quot;Execute Test Request&quot; to test your JWT against the backend.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: JWT Token Inspector */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                <h3 className="text-base font-bold text-white">Active JWT Token</h3>
              </div>
              <button
                onClick={handleCopyToken}
                className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition flex items-center space-x-1"
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy Token</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Signed using JJWT with a 256-bit secret key. The payload contains your username and token expiration timestamp.
            </p>

            {/* Token preview box */}
            <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 font-mono text-[10px] text-slate-400 break-all max-h-24 overflow-y-auto mb-4">
              {token || "No active token"}
            </div>
          </div>

          {/* Decoded Claims details */}
          {tokenPayload && (
            <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 space-y-2">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                Decoded Token Claims
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Subject (Username)</span>
                  <span className="font-semibold text-indigo-300 font-mono">
                    {tokenPayload.sub || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Expires At</span>
                  <span className="font-semibold text-slate-300 font-mono">
                    {tokenPayload.exp
                      ? new Date(tokenPayload.exp * 1000).toLocaleTimeString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);
}
