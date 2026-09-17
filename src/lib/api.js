import { employeeApi } from "./employeeApi";

const API_BASE_URL = "http://localhost:8081";

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage =
        typeof data === "string" ? data : data?.message || "Something went wrong";
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
      throw new Error(
        `Unable to reach backend at ${API_BASE_URL}. Please ensure the Spring Boot server is running.`
      );
    }
    throw error;
  }
}

export const api = {
  async register(userData) {
    return apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  async login(credentials) {
    return apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  async getProfile(token) {
    return apiRequest("/api/profile/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  ...employeeApi,
};
