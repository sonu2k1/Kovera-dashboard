import { useState, useMemo } from "react";
import {
  Card, CardHeader, CardTitle, CardContent, Badge, Button, Skeleton,
} from "@/components/ui";
import { StatCard } from "@/components/common";
import {
  UserCog, Building2, MapPin, Users, TrendingUp, RefreshCw, Wifi, WifiOff,
  ShieldCheck, Clock, CheckCircle2,
} from "lucide-react";
import {
  useAgentRegistrations,
  useAgentsByBrokerage,
  useClientRatio,
  useLicenseCoverage,
  useClientStatus,
} from "@/services/hooks/useAnalytics";
import {
  AreaChart, Area,
  BarChart, Bar, Cell,
  PieChart, Pie,
  ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

/* ── Demo Fallback ── */
const DEMO_REGISTRATIONS = {
  buckets: [
    { period: "2025-01-01T00:00:00.000Z", count: 8 },
    { period: "2025-02-01T00:00:00.000Z", count: 12 },
    { period: "2025-03-01T00:00:00.000Z", count: 15 },
    { period: "2025-04-01T00:00:00.000Z", count: 19 },
  ],
  total: 54,
};

const DEMO_BROKERAGES = {
  brokerages: [
    { brokerage: "Compass", count: 22 },
    { brokerage: "Keller Williams", count: 18 },
    { brokerage: "Coldwell Banker", count: 14 },
    { brokerage: "RE/MAX", count: 11 },
    { brokerage: "Unknown", count: 9 },
    { brokerage: "eXp Realty", count: 7 },
    { brokerage: "Century 21", count: 6 },
  ],
};

const DEMO_CLIENT_RATIO = { totalAgents: 87, totalClients: 342, avgClientsPerAgent: 3.93 };

const DEMO_LICENSE = {
  states: [
    { state: "MA", count: 34 },
    { state: "NY", count: 21 },
    { state: "CA", count: 18 },
    { state: "FL", count: 15 },
    { state: "TX", count: 12 },
    { state: "CT", count: 8 },
    { state: "NJ", count: 6 },
  ],
};

const DEMO_CLIENT_STATUS = {
  statuses: [
    { status: "active", count: 245 },
    { status: "pending", count: 72 },
    { status: "inactive", count: 25 },
  ],
};

/* ── Helpers ── */
function fmtNum(n) {
  if (n == null) return "—";
  return n.toLocaleString();
}

function monthLabel(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

const BROKERAGE_COLORS = ["#22c55e", "#3b82f6", "#a855f7", "#f59e0b", "#64748b", "#06b6d4", "#ef4444"];
const STATUS_COLORS_MAP = { active: "#22c55e", pending: "#f59e0b", inactive: "#64748b" };
const STATE_COLORS = ["#818cf8", "#60a5fa", "#22d3ee", "#34d399", "#fbbf24", "#f87171", "#a78bfa"];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-navy-900 px-3 py-2 shadow-elevated text-xs">
      <p className="text-white font-medium mb-1">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-muted">{entry.name}:</span>
          <span className="text-white font-medium">{entry.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="flex items-end gap-2 h-[200px] px-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex-1">
          <Skeleton className="w-full rounded-t" style={{ height: `${30 + Math.random() * 60}%` }} />
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   AGENT ANALYTICS PAGE
   ══════════════════════════════════════════════ */
export default function AgentAnalyticsPage() {
  const [dateRange] = useState(() => ({
    from: "2025-01-01T00:00:00Z",
    to: new Date().toISOString(),
  }));

  const regQ = useAgentRegistrations({ ...dateRange, granularity: "month" });
  const brokQ = useAgentsByBrokerage();
  const ratioQ = useClientRatio();
  const licQ = useLicenseCoverage();
  const clientQ = useClientStatus();

  const reg = regQ.data || (regQ.isError ? DEMO_REGISTRATIONS : null);
  const brok = brokQ.data || (brokQ.isError ? DEMO_BROKERAGES : null);
  const ratio = ratioQ.data || (ratioQ.isError ? DEMO_CLIENT_RATIO : null);
  const lic = licQ.data || (licQ.isError ? DEMO_LICENSE : null);
  const clientSt = clientQ.data || (clientQ.isError ? DEMO_CLIENT_STATUS : null);

  const isDemo = !regQ.data && regQ.isError;

  // ── Registrations chart ──
  const regChart = useMemo(() => {
    if (!reg?.buckets) return [];
    return reg.buckets.map((b) => ({
      month: monthLabel(b.period),
      agents: b.count,
    }));
  }, [reg]);

  // ── Brokerage horizontal bar ──
  const brokChart = useMemo(() => {
    if (!brok?.brokerages) return [];
    return brok.brokerages.map((b) => ({
      brokerage: b.brokerage,
      count: b.count,
    }));
  }, [brok]);

  // ── License coverage bar ──
  const licChart = useMemo(() => {
    if (!lic?.states) return [];
    return lic.states.map((s) => ({
      state: s.state,
      agents: s.count,
    }));
  }, [lic]);

  // ── Client status pie ──
  const clientPie = useMemo(() => {
    if (!clientSt?.statuses) return [];
    return clientSt.statuses.map((s) => ({
      name: s.status.charAt(0).toUpperCase() + s.status.slice(1),
      value: s.count,
      color: STATUS_COLORS_MAP[s.status] || "#64748b",
    }));
  }, [clientSt]);

  const refetchAll = () => {
    regQ.refetch(); brokQ.refetch(); ratioQ.refetch(); licQ.refetch(); clientQ.refetch();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Agent Analytics</h1>
          <p className="text-muted mt-1 text-sm">Registrations, brokerages, client ratios & license coverage.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 border border-border text-xs">
            {isDemo ? (
              <><WifiOff className="w-3 h-3 text-amber-400" /><span className="text-amber-400 font-medium">Demo Data</span></>
            ) : (
              <><Wifi className="w-3 h-3 text-primary" /><span className="text-primary font-medium">Live</span></>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={refetchAll}>
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Agents"
          value={fmtNum(ratio?.totalAgents)}
          icon={UserCog}
          accentColor="purple"
        />
        <StatCard
          title="Total Clients"
          value={fmtNum(ratio?.totalClients)}
          icon={Users}
          accentColor="blue"
        />
        <StatCard
          title="Avg Clients/Agent"
          value={ratio ? ratio.avgClientsPerAgent.toFixed(1) : "—"}
          icon={TrendingUp}
          accentColor="green"
        />
        <StatCard
          title="New Agents (period)"
          value={fmtNum(reg?.total)}
          icon={ShieldCheck}
          accentColor="cyan"
        />
      </div>

      {/* ── Row 1: Registrations + Brokerage ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Registrations Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Agent Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {regQ.isLoading ? <ChartSkeleton /> : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={regChart}>
                  <defs>
                    <linearGradient id="gradAgentReg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.3)" />
                  <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="agents" name="Agents" stroke="#a855f7" strokeWidth={2} fill="url(#gradAgentReg)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Agents by Brokerage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" /> Agents by Brokerage
            </CardTitle>
          </CardHeader>
          <CardContent>
            {brokQ.isLoading ? <ChartSkeleton /> : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={brokChart} layout="vertical" barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.3)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="brokerage" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="count" name="Agents">
                    {brokChart.map((_, i) => (
                      <Cell key={i} fill={BROKERAGE_COLORS[i % BROKERAGE_COLORS.length]} radius={[0, 6, 6, 0]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 2: License Coverage + Client Status ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* License Coverage by State */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> License Coverage by State
            </CardTitle>
          </CardHeader>
          <CardContent>
            {licQ.isLoading ? <ChartSkeleton /> : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={licChart} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.3)" vertical={false} />
                  <XAxis dataKey="state" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="agents" name="Agents">
                    {licChart.map((_, i) => (
                      <Cell key={i} fill={STATE_COLORS[i % STATE_COLORS.length]} radius={[6, 6, 0, 0]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Client Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> Client Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {clientQ.isLoading ? <ChartSkeleton /> : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={clientPie} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                      {clientPie.map((entry, i) => (
                        <Cell key={i} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-3">
                  {clientPie.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 p-2 rounded-lg bg-navy-950 border border-border">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                      <span className="text-xs text-muted">{item.name}</span>
                      <span className="text-xs font-semibold text-white ml-auto">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
