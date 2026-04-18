import axios from "axios";

/**
 * Kovera Analytics API
 * Base path: /api/analytics
 *
 * Uses a dedicated axios instance WITHOUT auth interceptors
 * so the real Kovera API doesn't reject requests with 401.
 *
 * Time-series endpoints accept optional query params:
 *   - from  (ISO 8601) — defaults to 30 days ago
 *   - to    (ISO 8601) — defaults to now
 *   - granularity — "day" | "week" | "month" (default: "day")
 */

const analyticsClient = axios.create({
  baseURL: "",
  headers: { "Content-Type": "application/json" },
});

// ===== Dashboard =====
export const analyticsAPI = {
  /** Top-level KPIs with period-over-period comparison */
  getDashboard: (params) =>
    analyticsClient.get("/api/analytics/dashboard", { params }),

  // ── Users ──
  /** User signups over time */
  getUserSignups: (params) =>
    analyticsClient.get("/api/analytics/users/signups", { params }),

  /** Onboarding funnel snapshot */
  getOnboardingFunnel: () =>
    analyticsClient.get("/api/analytics/users/onboarding-funnel"),

  /** User roles distribution */
  getRolesDistribution: () =>
    analyticsClient.get("/api/analytics/users/roles"),

  /** Active / inactive user counts */
  getUserActivity: (params) =>
    analyticsClient.get("/api/analytics/users/activity", { params }),

  // ── Engagement ──
  /** Impression volumes over time */
  getImpressions: (params) =>
    analyticsClient.get("/api/analytics/engagement/impressions", { params }),

  /** Swipe / like / dismiss rates */
  getSwipeRates: (params) =>
    analyticsClient.get("/api/analytics/engagement/swipe-rates", { params }),

  /** Feed scroll-depth distribution */
  getFeedDepth: () =>
    analyticsClient.get("/api/analytics/engagement/feed-depth"),

  /** Dream board usage stats */
  getDreamBoard: () =>
    analyticsClient.get("/api/analytics/engagement/dream-board"),

  /** Preview-to-signup conversion */
  getPreviewConversion: (params) =>
    analyticsClient.get("/api/analytics/engagement/preview-conversion", { params }),

  // ── Agents ──
  /** Agent registrations over time */
  getAgentRegistrations: (params) =>
    analyticsClient.get("/api/analytics/agents/registrations", { params }),

  /** Agents grouped by brokerage */
  getAgentsByBrokerage: () =>
    analyticsClient.get("/api/analytics/agents/brokerages"),

  /** Client-to-agent ratio */
  getClientRatio: () =>
    analyticsClient.get("/api/analytics/agents/client-ratio"),

  /** License coverage by US state */
  getLicenseCoverage: () =>
    analyticsClient.get("/api/analytics/agents/license-coverage"),

  /** Agent-client link status breakdown */
  getClientStatus: () =>
    analyticsClient.get("/api/analytics/agents/client-status"),

  // ── Chains ──
  /** Chain status breakdown */
  getChainStatus: (params) =>
    analyticsClient.get("/api/analytics/chains/status", { params }),

  /** Chain types distribution */
  getChainTypes: () =>
    analyticsClient.get("/api/analytics/chains/types"),

  /** Chain size distribution */
  getChainSize: () =>
    analyticsClient.get("/api/analytics/chains/size"),

  // ── Referrals ──
  /** Referral volume over time */
  getReferralVolume: (params) =>
    analyticsClient.get("/api/analytics/referrals/volume", { params }),

  /** Referral conversion rate */
  getReferralConversion: () =>
    analyticsClient.get("/api/analytics/referrals/conversion"),

  /** Top referrers leaderboard */
  getReferralLeaderboard: (params) =>
    analyticsClient.get("/api/analytics/referrals/leaderboard", { params }),

  // ── Listings ──
  /** Combined listing stats */
  getListingsOverview: () =>
    analyticsClient.get("/api/analytics/listings/overview"),
};
