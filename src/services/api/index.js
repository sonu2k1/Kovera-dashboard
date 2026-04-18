import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Re-export analytics module for convenience
export { analyticsAPI } from "./analytics";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // 401 Unauthorized
    if (status === 401) {
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    
    // 403 Forbidden
    if (status === 403) {
      window.dispatchEvent(new CustomEvent("kovera:toast", {
        detail: { type: "error", title: "Access Denied", message: "You do not have permission for this action." }
      }));
    }

    // 500 Server Error
    if (status >= 500) {
      window.dispatchEvent(new CustomEvent("kovera:toast", {
        detail: { type: "error", title: "Server Error", message: "An unexpected error occurred." }
      }));
    }

    return Promise.reject(error);
  }
);

// ===== Auth API =====
export const authAPI = {
  login: (credentials) => api.post("/admin/login", credentials),
  logout: () => api.post("/admin/logout"),
  me: () => api.get("/admin/me"),
};

// ===== Users API =====
export const usersAPI = {
  getAll: (params) => api.get("/users", { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post("/users", data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  updateStatus: (id, status) => api.patch(`/users/${id}/status`, { status }),
};

// ===== Agents API =====
export const agentsAPI = {
  getAll: (params) => api.get("/agents", { params }),
  getById: (id) => api.get(`/agents/${id}`),
  create: (data) => api.post("/agents", data),
  update: (id, data) => api.put(`/agents/${id}`, data),
  delete: (id) => api.delete(`/agents/${id}`),
  verify: (id, status) => api.patch(`/agents/${id}/verify`, { status }),
};

// ===== Search API =====
export const searchAPI = {
  query: (params) => api.get("/search", { params }),
};

// ===== Dashboard / Stats API =====
export const statsAPI = {
  getUsersCount: () => api.get("/stats/users/count"),
  getAgentsCount: () => api.get("/stats/agents/count"),
  getPropertiesCount: () => api.get("/stats/properties/count"),
  getActiveTrades: () => api.get("/stats/trades/active"),
  getPropertyLikes: () => api.get("/stats/properties/likes"),
  getActiveUsers: () => api.get("/stats/users/active"),
  getAll: () => api.get("/stats/dashboard"),
};

export const dashboardAPI = {
  getStats: () => api.get("/dashboard/stats"),
  getActivity: () => api.get("/dashboard/activity"),
};

// ===== Properties API =====
export const propertiesAPI = {
  getAll: (params) => api.get("/properties", { params }),
  getById: (id) => api.get(`/properties/${id}`),
  create: (data) => api.post("/properties", data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),
  updateStatus: (id, status) => api.patch(`/properties/${id}/status`, { status }),
};

// ===== Trades API =====
export const tradesAPI = {
  getAll: (params) => api.get("/trades", { params }),
  getById: (id) => api.get(`/trades/${id}`),
  create: (data) => api.post("/trades", data),
  update: (id, data) => api.put(`/trades/${id}`, data),
};
