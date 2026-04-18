import { api } from "./index";

/**
 * Kovera Analytics API
 * Base path: /api/analytics
 *
 * Time-series endpoints accept optional query params:
 *   - from  (ISO 8601) — defaults to 30 days ago
 *   - to    (ISO 8601) — defaults to now
 *   - granularity — "day" | "week" | "month" (default: "day")
 */

// ===== Dashboard =====
export const analyticsAPI = {
  /** Top-level KPIs with period-over-period comparison */
  getDashboard: (params) =>
    api.get("/api/analytics/dashboard", { params }),

  // ── Users ──
  /** User signups over time */
  getUserSignups: (params) =>
    api.get("/api/analytics/users/signups", { params }),

  /** Onboarding funnel snapshot */
  getOnboardingFunnel: () =>
    api.get("/api/analytics/users/onboarding-funnel"),

  /** User roles distribution */
  getRolesDistribution: () =>
    api.get("/api/analytics/users/roles"),

  /** Active / inactive user counts */
  getUserActivity: (params) =>
    api.get("/api/analytics/users/activity", { params }),

  // ── Engagement ──
  /** Impression volumes over time */
  getImpressions: (params) =>
    api.get("/api/analytics/engagement/impressions", { params }),

  /** Swipe / like / dismiss rates */
  getSwipeRates: (params) =>
    api.get("/api/analytics/engagement/swipe-rates", { params }),

  /** Feed scroll-depth distribution */
  getFeedDepth: () =>
    api.get("/api/analytics/engagement/feed-depth"),

  /** Dream board usage stats */
  getDreamBoard: () =>
    api.get("/api/analytics/engagement/dream-board"),

  /** Preview-to-signup conversion */
  getPreviewConversion: (params) =>
    api.get("/api/analytics/engagement/preview-conversion", { params }),

  // ── Agents ──
  /** Agent registrations over time */
  getAgentRegistrations: (params) =>
    api.get("/api/analytics/agents/registrations", { params }),

  /** Agents grouped by brokerage */
  getAgentsByBrokerage: () =>
    api.get("/api/analytics/agents/brokerages"),

  /** Client-to-agent ratio */
  getClientRatio: () =>
    api.get("/api/analytics/agents/client-ratio"),

  /** License coverage by US state */
  getLicenseCoverage: () =>
    api.get("/api/analytics/agents/license-coverage"),

  /** Agent-client link status breakdown */
  getClientStatus: () =>
    api.get("/api/analytics/agents/client-status"),

  // ── Chains ──
  /** Chain status breakdown */
  getChainStatus: (params) =>
    api.get("/api/analytics/chains/status", { params }),

  /** Chain types distribution */
  getChainTypes: () =>
    api.get("/api/analytics/chains/types"),

  /** Chain size distribution */
  getChainSize: () =>
    api.get("/api/analytics/chains/size"),

  // ── Referrals ──
  /** Referral volume over time */
  getReferralVolume: (params) =>
    api.get("/api/analytics/referrals/volume", { params }),

  /** Referral conversion rate */
  getReferralConversion: () =>
    api.get("/api/analytics/referrals/conversion"),

  /** Top referrers leaderboard */
  getReferralLeaderboard: (params) =>
    api.get("/api/analytics/referrals/leaderboard", { params }),

  // ── Listings ──
  /** Combined listing stats */
  getListingsOverview: () =>
    api.get("/api/analytics/listings/overview"),
};
