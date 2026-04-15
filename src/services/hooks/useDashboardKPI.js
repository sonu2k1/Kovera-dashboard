import { useQuery } from "@tanstack/react-query";
import { statsAPI } from "@/services/api";
import {
  Users,
  UserCog,
  Building2,
  ArrowLeftRight,
  Heart,
  UserCheck,
} from "lucide-react";

/**
 * Demo/fallback data — used when the API is unreachable.
 */
const DEMO_KPI = [
  {
    key: "totalUsers",
    title: "Total Users",
    value: "12,847",
    change: "+5.2%",
    trend: "up",
    icon: Users,
    accentColor: "blue",
  },
  {
    key: "totalAgents",
    title: "Total Agents",
    value: "342",
    change: "+8.1%",
    trend: "up",
    icon: UserCog,
    accentColor: "purple",
  },
  {
    key: "totalProperties",
    title: "Total Properties",
    value: "6,520",
    change: "+12.4%",
    trend: "up",
    icon: Building2,
    accentColor: "green",
  },
  {
    key: "activeTrades",
    title: "Active Trades",
    value: "1,893",
    change: "-2.3%",
    trend: "down",
    icon: ArrowLeftRight,
    accentColor: "amber",
  },
  {
    key: "propertyLikes",
    title: "Property Likes",
    value: "48.2K",
    change: "+18.7%",
    trend: "up",
    icon: Heart,
    accentColor: "red",
  },
  {
    key: "activeUsers",
    title: "Active Users (30d)",
    value: "3,421",
    change: "+6.9%",
    trend: "up",
    icon: UserCheck,
    accentColor: "cyan",
  },
];

/**
 * Format a raw number into a human-readable string.
 * e.g. 12847 → "12,847" | 48200 → "48.2K"
 */
function formatValue(num) {
  if (num == null) return "—";
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 10000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
}

/**
 * Fetch all KPI stats from individual endpoints (parallel).
 * Returns normalized card data.
 */
async function fetchKPIStats() {
  const [usersRes, agentsRes, propertiesRes, tradesRes, likesRes, activeRes] =
    await Promise.all([
      statsAPI.getUsersCount(),
      statsAPI.getAgentsCount(),
      statsAPI.getPropertiesCount(),
      statsAPI.getActiveTrades(),
      statsAPI.getPropertyLikes(),
      statsAPI.getActiveUsers(),
    ]);

  return [
    {
      key: "totalUsers",
      title: "Total Users",
      value: formatValue(usersRes.data?.count),
      change: usersRes.data?.change || "+0%",
      trend: usersRes.data?.trend || "up",
      icon: Users,
      accentColor: "blue",
    },
    {
      key: "totalAgents",
      title: "Total Agents",
      value: formatValue(agentsRes.data?.count),
      change: agentsRes.data?.change || "+0%",
      trend: agentsRes.data?.trend || "up",
      icon: UserCog,
      accentColor: "purple",
    },
    {
      key: "totalProperties",
      title: "Total Properties",
      value: formatValue(propertiesRes.data?.count),
      change: propertiesRes.data?.change || "+0%",
      trend: propertiesRes.data?.trend || "up",
      icon: Building2,
      accentColor: "green",
    },
    {
      key: "activeTrades",
      title: "Active Trades",
      value: formatValue(tradesRes.data?.count),
      change: tradesRes.data?.change || "+0%",
      trend: tradesRes.data?.trend || "up",
      icon: ArrowLeftRight,
      accentColor: "amber",
    },
    {
      key: "propertyLikes",
      title: "Property Likes",
      value: formatValue(likesRes.data?.count),
      change: likesRes.data?.change || "+0%",
      trend: likesRes.data?.trend || "up",
      icon: Heart,
      accentColor: "red",
    },
    {
      key: "activeUsers",
      title: "Active Users (30d)",
      value: formatValue(activeRes.data?.count),
      change: activeRes.data?.change || "+0%",
      trend: activeRes.data?.trend || "up",
      icon: UserCheck,
      accentColor: "cyan",
    },
  ];
}

/**
 * Custom hook: fetches KPI data with auto-refresh every 60 seconds.
 * Falls back to demo data when the API is unavailable.
 */
export function useDashboardKPI() {
  const query = useQuery({
    queryKey: ["dashboard-kpi"],
    queryFn: fetchKPIStats,
    refetchInterval: 60 * 1000, // ← auto-refresh every 60s
    refetchIntervalInBackground: false,
    retry: 1,
    staleTime: 30 * 1000,
  });

  // Fallback to demo data on error (API unreachable)
  const kpiCards = query.data || (query.isError ? DEMO_KPI : null);
  const isDemo = !query.data && query.isError;

  return {
    kpiCards,
    isLoading: query.isLoading,
    isError: query.isError,
    isDemo,
    refetch: query.refetch,
    lastUpdated: query.dataUpdatedAt
      ? new Date(query.dataUpdatedAt)
      : null,
  };
}
