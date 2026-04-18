import { useQuery } from "@tanstack/react-query";
import { searchAPI } from "@/services/api";
import { useDebounce } from "./useDebounce";

/**
 * Demo search results — used when API is unavailable.
 */
const DEMO_RESULTS = {
  all: [
    { id: "u1", type: "user", title: "Sarah Chen", subtitle: "sarah.chen@email.com", meta: "Active · Joined Mar 2026" },
    { id: "u2", type: "user", title: "James Wright", subtitle: "james.w@realestate.io", meta: "Active · Joined Feb 2026" },
    { id: "a1", type: "agent", title: "Agent-Alpha-7", subtitle: "Residential specialist", meta: "Active · 42 deals closed" },
    { id: "a2", type: "agent", title: "Agent-Omega-3", subtitle: "Commercial specialist", meta: "Active · 18 deals closed" },
    { id: "p1", type: "property", title: "Skyline Tower, Unit 42A", subtitle: "Manhattan, NY", meta: "$2.4M · Apartment" },
    { id: "p2", type: "property", title: "Ocean View Villa", subtitle: "Malibu, CA", meta: "$5.8M · Villa" },
    { id: "p3", type: "property", title: "Greenwood Estate", subtitle: "Austin, TX", meta: "$890K · House" },
    { id: "t1", type: "trade", title: "Trade #1042 — Skyline Tower", subtitle: "James Wright → Sarah Chen", meta: "$2.4M · Completed" },
    { id: "t2", type: "trade", title: "Trade #1038 — Ocean View", subtitle: "Michael Ross → Emily Stone", meta: "$5.8M · In Progress" },
  ],
};

/**
 * Filter demo results based on query and type.
 */
function filterDemoResults(query, type) {
  const q = query.toLowerCase();
  let results = DEMO_RESULTS.all;

  // Filter by type
  if (type && type !== "all") {
    results = results.filter((r) => r.type === type);
  }

  // Filter by query
  if (q) {
    results = results.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.subtitle.toLowerCase().includes(q) ||
        r.meta.toLowerCase().includes(q)
    );
  }

  return results;
}

/**
 * Custom hook: performs search with debounce, pagination, and type filtering.
 * Falls back to demo data when API is unavailable.
 */
export function useSearch({ query, type = "all", page = 1, limit = 20 }) {
  const debouncedQuery = useDebounce(query, 300);

  const searchQuery = useQuery({
    queryKey: ["search", debouncedQuery, type, page, limit],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.trim().length < 1) {
        return { results: [], total: 0, page: 1 };
      }

      try {
        const res = await searchAPI.query({
          q: debouncedQuery,
          type: type !== "all" ? type : undefined,
          page,
          limit,
        });
        return res.data;
      } catch {
        // Fallback to demo data
        const demoResults = filterDemoResults(debouncedQuery, type);
        return {
          results: demoResults,
          total: demoResults.length,
          page: 1,
          isDemo: true,
        };
      }
    },
    enabled: debouncedQuery.trim().length >= 1,
    staleTime: 30 * 1000, // Cache for 30s per spec
    retry: 0,
  });

  return {
    results: searchQuery.data?.results || [],
    total: searchQuery.data?.total || 0,
    currentPage: searchQuery.data?.page || 1,
    isLoading: searchQuery.isLoading && debouncedQuery.length >= 1,
    isFetching: searchQuery.isFetching,
    isDemo: searchQuery.data?.isDemo || false,
    debouncedQuery,
  };
}
