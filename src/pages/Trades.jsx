import { useState, useCallback } from "react";
import {
  Button, Badge, Card, CardContent, Select,
} from "@/components/ui";
import {
  Plus, Search, X, ArrowLeftRight, Building2, User, UserCog,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowUpDown, ArrowUp, ArrowDown, Eye, DollarSign, Calendar,
  CheckCircle2, Circle, XCircle, Clock, MapPin, Hash, ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTrades, useTrade } from "@/services/hooks/useTrades";

/* ── Status config ── */
const STATUS_CONFIG = {
  Active: { badge: "info", color: "text-blue-400", bg: "bg-blue-500/10", icon: Clock },
  Completed: { badge: "success", color: "text-green-400", bg: "bg-green-500/10", icon: CheckCircle2 },
  Cancelled: { badge: "danger", color: "text-red-400", bg: "bg-red-500/10", icon: XCircle },
};

/* ── Sort icon ── */
function SortIcon({ field, current, order }) {
  if (current !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />;
  return order === "asc" ? <ArrowUp className="w-3.5 h-3.5 text-primary" /> : <ArrowDown className="w-3.5 h-3.5 text-primary" />;
}

/* ── Table skeleton ── */
function TableSkeleton({ rows = 6 }) {
  return (<>{Array.from({ length: rows }).map((_, i) => (
    <tr key={i} className="border-b border-border/50">
      <td className="px-5 py-3.5"><div className="h-4 w-20 skeleton rounded" /></td>
      <td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg skeleton" /><div className="h-4 w-32 skeleton rounded" /></div></td>
      <td className="px-5 py-3.5"><div className="h-4 w-24 skeleton rounded" /></td>
      <td className="px-5 py-3.5"><div className="h-4 w-24 skeleton rounded" /></td>
      <td className="px-5 py-3.5"><div className="h-5 w-16 skeleton rounded-full" /></td>
      <td className="px-5 py-3.5"><div className="h-4 w-20 skeleton rounded" /></td>
    </tr>
  ))}</>);
}

/* ══════════════════════════════════════════════════════
   TIMELINE COMPONENT
   ══════════════════════════════════════════════════════ */
function TradeTimeline({ timeline }) {
  return (
    <div className="relative pl-6">
      {/* Vertical line */}
      <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" />

      <div className="space-y-0">
        {timeline.map((step, idx) => {
          const isLast = idx === timeline.length - 1;
          const dotColor = step.cancelled
            ? "bg-red-400 shadow-red-400/30"
            : step.completed
            ? "bg-primary shadow-primary/30"
            : "bg-navy-500";

          return (
            <div key={idx} className="relative pb-6 last:pb-0">
              {/* Dot */}
              <div className={`absolute -left-6 top-1 w-[18px] h-[18px] rounded-full border-[3px] border-navy-900 ${dotColor} ${step.completed ? "shadow-md" : ""}`}>
                {step.completed && !step.cancelled && (
                  <CheckCircle2 className="w-full h-full text-navy-900 p-px" />
                )}
                {step.cancelled && (
                  <XCircle className="w-full h-full text-navy-900 p-px" />
                )}
              </div>

              {/* Content */}
              <div className={`ml-4 p-3 rounded-xl border transition-all ${
                step.cancelled
                  ? "bg-red-500/5 border-red-500/20"
                  : step.completed
                  ? "bg-navy-950 border-border"
                  : "bg-navy-950/50 border-border/50"
              }`}>
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${
                    step.cancelled ? "text-red-400" : step.completed ? "text-white" : "text-muted-foreground"
                  }`}>
                    {step.step}
                  </p>
                  <span className="text-[11px] text-muted-foreground">{step.date}</span>
                </div>
                <p className={`text-xs mt-1 ${step.completed ? "text-muted" : "text-muted-foreground/60"}`}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TRADE DETAIL MODAL
   ══════════════════════════════════════════════════════ */
function TradeDetailModal({ tradeId, onClose }) {
  const { data: trade, isLoading } = useTrade(tradeId);
  const navigate = useNavigate();

  if (!tradeId) return null;

  const sConf = trade ? STATUS_CONFIG[trade.status] || STATUS_CONFIG.Active : null;
  const SIcon = sConf?.icon || Clock;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-navy-900 border border-border shadow-elevated animate-scale-in">
        {isLoading ? (
          <div className="p-16 flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
        ) : trade ? (
          <>
            {/* ── Header ── */}
            <div className="p-5 border-b border-border">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-navy-950 px-2 py-0.5 rounded-md border border-border">
                      <Hash className="w-3 h-3" /> {trade.id}
                    </div>
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${sConf.bg} ${sConf.color}`}>
                      <SIcon className="w-3 h-3" /> {trade.status}
                    </div>
                  </div>
                  <h2
                    className="text-lg font-bold text-white mt-2 hover:text-primary-light transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    onClick={() => { onClose(); navigate("/properties"); }}
                  >
                    {trade.property}
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                  </h2>
                  <div className="flex items-center gap-1.5 text-sm text-muted mt-0.5">
                    <MapPin className="w-3.5 h-3.5" /> {trade.propertyLocation}
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl text-muted hover:text-white hover:bg-surface-hover transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Value + Date */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="text-lg font-bold text-primary">{trade.valueFormatted}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Calendar className="w-4 h-4" /> {trade.createdAtFormatted}
                </div>
              </div>
            </div>

            {/* ── Parties ── */}
            <div className="p-5 border-b border-border">
              <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Involved Parties</p>
              <div className="grid grid-cols-2 gap-3">
                {/* Buyer */}
                <div
                  className="p-3 rounded-xl bg-navy-950 border border-border hover:border-blue-500/30 transition-colors cursor-pointer group/buyer"
                  onClick={() => { onClose(); navigate("/users"); }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-[11px] text-blue-400 font-medium uppercase">Buyer</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover/buyer:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm font-medium text-white group-hover/buyer:text-blue-400 transition-colors">{trade.buyer}</p>
                  <p className="text-xs text-muted mt-0.5">{trade.buyerEmail}</p>
                </div>
                {/* Agent */}
                <div
                  className="p-3 rounded-xl bg-navy-950 border border-border hover:border-purple-500/30 transition-colors cursor-pointer group/agent"
                  onClick={() => { onClose(); navigate("/agents"); }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <UserCog className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-[11px] text-purple-400 font-medium uppercase">Agent</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover/agent:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm font-medium text-white group-hover/agent:text-purple-400 transition-colors">{trade.agent}</p>
                  <p className="text-xs text-muted mt-0.5">{trade.agentAgency}</p>
                </div>
              </div>
            </div>

            {/* ── Timeline ── */}
            <div className="p-5">
              <p className="text-xs font-medium text-muted uppercase tracking-wider mb-4">Trade Timeline</p>
              <TradeTimeline timeline={trade.timeline} />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 p-5 border-t border-border">
              <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
              {trade.status === "Active" && (
                <Button size="sm"><CheckCircle2 className="w-4 h-4" /> Mark Complete</Button>
              )}
            </div>
          </>
        ) : (
          <div className="p-16 text-center text-muted">Trade not found</div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TRADES PAGE (Main)
   ══════════════════════════════════════════════════════ */
export default function TradesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [selectedTradeId, setSelectedTradeId] = useState(null);
  const limit = 20;

  const { data, isLoading } = useTrades({
    page, limit, search,
    status: statusFilter,
    sortBy, sortOrder,
  });

  const trades = data?.trades || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const handleSort = useCallback((field) => {
    setSortBy((prev) => {
      if (prev === field) { setSortOrder((o) => (o === "asc" ? "desc" : "asc")); return field; }
      setSortOrder("asc"); return field;
    });
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearch(""); setStatusFilter("all"); setPage(1);
  }, []);

  // Summary
  const activeCount = trades.filter((t) => t.status === "Active").length;
  const completedCount = trades.filter((t) => t.status === "Completed").length;
  const cancelledCount = trades.filter((t) => t.status === "Cancelled").length;
  const totalValue = trades.reduce((acc, t) => acc + t.value, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Trades</h1>
          <p className="text-muted mt-1 text-sm">
            Track property trade transactions · <span className="text-white font-medium">{total}</span> total
          </p>
        </div>
        <Button><Plus className="w-4 h-4" /> New Trade</Button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4 p-4">
          <div className="p-2.5 rounded-xl bg-blue-500/10"><Clock className="w-5 h-5 text-blue-400" /></div>
          <div>
            <p className="text-2xl font-bold text-white">{activeCount}</p>
            <p className="text-xs text-muted">Active</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-4">
          <div className="p-2.5 rounded-xl bg-green-500/10"><CheckCircle2 className="w-5 h-5 text-green-400" /></div>
          <div>
            <p className="text-2xl font-bold text-white">{completedCount}</p>
            <p className="text-xs text-muted">Completed</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-4">
          <div className="p-2.5 rounded-xl bg-red-500/10"><XCircle className="w-5 h-5 text-red-400" /></div>
          <div>
            <p className="text-2xl font-bold text-white">{cancelledCount}</p>
            <p className="text-xs text-muted">Cancelled</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-4">
          <div className="p-2.5 rounded-xl bg-primary/10"><DollarSign className="w-5 h-5 text-primary" /></div>
          <div>
            <p className="text-2xl font-bold text-white">{totalValue >= 1000000 ? `$${(totalValue / 1000000).toFixed(1)}M` : `$${(totalValue / 1000).toFixed(0)}K`}</p>
            <p className="text-xs text-muted">Page Value</p>
          </div>
        </Card>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search by ID, property, buyer, agent..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-navy-900 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:input-ring hover:border-border-light transition-all"
          />
          {search && (<button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white cursor-pointer"><X className="w-3.5 h-3.5" /></button>)}
        </div>

        <div className="relative">
          <Select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            options={[
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "completed", label: "Completed" },
              { value: "cancelled", label: "Cancelled" },
            ]}
            size="sm"
          />
        </div>

        {(statusFilter !== "all" || search) && (
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
                  <button onClick={() => handleSort("id")} className="flex items-center gap-1.5 text-xs font-medium text-muted uppercase tracking-wider hover:text-white transition-colors cursor-pointer">
                    Trade ID <SortIcon field="id" current={sortBy} order={sortOrder} />
                  </button>
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">Property</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">Buyer</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">Agent</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3">
                  <button onClick={() => handleSort("createdAt")} className="flex items-center gap-1.5 text-xs font-medium text-muted uppercase tracking-wider hover:text-white transition-colors cursor-pointer">
                    Date <SortIcon field="createdAt" current={sortBy} order={sortOrder} />
                  </button>
                </th>
                <th className="text-left px-5 py-3">
                  <button onClick={() => handleSort("value")} className="flex items-center gap-1.5 text-xs font-medium text-muted uppercase tracking-wider hover:text-white transition-colors cursor-pointer">
                    Value <SortIcon field="value" current={sortBy} order={sortOrder} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? <TableSkeleton /> : trades.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-16 text-center">
                  <ArrowLeftRight className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-white font-medium mb-1">No trades found</p>
                  <p className="text-sm text-muted">Try adjusting your search or filters</p>
                </td></tr>
              ) : trades.map((trade) => {
                const sConf = STATUS_CONFIG[trade.status] || STATUS_CONFIG.Active;
                const SIcon = sConf.icon;
                return (
                  <tr key={trade.id} onClick={() => setSelectedTradeId(trade.id)}
                    className="border-b border-border/50 last:border-0 hover:bg-surface-hover transition-colors cursor-pointer group">
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-mono text-muted-foreground group-hover:text-white transition-colors">{trade.id}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:bg-amber-500/15 transition-colors">
                          <Building2 className="w-4 h-4 text-amber-400" />
                        </div>
                        <span className="text-sm font-medium text-white truncate max-w-[180px] group-hover:text-primary-light transition-colors">{trade.property}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-white">{trade.buyer}</td>
                    <td className="px-5 py-3.5 text-sm text-muted">{trade.agent}</td>
                    <td className="px-5 py-3.5">
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${sConf.bg} ${sConf.color}`}>
                        <SIcon className="w-3 h-3" /> {trade.status}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-muted">{trade.createdAtFormatted}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-white">{trade.valueFormatted}</td>
                  </tr>
                );
              })}
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
      {selectedTradeId && (
        <TradeDetailModal tradeId={selectedTradeId} onClose={() => setSelectedTradeId(null)} />
      )}
    </div>
  );
}
