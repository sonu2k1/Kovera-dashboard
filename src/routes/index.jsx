import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout";
import { ProtectedRoute } from "@/components/common";

/* ── Eager-loaded (always needed) ── */
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";

/* ── Lazy-loaded (code-split per route) ── */
const SearchPage = lazy(() => import("@/pages/Search"));
const UsersPage = lazy(() => import("@/pages/Users"));
const AgentsPage = lazy(() => import("@/pages/Agents"));
const PropertiesPage = lazy(() => import("@/pages/Properties"));
const TradesPage = lazy(() => import("@/pages/Trades"));
const SettingsPage = lazy(() => import("@/pages/Settings"));

/**
 * Centralized route configuration.
 * Add new routes here — they'll auto-register in App.jsx.
 */

/** Public routes (no layout wrapper, no auth) */
export const publicRoutes = [
  { path: "/login", element: <Login /> },
];

/** Protected routes (wrapped in DashboardLayout + ProtectedRoute) */
export const protectedRoutes = [
  { index: true, element: <Navigate to="/dashboard" replace /> },
  { path: "dashboard", element: <Dashboard /> },
  { path: "search", element: <SearchPage /> },
  { path: "users", element: <UsersPage /> },
  { path: "agents", element: <AgentsPage /> },
  { path: "properties", element: <PropertiesPage /> },
  { path: "trades", element: <TradesPage /> },
  { path: "settings", element: <SettingsPage /> },
];

/** Layout wrapper — ProtectedRoute guards the entire dashboard */
export const layoutRoute = {
  path: "/",
  element: (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  ),
  children: protectedRoutes,
};

/** Catch-all fallback */
export const fallbackRoute = {
  path: "*",
  element: <Navigate to="/dashboard" replace />,
};
