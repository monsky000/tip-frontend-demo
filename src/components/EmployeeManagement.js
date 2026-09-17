"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { employeeApi } from "@/lib/employeeApi";

export default function EmployeeManagement() {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "Engineering",
    position: "",
    salary: "",
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirm State
  const [deletingId, setDeletingId] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await employeeApi.getEmployees(token);
      setEmployees(data || []);
    } catch (err) {
      setError(err.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchEmployees();
    }
  }, [token]);

  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      department: "Engineering",
      position: "",
      salary: "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      firstName: emp.firstName || "",
      lastName: emp.lastName || "",
      email: emp.email || "",
      department: emp.department || "Engineering",
      position: emp.position || "",
      salary: emp.salary ? String(emp.salary) : "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.position.trim()) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        department: formData.department.trim(),
        position: formData.position.trim(),
        salary: parseFloat(formData.salary) || 0.0,
      };

      if (editingEmployee) {
        await employeeApi.updateEmployee(editingEmployee.id, payload, token);
      } else {
        await employeeApi.createEmployee(payload, token);
      }

      setIsModalOpen(false);
      fetchEmployees();
    } catch (err) {
      setFormError(err.message || "Failed to save employee");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await employeeApi.deleteEmployee(id, token);
      setDeletingId(null);
      fetchEmployees();
    } catch (err) {
      alert(err.message || "Failed to delete employee");
    }
  };

  // Filter & Search Logic
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDepartment === "ALL" || emp.department === selectedDepartment;

    return matchesSearch && matchesDept;
  });

  // Calculate Metrics
  const totalSalary = employees.reduce((acc, curr) => acc + (curr.salary || 0), 0);
  const avgSalary = employees.length > 0 ? (totalSalary / employees.length).toFixed(2) : 0;
  const departments = Array.from(new Set(employees.map((e) => e.department))).filter(Boolean);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Total Employees</p>
            <h3 className="text-2xl font-bold text-white mt-0.5">{employees.length}</h3>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Active Departments</p>
            <h3 className="text-2xl font-bold text-white mt-0.5">{departments.length}</h3>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Average Salary</p>
            <h3 className="text-2xl font-bold text-white mt-0.5">${Number(avgSalary).toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Employee Directory</h2>
            <p className="text-xs text-slate-400 mt-1">Manage corporate personnel records and salaries</p>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-lg shadow-indigo-500/25 transition-all duration-200 flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
          <div className="relative flex-1 w-full">
            <svg className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or position..."
              className="w-full bg-slate-950/80 text-white pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition placeholder:text-slate-500"
            />
          </div>

          <div className="w-full sm:w-48">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full bg-slate-950/80 text-slate-300 text-xs py-2 px-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
            <svg className="animate-spin h-6 w-6 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-xs">Loading employee records...</span>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-rose-400 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-xs">
            {error}
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs italic bg-slate-950/40 rounded-2xl border border-slate-900">
            No employees found. Click &quot;Add Employee&quot; to create one.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Position</th>
                  <th className="py-3.5 px-4">Salary</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/50">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-indigo-500/5 transition duration-150">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
                          {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{emp.firstName} {emp.lastName}</p>
                          <p className="text-[11px] text-slate-400">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 text-[10px] font-semibold rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {emp.department}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {emp.position}
                    </td>
                    <td className="py-3.5 px-4 text-emerald-400 font-mono font-semibold">
                      ${emp.salary?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(emp)}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-lg text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingId(emp.id)}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-lg text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-700 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingEmployee ? "Edit Employee" : "Add New Employee"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {formError && (
              <div className="p-3 text-xs rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveEmployee} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-slate-950 text-white px-3 py-2 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-slate-950 text-white px-3 py-2 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 text-white px-3 py-2 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-slate-950 text-white px-3 py-2 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Position / Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Software Engineer"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full bg-slate-950 text-white px-3 py-2 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Salary ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 85000"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="w-full bg-slate-950 text-white px-3 py-2 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-xl text-slate-400 bg-slate-900 hover:text-white hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30 disabled:opacity-60"
                >
                  {submitting ? "Saving..." : editingEmployee ? "Update Employee" : "Create Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-sm rounded-3xl p-6 space-y-5 border border-slate-700 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Delete Employee</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to remove this employee record? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-xs font-medium rounded-xl text-slate-300 bg-slate-800 hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteEmployee(deletingId)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-white bg-rose-600 hover:bg-rose-500 transition shadow-lg shadow-rose-600/30"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
