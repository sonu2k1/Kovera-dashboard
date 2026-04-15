import { useQuery } from "@tanstack/react-query";
import { tradesAPI } from "@/services/api";

/* ── Demo trades (35 items) ── */
const DEMO_TRADES = Array.from({ length: 35 }, (_, i) => {
  const properties = [
    "Skyline Tower, Unit 42A", "Ocean View Villa", "Greenwood Estate", "Harbor Point Condo",
    "Riverside Loft", "Pacific Heights Manor", "The Metropolitan", "Chelsea Brownstone",
    "Lakeside Retreat", "Pinnacle Penthouse",
  ];
  const buyers = [
    "James Wright", "Michael Ross", "Lisa Park", "Robert Lee", "Emily Davis",
    "Alex Kim", "Sophie Miller", "David Brown", "Rachel Green", "Nathan Scott",
  ];
  const agents = [
    "Marcus Rivera", "Priya Sharma", "Daniel O'Brien", "Yuki Tanaka", "Elena Vasquez",
  ];
  const statuses = ["Active", "Completed", "Active", "Completed", "Cancelled", "Completed"];
  const values = [2400000, 5800000, 890000, 1100000, 620000, 3200000, 1850000, 750000, 980000, 4500000];

  const value = values[i % values.length] + (i * 15000);
  const status = statuses[i % statuses.length];
  const createdDate = new Date(2026, 0 + Math.floor(i / 5), 3 + (i % 25));

  // Build timeline based on status
  const timeline = [
    { step: "Trade Initiated", date: createdDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), completed: true, description: "Trade request submitted by buyer" },
    { step: "Documents Submitted", date: new Date(createdDate.getTime() + 2 * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), completed: true, description: "Buyer uploaded required documentation" },
    { step: "Agent Review", date: new Date(createdDate.getTime() + 5 * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), completed: status !== "Active", description: "Agent reviewed trade and verified details" },
    { step: "Payment Processing", date: new Date(createdDate.getTime() + 8 * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), completed: status === "Completed", description: "Secure payment processed through escrow" },
    { step: "Trade Completed", date: new Date(createdDate.getTime() + 12 * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), completed: status === "Completed", description: "Ownership transferred and trade finalized" },
  ];

  if (status === "Cancelled") {
    timeline.splice(3, 2, {
      step: "Trade Cancelled",
      date: new Date(createdDate.getTime() + 6 * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      completed: true,
      cancelled: true,
      description: "Trade was cancelled by the buyer",
    });
  }

  return {
    id: `TRD-${String(1000 + i).padStart(4, "0")}`,
    property: properties[i % properties.length],
    propertyLocation: ["Manhattan, NY", "Malibu, CA", "Austin, TX", "Miami, FL", "Chicago, IL"][i % 5],
    buyer: buyers[i % buyers.length],
    buyerEmail: `${buyers[i % buyers.length].split(" ")[0].toLowerCase()}@email.com`,
    agent: agents[i % agents.length],
    agentAgency: ["Platinum Realty", "Skyline Properties", "Urban Edge", "Pacific Coast", "Summit Realty"][i % 5],
    status,
    value,
    valueFormatted: value >= 1000000 ? `$${(value / 1000000).toFixed(1)}M` : `$${(value / 1000).toFixed(0)}K`,
    createdAt: createdDate.toISOString(),
    createdAtFormatted: createdDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    timeline,
  };
});

/**
 * Filter and paginate demo trades.
 */
function filterDemoTrades({ page = 1, limit = 20, search, status, sortBy = "createdAt", sortOrder = "desc" }) {
  let filtered = [...DEMO_TRADES];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (t) => t.id.toLowerCase().includes(q) || t.property.toLowerCase().includes(q) ||
        t.buyer.toLowerCase().includes(q) || t.agent.toLowerCase().includes(q)
    );
  }
  if (status && status !== "all") {
    filtered = filtered.filter((t) => t.status.toLowerCase() === status.toLowerCase());
  }

  filtered.sort((a, b) => {
    let aV = a[sortBy], bV = b[sortBy];
    if (sortBy === "createdAt") { aV = new Date(aV).getTime(); bV = new Date(bV).getTime(); }
    else if (typeof aV === "string") { aV = aV.toLowerCase(); bV = bV.toLowerCase(); }
    if (aV < bV) return sortOrder === "desc" ? 1 : -1;
    if (aV > bV) return sortOrder === "desc" ? -1 : 1;
    return 0;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const trades = filtered.slice(start, start + limit);
  return { trades, total, page, totalPages, limit };
}

/**
 * Hook: fetch paginated trades.
 */
export function useTrades(params = {}) {
  return useQuery({
    queryKey: ["trades", params],
    queryFn: async () => {
      try {
        const res = await tradesAPI.getAll(params);
        return res.data;
      } catch {
        return { ...filterDemoTrades(params), isDemo: true };
      }
    },
    staleTime: 30 * 1000,
    keepPreviousData: true,
  });
}

/**
 * Hook: fetch single trade.
 */
export function useTrade(id) {
  return useQuery({
    queryKey: ["trade", id],
    queryFn: async () => {
      try {
        const res = await tradesAPI.getById(id);
        return res.data;
      } catch {
        return DEMO_TRADES.find((t) => t.id === id) || null;
      }
    },
    enabled: !!id,
  });
}
