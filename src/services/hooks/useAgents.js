import { useQuery } from "@tanstack/react-query";
import { agentsAPI } from "@/services/api";

/**
 * Demo agents data — 30 agents with realistic real estate data.
 */
const DEMO_AGENTS = Array.from({ length: 30 }, (_, i) => {
  const agentNames = [
    "Marcus Rivera", "Priya Sharma", "Daniel O'Brien", "Yuki Tanaka", "Elena Vasquez",
    "Omar Hassan", "Sophie Laurent", "Raj Patel", "Isabella Romano", "Liam Chen",
    "Aisha Khan", "Thomas Beck", "Mei Lin Wu", "Carlos Mendez", "Jessica Palmer",
    "Andrei Petrov", "Fatima Al-Said", "Kevin O'Donnell", "Haruka Sato", "Nina Johansson",
    "Victor Costa", "Amara Diallo", "Ryan Mitchell", "Zara Hussain", "Felix Müller",
    "Leila Nazari", "Patrick Flynn", "Sakura Ito", "Diego Herrera", "Anya Volkov",
  ];

  const agencies = [
    "Platinum Realty Group", "Skyline Properties", "Urban Edge Real Estate",
    "Pacific Coast Homes", "Summit Realty Partners", "Metro Living Brokers",
    "Coastal Elite Properties", "Prime Location Realty", "Heritage Home Group",
    "NextGen Real Estate",
  ];

  const statuses = ["Verified", "Verified", "Verified", "Pending", "Verified", "Rejected"];
  const name = agentNames[i % agentNames.length];
  const first = name.split(" ")[0].toLowerCase();

  return {
    id: `agt_${String(i + 1).padStart(3, "0")}`,
    name,
    email: `${first}@${agencies[i % agencies.length].split(" ")[0].toLowerCase()}.com`,
    agency: agencies[i % agencies.length],
    phone: `+1 (555) ${String(200 + i).padStart(3, "0")}-${String(2000 + i * 13).slice(0, 4)}`,
    listings: Math.floor(5 + Math.random() * 60),
    rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
    verification: statuses[i % statuses.length],
    joinDate: new Date(2024, 6 + Math.floor(i / 3), 1 + (i % 28)).toISOString(),
    avatar: name.charAt(0),
    bio: `Specializing in ${["residential", "commercial", "luxury", "mixed-use"][i % 4]} properties with ${5 + Math.floor(i / 2)} years of experience.`,
    totalDeals: Math.floor(10 + Math.random() * 80),
    revenue: `$${(0.5 + Math.random() * 4).toFixed(1)}M`,
    properties: Array.from({ length: Math.min(3 + (i % 4), 5) }, (_, j) => ({
      id: `prop_${i}_${j}`,
      name: ["Skyline Tower", "Ocean View Villa", "Greenwood Estate", "Harbor Point Condo", "Riverside Loft"][j % 5],
      price: ["$2.4M", "$5.8M", "$890K", "$1.1M", "$620K"][j % 5],
      status: ["Active", "Sold", "Pending"][j % 3],
    })),
    trades: Array.from({ length: Math.min(2 + (i % 3), 4) }, (_, j) => ({
      id: `trd_${i}_${j}`,
      property: ["Skyline Tower", "Ocean View Villa", "Greenwood Estate"][j % 3],
      amount: ["$2.4M", "$5.8M", "$890K"][j % 3],
      date: new Date(2026, 2 - j, 10 + j * 5).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: ["Completed", "In Progress", "Completed"][j % 3],
    })),
  };
});

/**
 * Filter and paginate demo agents.
 */
function filterDemoAgents({ page = 1, limit = 20, search, rating, verification, sortBy, sortOrder }) {
  let filtered = [...DEMO_AGENTS];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (a) => a.name.toLowerCase().includes(q) || a.agency.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)
    );
  }

  if (rating && rating !== "all") {
    const minRating = parseFloat(rating);
    filtered = filtered.filter((a) => a.rating >= minRating);
  }

  if (verification && verification !== "all") {
    filtered = filtered.filter((a) => a.verification.toLowerCase() === verification.toLowerCase());
  }

  if (sortBy) {
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (typeof aVal === "string") { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase(); }
      if (aVal < bVal) return sortOrder === "desc" ? 1 : -1;
      if (aVal > bVal) return sortOrder === "desc" ? -1 : 1;
      return 0;
    });
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const agents = filtered.slice(start, start + limit);

  return { agents, total, page, totalPages, limit };
}

/**
 * Hook: fetch paginated agents list.
 */
export function useAgents(params = {}) {
  return useQuery({
    queryKey: ["agents", params],
    queryFn: async () => {
      try {
        const res = await agentsAPI.getAll(params);
        return res.data;
      } catch {
        return { ...filterDemoAgents(params), isDemo: true };
      }
    },
    staleTime: 30 * 1000,
    keepPreviousData: true,
  });
}

/**
 * Hook: fetch single agent by ID.
 */
export function useAgent(id) {
  return useQuery({
    queryKey: ["agent", id],
    queryFn: async () => {
      try {
        const res = await agentsAPI.getById(id);
        return res.data;
      } catch {
        return DEMO_AGENTS.find((a) => a.id === id) || null;
      }
    },
    enabled: !!id,
  });
}
