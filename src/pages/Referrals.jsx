import { useState, useMemo } from "react";
import {
  Card, CardHeader, CardTitle, CardContent, Badge, Button, Skeleton,
} from "@/components/ui";
import { StatCard } from "@/components/common";
import {
  Share2, TrendingUp, Clock, Trophy, CheckCircle2, RefreshCw, Wifi, WifiOff,
  Mail, User,
} from "lucide-react";
import {
  useReferralVolume,
  useReferralConversion,
  useReferralLeaderboard,
} from "@/services/hooks/useAnalytics";
import {
  AreaChart, Area,
  ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

/* ── Demo Fallback ── */
const DEMO_VOLUME = {
  buckets: [
    { period: "2025-01-01T00:00:00.000Z", count: 18 },
    { period: "2025-02-01T00:00:00.000Z", count: 24 },
    { period: "2025-03-01T00:00:00.000Z", count: 31 },
    { period: "2025-04-01T00:00:00.000Z", count: 38 },
  ],
  total: 111,
};

const DEMO_CONVERSION = {
  totalPending: 62, totalAccepted: 136, conversionRate: 68.69, avgDaysToConvert: 3.45,
};

const DEMO_LEADERBOARD = {
  leaders: [
    { userId: "auth0|abc123", name: "Sarah Johnson", email: "sarah@example.com", count: 14 },
    { userId: "auth0|def456", name: "Mike Chen", email: "mike@example.com", count: 11 },
    { userId: "auth0|ghi789", name: "Emily Davis", email: "emily@example.com", count: 9 },
    { userId: "auth0|jkl012", name: "James Wilson", email: "james@example.com", count: 7 },
    { userId: "auth0|mno345", name: "Anna Park", email: "anna@example.com", count: 6 },
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
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex-1">
          <Skeleton className="w-full rounded-t" style={{ height: `${30 + Math.random() * 60}%` }} />
        </div>
      ))}
    </div>
  );
}

/* ── Rank medal colors ── */
const MEDAL_COLORS = ["from-yellow-400 to-amber-500", "from-gray-300 to-slate-400", "from-amber-600 to-orange-700"];

/* ══════════════════════════════════════════════
   REFERRALS PAGE
   ══════════════════════════════════════════════ */
export default function ReferralsPage() {
  const [dateRange] = useState(() => ({
    from: "2025-01-01T00:00:00Z",
    to: new Date().toISOString(),
  }));

  const volQ = useReferralVolume({ ...dateRange, granularity: "month" });
  const convQ = useReferralConversion();
  const leaderQ = useReferralLeaderboard({ limit: 10 });

  const vol = volQ.data || (volQ.isError ? DEMO_VOLUME : null);
  const conv = convQ.data || (convQ.isError ? DEMO_CONVERSION : null);
  const leader = leaderQ.data || (leaderQ.isError ? DEMO_LEADERBOARD : null);

  const isDemo = !volQ.data && volQ.isError;

  // ── Volume chart ──
  const volChart = useMemo(() => {
    if (!vol?.buckets) return [];
    return vol.buckets.map((b) => ({
      month: monthLabel(b.period),
      referrals: b.count,
    }));
  }, [vol]);

  const refetchAll = () => {
    volQ.refetch(); convQ.refetch(); leaderQ.refetch();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Referrals</h1>
          <p className="text-muted mt-1 text-sm">Referral volume, conversion metrics & top referrers.</p>
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
          title="Total Referrals"
          value={fmtNum(vol?.total)}
          icon={Share2}
          accentColor="blue"
        />
        <StatCard
          title="Accepted"
          value={fmtNum(conv?.totalAccepted)}
          icon={CheckCircle2}
          accentColor="green"
        />
        <StatCard
          title="Conversion Rate"
          value={conv ? `${conv.conversionRate}%` : "—"}
          icon={TrendingUp}
          accentColor="purple"
        />
        <StatCard
          title="Avg Days to Convert"
          value={conv ? `${conv.avgDaysToConvert} days` : "—"}
          icon={Clock}
          accentColor="amber"
        />
      </div>

      {/* ── Volume Chart + Conversion Panel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Volume Time Series */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Referral Volume (Monthly)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {volQ.isLoading ? <ChartSkeleton /> : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={volChart}>
                  <defs>
                    <linearGradient id="gradReferrals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.3)" />
                  <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="referrals" name="Referrals" stroke="#a855f7" strokeWidth={2} fill="url(#gradReferrals)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" /> Conversion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {convQ.isLoading ? <ChartSkeleton /> : conv && (
              <>
                <div className="text-center p-5 rounded-2xl bg-primary/10 border border-primary/20">
                  <p className="text-4xl font-bold text-primary">{conv.conversionRate}%</p>
                  <p className="text-sm text-muted mt-1">All-time Conversion</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 rounded-xl bg-navy-950 border border-border">
                    <p className="text-xl font-bold text-white">{conv.totalPending}</p>
                    <p className="text-[11px] text-muted">Pending</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-navy-950 border border-border">
                    <p className="text-xl font-bold text-white">{conv.totalAccepted}</p>
                    <p className="text-[11px] text-muted">Accepted</p>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-navy-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000"
                    style={{ width: `${conv.conversionRate}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-navy-950 border border-border">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-muted">Avg to convert:</span>
                  <span className="text-sm font-semibold text-white ml-auto">{conv.avgDaysToConvert} days</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Leaderboard ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" /> Top Referrers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {leaderQ.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="h-3 w-40 rounded" />
                  </div>
                  <Skeleton className="h-6 w-10 rounded-full" />
                </div>
              ))}
            </div>
          ) : leader?.leaders && (
            <div className="space-y-1">
              {leader.leaders.map((person, idx) => (
                <div
                  key={person.userId}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-hover transition-all duration-200 group"
                >
                  {/* Rank */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                    idx < 3
                      ? `bg-gradient-to-br ${MEDAL_COLORS[idx]} text-navy-900 shadow-lg`
                      : "bg-navy-800 text-muted-foreground border border-border"
                  }`}>
                    {idx + 1}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold shrink-0">
                    {person.name?.charAt(0)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white group-hover:text-primary-light transition-colors truncate">
                      {person.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted truncate">
                      <Mail className="w-3 h-3 shrink-0" />{person.email}
                    </div>
                  </div>

                  {/* Count */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
                    <Share2 className="w-3.5 h-3.5" />
                    {person.count}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
