import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

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

// Response interceptor — handle 401 (auto-logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      // Only redirect if not already on login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
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
};

// ===== Agents API =====
export const agentsAPI = {
  getAll: (params) => api.get("/agents", { params }),
  getById: (id) => api.get(`/agents/${id}`),
  create: (data) => api.post("/agents", data),
  update: (id, data) => api.put(`/agents/${id}`, data),
  delete: (id) => api.delete(`/agents/${id}`),
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
};

// ===== Trades API =====
export const tradesAPI = {
  getAll: (params) => api.get("/trades", { params }),
  getById: (id) => api.get(`/trades/${id}`),
  create: (data) => api.post("/trades", data),
  update: (id, data) => api.put(`/trades/${id}`, data),
};
