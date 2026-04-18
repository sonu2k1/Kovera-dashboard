import { useQuery } from "@tanstack/react-query";
import { propertiesAPI } from "@/services/api";

/* ── Demo properties (40 items) ── */
const DEMO_PROPERTIES = Array.from({ length: 40 }, (_, i) => {
  const titles = [
    "Skyline Tower, Unit 42A", "Ocean View Villa", "Greenwood Estate", "Harbor Point Condo",
    "Riverside Loft", "Pacific Heights Manor", "The Metropolitan", "Chelsea Brownstone",
    "Lakeside Retreat", "Pinnacle Penthouse", "Coral Bay Residence", "Sunset Ridge Home",
    "Downtown Studio", "Maple Grove House", "Beacon Hill Townhouse", "Silver Lake Duplex",
    "Windmill Cottage", "Emerald Bay House", "Aspen Lodge", "Palm Court Apartment",
  ];
  const locations = [
    "Manhattan, NY", "Malibu, CA", "Austin, TX", "Miami, FL", "Chicago, IL",
    "San Francisco, CA", "Seattle, WA", "Brooklyn, NY", "Denver, CO", "Boston, MA",
  ];
  const types = ["Sale", "Rent", "Sale", "Sale", "Rent"];
  const propertyTypes = ["Apartment", "Villa", "House", "Condo", "Loft", "Penthouse", "Townhouse", "Studio"];
  const statuses = ["Active", "Active", "Pending", "Active", "Sold", "Active"];
  const prices = [2400000, 5800000, 890000, 1100000, 620000, 3200000, 1850000, 750000, 980000, 4500000];
  const agents = [
    { name: "Marcus Rivera", agency: "Platinum Realty Group" },
    { name: "Priya Sharma", agency: "Skyline Properties" },
    { name: "Daniel O'Brien", agency: "Urban Edge Real Estate" },
    { name: "Yuki Tanaka", agency: "Pacific Coast Homes" },
    { name: "Elena Vasquez", agency: "Summit Realty Partners" },
  ];

  const price = prices[i % prices.length] + (i * 10000);

  return {
    id: `prop_${String(i + 1).padStart(3, "0")}`,
    title: titles[i % titles.length] + (i >= 20 ? ` #${i - 19}` : ""),
    location: locations[i % locations.length],
    price,
    priceFormatted: price >= 1000000 ? `$${(price / 1000000).toFixed(1)}M` : `$${(price / 1000).toFixed(0)}K`,
    type: types[i % types.length],
    propertyType: propertyTypes[i % propertyTypes.length],
    status: statuses[i % statuses.length],
    likes: Math.floor(20 + Math.random() * 300),
    beds: 1 + (i % 5),
    baths: 1 + (i % 3),
    sqft: `${800 + i * 50}`,
    yearBuilt: 2010 + (i % 15),
    description: `A stunning ${propertyTypes[i % propertyTypes.length].toLowerCase()} in ${locations[i % locations.length]} featuring modern finishes, open floor plan, and premium amenities. Perfect for ${types[i % types.length] === "Rent" ? "tenants" : "buyers"} looking for a premium living experience.`,
    agent: agents[i % agents.length],
    images: [
      `https://picsum.photos/seed/prop${i}a/600/400`,
      `https://picsum.photos/seed/prop${i}b/600/400`,
      `https://picsum.photos/seed/prop${i}c/600/400`,
    ],
    likedBy: Array.from({ length: Math.min(3 + (i % 4), 6) }, (_, j) => ({
      id: `user_${j}`,
      name: ["Sarah Chen", "James Wright", "Emily Davis", "Alex Kim", "Lisa Turner", "Robert Lee"][j],
      avatar: ["S", "J", "E", "A", "L", "R"][j],
    })),
    trades: i % 3 === 0 ? [
      { id: `t_${i}_1`, buyer: "James Wright", amount: `$${(price / 1000000).toFixed(1)}M`, date: "Mar 10, 2026", status: "Completed" },
    ] : [],
    createdAt: new Date(2025, 6 + Math.floor(i / 4), 1 + (i % 28)).toISOString(),
  };
});

/**
 * Filter and paginate demo properties.
 */
function filterDemoProperties({ page = 1, limit = 20, search, type, location, priceMin, priceMax, sortBy, sortOrder }) {
  let filtered = [...DEMO_PROPERTIES];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((p) =>
      p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.propertyType.toLowerCase().includes(q)
    );
  }
  if (type && type !== "all") {
    filtered = filtered.filter((p) => p.type.toLowerCase() === type.toLowerCase());
  }
  if (location && location !== "all") {
    filtered = filtered.filter((p) => p.location.toLowerCase().includes(location.toLowerCase()));
  }
  if (priceMin) filtered = filtered.filter((p) => p.price >= Number(priceMin));
  if (priceMax) filtered = filtered.filter((p) => p.price <= Number(priceMax));

  if (sortBy) {
    filtered.sort((a, b) => {
      let aV = a[sortBy], bV = b[sortBy];
      if (typeof aV === "string") { aV = aV.toLowerCase(); bV = bV.toLowerCase(); }
      if (aV < bV) return sortOrder === "desc" ? 1 : -1;
      if (aV > bV) return sortOrder === "desc" ? -1 : 1;
      return 0;
    });
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const properties = filtered.slice(start, start + limit);

  return { properties, total, page, totalPages, limit };
}

/**
 * Hook: fetch paginated properties.
 */
export function useProperties(params = {}) {
  return useQuery({
    queryKey: ["properties", params],
    queryFn: async () => {
      try {
        const res = await propertiesAPI.getAll(params);
        return res.data;
      } catch {
        return { ...filterDemoProperties(params), isDemo: true };
      }
    },
    staleTime: 30 * 1000,
    keepPreviousData: true,
  });
}

/**
 * Hook: fetch single property.
 */
export function useProperty(id) {
  return useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      try {
        const res = await propertiesAPI.getById(id);
        return res.data;
      } catch {
        return DEMO_PROPERTIES.find((p) => p.id === id) || null;
      }
    },
    enabled: !!id,
  });
}

/** Unique location list for filter dropdown */
export const LOCATIONS = [...new Set(DEMO_PROPERTIES.map((p) => p.location))].sort();

/**
 * Hook: update property status
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdatePropertyStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      try {
        const res = await propertiesAPI.updateStatus(id, status);
        return res.data;
      } catch (err) {
        if (!err.response) return { id, status }; // Demo mode
        throw err;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["property"] });
      window.dispatchEvent(new CustomEvent("kovera:toast", {
        detail: { type: "success", title: "Success", message: `Property marked as ${variables.status}` }
      }));
    },
    onError: () => {
      window.dispatchEvent(new CustomEvent("kovera:toast", {
        detail: { type: "error", title: "Error", message: "Failed to update property status" }
      }));
    }
  });
}
