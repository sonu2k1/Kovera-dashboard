import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersAPI } from "@/services/api";

/**
 * Demo users data — used when API is unavailable.
 */
const DEMO_USERS = Array.from({ length: 48 }, (_, i) => {
  const names = [
    "John Carter", "Sarah Chen", "James Wright", "Emily Davis", "Alex Kim",
    "Lisa Turner", "Michael Ross", "Anna Wang", "David Park", "Rachel Green",
    "Robert Lee", "Sophie Miller", "Daniel Brown", "Mia Johnson", "Chris Evans",
    "Olivia Wilson", "Nathan Scott", "Emma Taylor", "Lucas Martin", "Chloe Lee",
  ];
  const statuses = ["Active", "Active", "Active", "Active", "Blocked", "Active"];
  const name = names[i % names.length];
  const first = name.split(" ")[0].toLowerCase();
  const last = name.split(" ")[1].toLowerCase();

  // Generate a date within the last 12 months
  const joinDate = new Date(2025, 4 + Math.floor(i / 4), 1 + (i % 28));

  return {
    id: `usr_${String(i + 1).padStart(3, "0")}`,
    name,
    email: `${first}.${last}${i > 19 ? i : ""}@email.com`,
    phone: `+1 (555) ${String(100 + i).padStart(3, "0")}-${String(1000 + i * 7).slice(0, 4)}`,
    joinDate: joinDate.toISOString(),
    status: statuses[i % statuses.length],
    avatar: name.charAt(0),
    activity: {
      logins: 12 + Math.floor(Math.random() * 100),
      searches: 30 + Math.floor(Math.random() * 200),
      propertiesViewed: 5 + Math.floor(Math.random() * 50),
      lastActive: i < 5 ? "Just now" : i < 15 ? `${i} hours ago` : `${Math.floor(i / 7)} days ago`,
    },
  };
});

/**
 * Apply filters, sorting, and pagination to demo data locally.
 */
function filterDemoUsers({ page = 1, limit = 20, status, search, sortBy, sortOrder, dateFrom, dateTo }) {
  let filtered = [...DEMO_USERS];

  // Status filter
  if (status && status !== "all") {
    filtered = filtered.filter((u) => u.status.toLowerCase() === status.toLowerCase());
  }

  // Search filter
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q)
    );
  }

  // Date range filter
  if (dateFrom) {
    filtered = filtered.filter((u) => new Date(u.joinDate) >= new Date(dateFrom));
  }
  if (dateTo) {
    filtered = filtered.filter((u) => new Date(u.joinDate) <= new Date(dateTo));
  }

  // Sorting
  if (sortBy) {
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (sortBy === "joinDate") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else {
        aVal = aVal?.toLowerCase?.() || aVal;
        bVal = bVal?.toLowerCase?.() || bVal;
      }
      if (aVal < bVal) return sortOrder === "desc" ? 1 : -1;
      if (aVal > bVal) return sortOrder === "desc" ? -1 : 1;
      return 0;
    });
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const users = filtered.slice(start, start + limit);

  return { users, total, page, totalPages, limit };
}

/**
 * Hook: fetch paginated, filtered, sorted users list.
 */
export function useUsers(params = {}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      try {
        const res = await usersAPI.getAll(params);
        return res.data;
      } catch {
        return { ...filterDemoUsers(params), isDemo: true };
      }
    },
    staleTime: 30 * 1000,
    keepPreviousData: true,
  });
}

/**
 * Hook: fetch single user by ID.
 */
export function useUser(id) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      try {
        const res = await usersAPI.getById(id);
        return res.data;
      } catch {
        const user = DEMO_USERS.find((u) => u.id === id);
        return user || null;
      }
    },
    enabled: !!id,
  });
}

/**
 * Hook: toggle user status (Active ↔ Blocked).
 */
export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newStatus }) => {
      try {
        const res = await usersAPI.updateStatus(id, newStatus);
        return res.data;
      } catch (err) {
        if (!err.response) return { id, status: newStatus }; // Demo mode
        throw err;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      window.dispatchEvent(new CustomEvent("kovera:toast", {
        detail: { type: "success", title: "Success", message: `User status changed to ${variables.newStatus}` }
      }));
    },
    onError: () => {
      window.dispatchEvent(new CustomEvent("kovera:toast", {
        detail: { type: "error", title: "Error", message: "Failed to change user status" }
      }));
    }
  });
}
