import { StatCard } from "@/components/common";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  Skeleton,
} from "@/components/ui";
import {
  Users,
  UserCog,
  Building2,
  ArrowLeftRight,
  Heart,
  UserCheck,
  Clock,
  ArrowUpRight,
  TrendingUp,
  BarChart3,
  CalendarDays,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useDashboardKPI } from "@/services/hooks/useDashboardKPI";
import {
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

/* ── Chart Data (demo) ── */
const monthlyData = [
  { month: "Jan", users: 820, agents: 45, properties: 320, trades: 120 },
  { month: "Feb", users: 1050, agents: 52, properties: 380, trades: 145 },
  { month: "Mar", users: 1340, agents: 61, properties: 450, trades: 178 },
  { month: "Apr", users: 1580, agents: 68, properties: 510, trades: 210 },
  { month: "May", users: 1920, agents: 78, properties: 590, trades: 248 },
  { month: "Jun", users: 2380, agents: 85, properties: 680, trades: 295 },
  { month: "Jul", users: 2810, agents: 95, properties: 760, trades: 340 },
  { month: "Aug", users: 3200, agents: 108, properties: 850, trades: 380 },
  { month: "Sep", users: 3680, agents: 120, properties: 940, trades: 420 },
  { month: "Oct", users: 4100, agents: 135, properties: 1020, trades: 470 },
  { month: "Nov", users: 4560, agents: 148, properties: 1100, trades: 510 },
  { month: "Dec", users: 5200, agents: 162, properties: 1200, trades: 560 },
];

const tradeStatusData = [
  { name: "Completed", value: 560, color: "#22c55e" },
  { name: "Active", value: 180, color: "#3b82f6" },
  { name: "Pending", value: 95, color: "#f59e0b" },
  { name: "Cancelled", value: 42, color: "#ef4444" },
];

const weeklyTradesData = [
  { day: "Mon", value: 42 },
  { day: "Tue", value: 58 },
  { day: "Wed", value: 35 },
  { day: "Thu", value: 72 },
  { day: "Fri", value: 65 },
  { day: "Sat", value: 28 },
  { day: "Sun", value: 18 },
];

const propertyTypeData = [
  { type: "Apartment", count: 380 },
  { type: "Villa", count: 140 },
  { type: "House", count: 220 },
  { type: "Condo", count: 180 },
  { type: "Loft", count: 90 },
  { type: "Penthouse", count: 45 },
];

/* ── Custom Tooltip ── */
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

/* ── Recent Activity (static — hook-ready) ── */
const recentActivity = [
  { id: 1, action: "New property listed in Manhattan", user: "Sarah Chen", time: "2 min ago", type: "success" },
  { id: 2, action: "Agent onboarding completed", user: "Agent-Alpha-7", time: "15 min ago", type: "info" },
  { id: 3, action: "Trade offer submitted", user: "James Wright", time: "32 min ago", type: "warning" },
  { id: 4, action: "Property sold — 245 Park Ave", user: "Michael Ross", time: "1 hour ago", type: "success" },
  { id: 5, action: "New user registration", user: "emily@realestate.com", time: "2 hours ago", type: "default" },
];

/* ── Performance Metrics ── */
const performanceMetrics = [
  { label: "Listing Conversion", value: "78.4%", pct: 78 },
  { label: "Agent Response Time", value: "1.2h", pct: 88 },
  { label: "User Retention", value: "92.1%", pct: 92 },
  { label: "Revenue Growth", value: "24.6%", pct: 65 },
];

/* ── Skeleton Card ── */
function KPISkeleton() {
  return (
    <div className="rounded-2xl bg-surface border border-border p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl skeleton" />
        <div className="w-16 h-5 rounded-full skeleton" />
      </div>
      <div className="w-24 h-8 rounded-lg skeleton" />
      <div className="w-32 h-4 rounded skeleton" />
    </div>
  );
}

/* ── Chart Skeleton ── */
function ChartSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2 h-[200px] px-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex-1">
            <Skeleton className="w-full rounded-t" style={{ height: `${30 + Math.random() * 60}%` }} />
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4">
        <Skeleton className="h-3 w-16 rounded" />
        <Skeleton className="h-3 w-16 rounded" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { kpiCards, isLoading, isDemo, refetch, lastUpdated } = useDashboardKPI();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-muted mt-1 text-sm">
            Welcome back! Here's your real estate portfolio overview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 border border-border text-xs">
            {isDemo ? (
              <><WifiOff className="w-3 h-3 text-amber-400" /><span className="text-amber-400 font-medium">Demo Data</span></>
            ) : (
              <><Wifi className="w-3 h-3 text-primary" /><span className="text-primary font-medium">Live</span></>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} title="Refresh KPI data">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
          <Button variant="outline" size="sm">
            <CalendarDays className="w-4 h-4" /> Last 30 days
          </Button>
          <Button size="sm">
            <BarChart3 className="w-4 h-4" /> Generate Report
          </Button>
        </div>
      </div>

      {lastUpdated && (
        <p className="text-xs text-muted-foreground">
          Auto-refreshes every 60s · Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <KPISkeleton key={i} />)
          : kpiCards?.map((kpi) => <StatCard key={kpi.key} {...kpi} />)}
      </div>

      {/* ══════════════════════════════════════════
          CHARTS SECTION
          ══════════════════════════════════════════ */}

      {/* Row 1: User Growth Area Chart + Trade Status Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User & Agent Growth — Area Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Platform Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradProperties" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.3)" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                <Area type="monotone" dataKey="users" name="Users" stroke="#22c55e" strokeWidth={2} fill="url(#gradUsers)" />
                <Area type="monotone" dataKey="properties" name="Properties" stroke="#3b82f6" strokeWidth={2} fill="url(#gradProperties)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Trade Status — Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-primary" /> Trade Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={tradeStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {tradeStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {tradeStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                  <span className="text-xs text-muted truncate">{item.name}</span>
                  <span className="text-xs font-medium text-white ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Weekly Trades Bar + Property Types Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trades — Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" /> Weekly Trades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyTradesData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.3)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="value" name="Trades" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Property Types — Horizontal Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" /> Property Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={propertyTypeData} layout="vertical" barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.3)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="type" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="Listings" fill="#3b82f6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Activity + Performance Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Recent Activity
              </CardTitle>
              <button className="text-sm text-primary hover:text-primary-light flex items-center gap-1 transition-colors cursor-pointer">
                View all <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-navy-800/50 transition-all duration-200 group">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    {item.id === 1 && <div className="absolute inset-0 w-2 h-2 rounded-full bg-primary animate-ping" />}
                  </div>
                  <div>
                    <p className="text-sm text-white group-hover:text-primary-light transition-colors">{item.action}</p>
                    <p className="text-xs text-muted">{item.user}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant={item.type}>{item.type}</Badge>
                  <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline">{item.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {performanceMetrics.map((metric) => (
              <div key={metric.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">{metric.label}</span>
                  <span className="text-white font-semibold">{metric.value}</span>
                </div>
                <div className="w-full h-1.5 bg-navy-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${metric.pct}%`,
                      background: metric.pct >= 80 ? "linear-gradient(90deg, #22c55e, #4ade80)"
                        : metric.pct >= 60 ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                        : "linear-gradient(90deg, #ef4444, #fca5a5)",
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
