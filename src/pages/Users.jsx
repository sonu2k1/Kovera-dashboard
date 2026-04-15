import { useState, useCallback } from "react";
import {
  Button,
  Badge,
  Card,
  CardContent,
  Toggle,
  Select,
} from "@/components/ui";
import {
  UserPlus,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Activity,
  Eye,
  MousePointerClick,
  LogIn,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { useUsers, useUser, useToggleUserStatus } from "@/services/hooks/useUsers";

/* ── Status badge variant map ── */
const STATUS_VARIANT = {
  Active: "success",
  Blocked: "danger",
  Inactive: "warning",
};

/* ── Format date ── */
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ── Sort icon ── */
function SortIcon({ field, current, order }) {
  if (current !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />;
  return order === "asc" ? (
    <ArrowUp className="w-3.5 h-3.5 text-primary" />
  ) : (
    <ArrowDown className="w-3.5 h-3.5 text-primary" />
  );
}

/* ── Table skeleton ── */
function TableSkeleton({ rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-border/50">
          <td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl skeleton" /><div className="space-y-1.5"><div className="h-4 w-28 skeleton rounded" /><div className="h-3 w-36 skeleton rounded" /></div></div></td>
          <td className="px-5 py-3.5"><div className="h-4 w-20 skeleton rounded" /></td>
          <td className="px-5 py-3.5"><div className="h-4 w-24 skeleton rounded" /></td>
          <td className="px-5 py-3.5"><div className="h-5 w-14 skeleton rounded-full" /></td>
          <td className="px-5 py-3.5"><div className="h-4 w-8 skeleton rounded" /></td>
        </tr>
      ))}
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   CONFIRMATION DIALOG
   ══════════════════════════════════════════════════════════ */
function ConfirmDialog({ open, title, message, variant = "danger", onConfirm, onCancel, loading }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl bg-navy-900 border border-border shadow-elevated animate-scale-in p-6 text-center">
        <div className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${variant === "danger" ? "bg-danger/10" : "bg-primary/10"}`}>
          {variant === "danger" ? (
            <ShieldAlert className="w-7 h-7 text-danger" />
          ) : (
            <CheckCircle2 className="w-7 h-7 text-primary" />
          )}
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-muted mb-6">{message}</p>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "default"}
            className="flex-1"
            onClick={onConfirm}
            loading={loading}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   USER DETAIL MODAL
   ══════════════════════════════════════════════════════════ */
function UserDetailModal({ userId, onClose }) {
  const { data: user, isLoading } = useUser(userId);
  const toggleStatus = useToggleUserStatus();
  const [confirmAction, setConfirmAction] = useState(null);

  if (!userId) return null;

  const handleToggleStatus = () => {
    const newStatus = user.status === "Active" ? "Blocked" : "Active";
    setConfirmAction({
      title: newStatus === "Blocked" ? "Block User" : "Activate User",
      message: `Are you sure you want to ${newStatus === "Blocked" ? "block" : "activate"} ${user.name}? ${newStatus === "Blocked" ? "They will lose access to the platform." : "They will regain access to the platform."}`,
      variant: newStatus === "Blocked" ? "danger" : "success",
      newStatus,
    });
  };

  const handleConfirm = async () => {
    await toggleStatus.mutateAsync({ id: userId, newStatus: confirmAction.newStatus });
    setConfirmAction(null);
    // Update local user object for immediate UI feedback
    if (user) user.status = confirmAction.newStatus;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-navy-900 border border-border shadow-elevated animate-scale-in">
        {isLoading ? (
          <div className="p-10 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : user ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-primary/20">
                  {user.name?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">{user.name}</h2>
                  <p className="text-sm text-muted">{user.email}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl text-muted hover:text-white hover:bg-surface-hover transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info Grid */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-navy-950 border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-xs text-muted">Email</p>
                  </div>
                  <p className="text-sm font-medium text-white truncate">{user.email}</p>
                </div>
                <div className="p-3 rounded-xl bg-navy-950 border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-xs text-muted">Phone</p>
                  </div>
                  <p className="text-sm font-medium text-white">{user.phone}</p>
                </div>
                <div className="p-3 rounded-xl bg-navy-950 border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-xs text-muted">Join Date</p>
                  </div>
                  <p className="text-sm font-medium text-white">{formatDate(user.joinDate)}</p>
                </div>
                <div className="p-3 rounded-xl bg-navy-950 border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-xs text-muted">Last Active</p>
                  </div>
                  <p className="text-sm font-medium text-white">{user.activity?.lastActive || "—"}</p>
                </div>
              </div>

              {/* Activity Summary */}
              {user.activity && (
                <div>
                  <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Activity Summary</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-navy-950 border border-border text-center">
                      <LogIn className="w-4 h-4 text-primary mx-auto mb-1" />
                      <p className="text-lg font-bold text-white">{user.activity.logins}</p>
                      <p className="text-[11px] text-muted">Logins</p>
                    </div>
                    <div className="p-3 rounded-xl bg-navy-950 border border-border text-center">
                      <MousePointerClick className="w-4 h-4 text-info mx-auto mb-1" />
                      <p className="text-lg font-bold text-white">{user.activity.searches}</p>
                      <p className="text-[11px] text-muted">Searches</p>
                    </div>
                    <div className="p-3 rounded-xl bg-navy-950 border border-border text-center">
                      <Eye className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                      <p className="text-lg font-bold text-white">{user.activity.propertiesViewed}</p>
                      <p className="text-[11px] text-muted">Properties</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-navy-950 border border-border">
                <div>
                  <p className="text-sm font-medium text-white">Account Status</p>
                  <p className="text-xs text-muted mt-0.5">
                    {user.status === "Active" ? "User can access the platform" : "User is blocked from the platform"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={STATUS_VARIANT[user.status]}>{user.status}</Badge>
                  <Toggle
                    checked={user.status === "Active"}
                    onCheckedChange={handleToggleStatus}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 p-5 border-t border-border">
              <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
            </div>
          </>
        ) : (
          <div className="p-10 text-center text-muted">User not found</div>
        )}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={!!confirmAction}
        title={confirmAction?.title}
        message={confirmAction?.message}
        variant={confirmAction?.variant}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
        loading={toggleStatus.isPending}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   USERS PAGE (Main)
   ══════════════════════════════════════════════════════════ */
export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("joinDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const limit = 20;

  const { data, isLoading } = useUsers({
    page,
    limit,
    status: statusFilter,
    search,
    sortBy,
    sortOrder,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  const users = data?.users || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const handleSort = useCallback((field) => {
    setSortBy((prev) => {
      if (prev === field) {
        setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
        return field;
      }
      setSortOrder("asc");
      return field;
    });
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
    setSearch("");
    setPage(1);
  }, []);

  const hasActiveFilters = statusFilter !== "all" || dateFrom || dateTo;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Users</h1>
          <p className="text-muted mt-1 text-sm">
            Manage user accounts and permissions ·{" "}
            <span className="text-white font-medium">{total}</span> total
          </p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4" /> Add User
        </Button>
      </div>

      {/* ── Search + Filter Bar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-navy-900 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:input-ring hover:border-border-light transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status filter */}
        <div className="relative">
          <Select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            options={[
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "blocked", label: "Blocked" },
            ]}
            size="sm"
          />
        </div>

        {/* Toggle advanced filters */}
        <Button
          variant={showFilters ? "secondary" : "outline"}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-primary" />
          )}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-3.5 h-3.5" /> Clear
          </Button>
        )}
      </div>

      {/* ── Advanced Filters ── */}
      {showFilters && (
        <Card className="p-4 animate-slide-down">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                className="h-9 px-3 rounded-lg border border-border bg-navy-900 text-sm text-white focus:outline-none focus:input-ring transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                className="h-9 px-3 rounded-lg border border-border bg-navy-900 text-sm text-white focus:outline-none focus:input-ring transition-all"
              />
            </div>
          </div>
        </Card>
      )}

      {/* ── Table ── */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3">
                  <button onClick={() => handleSort("name")} className="flex items-center gap-1.5 text-xs font-medium text-muted uppercase tracking-wider hover:text-white transition-colors cursor-pointer">
                    User <SortIcon field="name" current={sortBy} order={sortOrder} />
                  </button>
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                  Phone
                </th>
                <th className="text-left px-5 py-3">
                  <button onClick={() => handleSort("joinDate")} className="flex items-center gap-1.5 text-xs font-medium text-muted uppercase tracking-wider hover:text-white transition-colors cursor-pointer">
                    Join Date <SortIcon field="joinDate" current={sortBy} order={sortOrder} />
                  </button>
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider w-16">
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableSkeleton rows={8} />
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <User className="w-10 h-10 text-muted-foreground mb-3" />
                      <p className="text-white font-medium mb-1">No users found</p>
                      <p className="text-sm text-muted">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className="border-b border-border/50 last:border-0 hover:bg-surface-hover transition-colors cursor-pointer group"
                  >
                    {/* User (name + email) */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold shrink-0 group-hover:bg-primary/15 transition-colors">
                          {user.name?.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white group-hover:text-primary-light transition-colors truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    {/* Phone */}
                    <td className="px-5 py-3.5 text-sm text-muted">{user.phone}</td>
                    {/* Join Date */}
                    <td className="px-5 py-3.5 text-sm text-muted">{formatDate(user.joinDate)}</td>
                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <Badge variant={STATUS_VARIANT[user.status] || "outline"}>{user.status}</Badge>
                    </td>
                    {/* View */}
                    <td className="px-5 py-3.5">
                      <button className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-surface transition-colors cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
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
              <Button variant="ghost" size="icon-sm" disabled={page <= 1} onClick={() => setPage(1)}>
                <ChevronsLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "secondary" : "ghost"}
                    size="icon-sm"
                    onClick={() => setPage(pageNum)}
                    className={page === pageNum ? "border border-primary/30 text-primary" : ""}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              <Button variant="ghost" size="icon-sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" disabled={page >= totalPages} onClick={() => setPage(totalPages)}>
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* ── Detail Modal ── */}
      {selectedUserId && (
        <UserDetailModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
}
