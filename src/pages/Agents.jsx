import { useState, useCallback } from "react";
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Select,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui";
import {
  UserPlus,
  Search,
  X,
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Mail,
  Phone,
  Calendar,
  Building2,
  ArrowLeftRight,
  BadgeCheck,
  Clock,
  ShieldCheck,
  ShieldX,
  ShieldQuestion,
  Trophy,
  DollarSign,
  Eye,
  UserCog,
} from "lucide-react";
import { useAgents, useAgent } from "@/services/hooks/useAgents";

/* ── Verification config ── */
const VERIFICATION_CONFIG = {
  Verified: { badge: "success", icon: ShieldCheck, color: "text-green-400", bg: "bg-green-500/10" },
  Pending: { badge: "warning", icon: ShieldQuestion, color: "text-amber-400", bg: "bg-amber-500/10" },
  Rejected: { badge: "danger", icon: ShieldX, color: "text-red-400", bg: "bg-red-500/10" },
};

/* ── Rating stars ── */
function RatingStars({ rating, size = "sm" }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`${iconSize} ${
            i < full
              ? "text-amber-400 fill-amber-400"
              : i === full && hasHalf
              ? "text-amber-400 fill-amber-400/50"
              : "text-navy-500"
          }`}
        />
      ))}
      <span className="ml-1.5 text-xs font-semibold text-white">{rating}</span>
    </div>
  );
}

/* ── Sort icon ── */
function SortIcon({ field, current, order }) {
  if (current !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />;
  return order === "asc" ? <ArrowUp className="w-3.5 h-3.5 text-primary" /> : <ArrowDown className="w-3.5 h-3.5 text-primary" />;
}

/* ── Table skeleton ── */
function TableSkeleton({ rows = 6 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-border/50">
          <td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl skeleton" /><div className="space-y-1.5"><div className="h-4 w-28 skeleton rounded" /><div className="h-3 w-36 skeleton rounded" /></div></div></td>
          <td className="px-5 py-3.5"><div className="h-4 w-32 skeleton rounded" /></td>
          <td className="px-5 py-3.5"><div className="h-4 w-8 skeleton rounded" /></td>
          <td className="px-5 py-3.5"><div className="h-4 w-20 skeleton rounded" /></td>
          <td className="px-5 py-3.5"><div className="h-5 w-16 skeleton rounded-full" /></td>
          <td className="px-5 py-3.5"><div className="h-4 w-6 skeleton rounded" /></td>
        </tr>
      ))}
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   AGENT DETAIL MODAL
   ══════════════════════════════════════════════════════════ */
function AgentDetailModal({ agentId, onClose }) {
  const { data: agent, isLoading } = useAgent(agentId);
  const [tab, setTab] = useState("profile");

  if (!agentId) return null;

  const verif = agent ? VERIFICATION_CONFIG[agent.verification] || VERIFICATION_CONFIG.Pending : null;
  const VerifIcon = verif?.icon || ShieldQuestion;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-navy-900 border border-border shadow-elevated animate-scale-in">
        {isLoading ? (
          <div className="p-16 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : agent ? (
          <>
            {/* ── Header ── */}
            <div className="flex items-start justify-between p-5 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-primary/20">
                  {agent.name?.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-white">{agent.name}</h2>
                    {/* Verification badge */}
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${verif.bg} ${verif.color}`}>
                      <VerifIcon className="w-3 h-3" />
                      {agent.verification}
                    </div>
                  </div>
                  <p className="text-sm text-muted">{agent.agency}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{agent.email}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl text-muted hover:text-white hover:bg-surface-hover transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── Stats Bar ── */}
            <div className="grid grid-cols-4 gap-3 p-5 border-b border-border">
              <div className="text-center">
                <p className="text-xl font-bold text-white">{agent.listings}</p>
                <p className="text-[11px] text-muted">Listings</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">{agent.totalDeals}</p>
                <p className="text-[11px] text-muted">Deals</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">{agent.revenue}</p>
                <p className="text-[11px] text-muted">Revenue</p>
              </div>
              <div className="text-center">
                <RatingStars rating={agent.rating} />
                <p className="text-[11px] text-muted mt-0.5">Rating</p>
              </div>
            </div>

            {/* ── Tabs ── */}
            <div className="p-5">
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList>
                  <TabsTrigger value="profile"><UserCog className="w-4 h-4" /> Profile</TabsTrigger>
                  <TabsTrigger value="properties"><Building2 className="w-4 h-4" /> Listings</TabsTrigger>
                  <TabsTrigger value="trades"><ArrowLeftRight className="w-4 h-4" /> Trades</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile">
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-navy-950 border border-border">
                      <p className="text-xs text-muted mb-1">Bio</p>
                      <p className="text-sm text-white">{agent.bio}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-navy-950 border border-border">
                        <div className="flex items-center gap-2 mb-1"><Phone className="w-3.5 h-3.5 text-muted-foreground" /><p className="text-xs text-muted">Phone</p></div>
                        <p className="text-sm font-medium text-white">{agent.phone}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-navy-950 border border-border">
                        <div className="flex items-center gap-2 mb-1"><Calendar className="w-3.5 h-3.5 text-muted-foreground" /><p className="text-xs text-muted">Joined</p></div>
                        <p className="text-sm font-medium text-white">{new Date(agent.joinDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Properties Tab */}
                <TabsContent value="properties">
                  {agent.properties?.length > 0 ? (
                    <div className="space-y-2">
                      {agent.properties.map((p) => (
                        <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-navy-950 border border-border hover:border-border-light transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{p.name}</p>
                              <p className="text-xs text-muted">{p.price}</p>
                            </div>
                          </div>
                          <Badge variant={p.status === "Active" ? "success" : p.status === "Sold" ? "info" : "warning"}>
                            {p.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted text-center py-8">No properties listed</p>
                  )}
                </TabsContent>

                {/* Trades Tab */}
                <TabsContent value="trades">
                  {agent.trades?.length > 0 ? (
                    <div className="space-y-2">
                      {agent.trades.map((t) => (
                        <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-navy-950 border border-border hover:border-border-light transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                              <ArrowLeftRight className="w-4 h-4 text-amber-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{t.property}</p>
                              <p className="text-xs text-muted">{t.date} · {t.amount}</p>
                            </div>
                          </div>
                          <Badge variant={t.status === "Completed" ? "success" : "info"}>
                            {t.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted text-center py-8">No trade history</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 p-5 border-t border-border">
              <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
              <Button size="sm"><Mail className="w-4 h-4" /> Contact Agent</Button>
            </div>
          </>
        ) : (
          <div className="p-16 text-center text-muted">Agent not found</div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   AGENTS PAGE (Main)
   ══════════════════════════════════════════════════════════ */
export default function AgentsPage() {
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const limit = 20;

  const { data, isLoading } = useAgents({
    page,
    limit,
    search,
    rating: ratingFilter,
    verification: verificationFilter,
    sortBy,
    sortOrder,
  });

  const agents = data?.agents || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const handleSort = useCallback((field) => {
    setSortBy((prev) => {
      if (prev === field) { setSortOrder((o) => (o === "asc" ? "desc" : "asc")); return field; }
      setSortOrder("asc");
      return field;
    });
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearch(""); setRatingFilter("all"); setVerificationFilter("all"); setPage(1);
  }, []);

  const hasActiveFilters = ratingFilter !== "all" || verificationFilter !== "all";

  // Summary counts
  const verifiedCount = agents.filter((a) => a.verification === "Verified").length;
  const pendingCount = agents.filter((a) => a.verification === "Pending").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Agents</h1>
          <p className="text-muted mt-1 text-sm">
            Manage real estate agents ·{" "}
            <span className="text-white font-medium">{total}</span> total
          </p>
        </div>
        <Button><UserPlus className="w-4 h-4" /> Add Agent</Button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4 p-4">
          <div className="p-2.5 rounded-xl bg-green-500/10"><ShieldCheck className="w-5 h-5 text-green-400" /></div>
          <div>
            <p className="text-2xl font-bold text-white">{verifiedCount}</p>
            <p className="text-xs text-muted">Verified</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10"><Clock className="w-5 h-5 text-amber-400" /></div>
          <div>
            <p className="text-2xl font-bold text-white">{pendingCount}</p>
            <p className="text-xs text-muted">Pending</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-4">
          <div className="p-2.5 rounded-xl bg-primary/10"><Trophy className="w-5 h-5 text-primary" /></div>
          <div>
            <p className="text-2xl font-bold text-white">{agents.length > 0 ? Math.max(...agents.map((a) => a.rating)).toFixed(1) : "—"}</p>
            <p className="text-xs text-muted">Top Rating</p>
          </div>
        </Card>
      </div>

      {/* ── Search + Filter Bar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text" placeholder="Search agents, agencies..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-navy-900 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:input-ring hover:border-border-light transition-all"
          />
          {search && (<button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white cursor-pointer"><X className="w-3.5 h-3.5" /></button>)}
        </div>

        <div className="relative">
          <Select
            value={ratingFilter}
            onChange={(e) => { setRatingFilter(e.target.value); setPage(1); }}
            options={[
              { value: "all", label: "All Ratings" },
              { value: "4.5", label: "4.5+ ★" },
              { value: "4.0", label: "4.0+ ★" },
              { value: "3.5", label: "3.5+ ★" },
            ]}
            size="sm"
          />
        </div>

        <div className="relative">
          <Select
            value={verificationFilter}
            onChange={(e) => { setVerificationFilter(e.target.value); setPage(1); }}
            options={[
              { value: "all", label: "All Status" },
              { value: "verified", label: "Verified" },
              { value: "pending", label: "Pending" },
              { value: "rejected", label: "Rejected" },
            ]}
            size="sm"
          />
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}><X className="w-3.5 h-3.5" /> Clear</Button>
        )}
      </div>

      {/* ── Table ── */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3">
                  <button onClick={() => handleSort("name")} className="flex items-center gap-1.5 text-xs font-medium text-muted uppercase tracking-wider hover:text-white transition-colors cursor-pointer">
                    Agent <SortIcon field="name" current={sortBy} order={sortOrder} />
                  </button>
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">Agency</th>
                <th className="text-left px-5 py-3">
                  <button onClick={() => handleSort("listings")} className="flex items-center gap-1.5 text-xs font-medium text-muted uppercase tracking-wider hover:text-white transition-colors cursor-pointer">
                    Listings <SortIcon field="listings" current={sortBy} order={sortOrder} />
                  </button>
                </th>
                <th className="text-left px-5 py-3">
                  <button onClick={() => handleSort("rating")} className="flex items-center gap-1.5 text-xs font-medium text-muted uppercase tracking-wider hover:text-white transition-colors cursor-pointer">
                    Rating <SortIcon field="rating" current={sortBy} order={sortOrder} />
                  </button>
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableSkeleton />
              ) : agents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <UserCog className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-white font-medium mb-1">No agents found</p>
                    <p className="text-sm text-muted">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                agents.map((agent) => {
                  const vConf = VERIFICATION_CONFIG[agent.verification] || VERIFICATION_CONFIG.Pending;
                  const VIcon = vConf.icon;
                  return (
                    <tr
                      key={agent.id}
                      onClick={() => setSelectedAgentId(agent.id)}
                      className="border-b border-border/50 last:border-0 hover:bg-surface-hover transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 text-sm font-semibold shrink-0 group-hover:bg-purple-500/15 transition-colors">
                            {agent.name?.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white group-hover:text-primary-light transition-colors truncate">{agent.name}</p>
                            <p className="text-xs text-muted truncate">{agent.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-muted">{agent.agency}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-semibold text-white">{agent.listings}</span>
                      </td>
                      <td className="px-5 py-3.5"><RatingStars rating={agent.rating} /></td>
                      <td className="px-5 py-3.5">
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${vConf.bg} ${vConf.color}`}>
                          <VIcon className="w-3 h-3" />{agent.verification}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <button className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-surface transition-colors cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <p className="text-xs text-muted">
              Showing <span className="text-white font-medium">{(page - 1) * limit + 1}</span>–
              <span className="text-white font-medium">{Math.min(page * limit, total)}</span> of{" "}
              <span className="text-white font-medium">{total}</span>
            </p>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon-sm" disabled={page <= 1} onClick={() => setPage(1)}><ChevronsLeft className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="w-4 h-4" /></Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pn; if (totalPages <= 5) pn = i + 1; else if (page <= 3) pn = i + 1; else if (page >= totalPages - 2) pn = totalPages - 4 + i; else pn = page - 2 + i;
                return <Button key={pn} variant={page === pn ? "secondary" : "ghost"} size="icon-sm" onClick={() => setPage(pn)} className={page === pn ? "border border-primary/30 text-primary" : ""}>{pn}</Button>;
              })}
              <Button variant="ghost" size="icon-sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon-sm" disabled={page >= totalPages} onClick={() => setPage(totalPages)}><ChevronsRight className="w-4 h-4" /></Button>
            </div>
          </div>
        )}
      </Card>

      {/* ── Detail Modal ── */}
      {selectedAgentId && (
        <AgentDetailModal agentId={selectedAgentId} onClose={() => setSelectedAgentId(null)} />
      )}
    </div>
  );
}
