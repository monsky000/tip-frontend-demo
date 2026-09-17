"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import AuthCard from "@/components/AuthCard";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <p className="text-xs text-slate-400 animate-pulse font-medium">
            Loading session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12">
      {isAuthenticated ? (
        <Dashboard />
      ) : (
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              <span>Full-Stack Authentication Demo</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              JWT Authentication <br />
              <span className="gradient-text">Spring Boot + Next.js</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Sign up with MySQL storage, receive cryptographically signed JWT tokens, and verify protected API endpoints.
            </p>
          </div>

          <AuthCard />
        </div>
      )}
    </div>
  );
}
