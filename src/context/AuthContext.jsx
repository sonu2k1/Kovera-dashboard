import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "@/services/api";

const AuthContext = createContext(null);

/**
 * Decode a JWT payload without external libraries.
 * Returns null if the token is malformed.
 */
function decodeJWT(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Check if a JWT has expired (with a 60-second buffer).
 */
function isTokenExpired(token) {
  const payload = decodeJWT(token);
  if (!payload?.exp) return false; // No exp claim → treat as valid
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now + 60; // 60s buffer before actual expiry
}

/**
 * Get milliseconds until token expires.
 * Returns 0 if already expired or no exp claim.
 */
function getTimeUntilExpiry(token) {
  const payload = decodeJWT(token);
  if (!payload?.exp) return 0;
  const now = Math.floor(Date.now() / 1000);
  const diff = payload.exp - now;
  return diff > 0 ? diff * 1000 : 0;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("auth_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("auth_token"));
  const [loading, setLoading] = useState(true);
  const logoutTimerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Clear auth state and redirect to login.
   */
  const logout = useCallback(() => {
    // Clear timer
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    // Clear storage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);

    // Redirect (only if not already on login)
    if (location.pathname !== "/login") {
      navigate("/login", { replace: true });
    }
  }, [navigate, location.pathname]);

  /**
   * Schedule auto-logout when token expires.
   */
  const scheduleAutoLogout = useCallback(
    (jwt) => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }

      const ms = getTimeUntilExpiry(jwt);
      if (ms > 0) {
        logoutTimerRef.current = setTimeout(() => {
          console.warn("[Auth] Token expired — auto-logout");
          logout();
        }, ms);
      }
    },
    [logout]
  );

  /**
   * Validate existing token on mount.
   */
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      // Check expiry locally first
      if (isTokenExpired(token)) {
        console.warn("[Auth] Stored token is expired");
        logout();
        setLoading(false);
        return;
      }

      // Try to validate with server
      try {
        const res = await authAPI.me();
        const userData = res.data?.user || res.data;
        setUser(userData);
        localStorage.setItem("auth_user", JSON.stringify(userData));
        scheduleAutoLogout(token);
      } catch (error) {
        // If server rejects, use cached user data for dev/offline mode
        if (user) {
          console.warn("[Auth] Server unreachable — using cached user");
          scheduleAutoLogout(token);
        } else {
          console.warn("[Auth] Token validation failed");
          logout();
        }
      }

      setLoading(false);
    };

    validateToken();

    // Cleanup timer on unmount
    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Demo credentials (remove in production) ──
  const DEMO_EMAIL = "admin@kovera.io";
  const DEMO_PASSWORD = "admin123";

  /**
   * Login with email + password.
   * Calls POST /api/admin/login — falls back to demo credentials if server is down.
   */
  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      const { token: jwt, user: userData } = res.data;

      // Persist
      localStorage.setItem("auth_token", jwt);
      localStorage.setItem("auth_user", JSON.stringify(userData));
      setToken(jwt);
      setUser(userData);

      // Schedule auto-logout
      scheduleAutoLogout(jwt);

      return { success: true };
    } catch (error) {
      // ── Demo mode fallback (when API server is not running) ──
      if (!error.response && email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        const demoToken = "demo_jwt_token";
        const demoUser = { name: "Admin", email: DEMO_EMAIL, role: "admin" };

        localStorage.setItem("auth_token", demoToken);
        localStorage.setItem("auth_user", JSON.stringify(demoUser));
        setToken(demoToken);
        setUser(demoUser);

        console.info("[Auth] Logged in with demo credentials (API unavailable)");
        return { success: true };
      }

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Invalid email or password";

      return { success: false, error: message };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !isTokenExpired(token),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
