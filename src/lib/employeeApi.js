import { apiRequest } from "./api";

export const employeeApi = {
  async getEmployees(token) {
    return apiRequest("/api/employees", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getEmployeeById(id, token) {
    return apiRequest(`/api/employees/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async createEmployee(employeeData, token) {
    return apiRequest("/api/employees", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(employeeData),
    });
  },

  async updateEmployee(id, employeeData, token) {
    return apiRequest(`/api/employees/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(employeeData),
    });
  },

  async deleteEmployee(id, token) {
    return apiRequest(`/api/employees/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
