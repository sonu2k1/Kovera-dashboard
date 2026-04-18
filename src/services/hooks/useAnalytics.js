import { useQuery } from "@tanstack/react-query";
import { analyticsAPI } from "@/services/api/analytics";

/**
 * Default date range: 30 days ago → now
 */
function defaultDateRange() {
  const to = new Date().toISOString();
  const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  return { from, to };
}

// ═══════════════════════════════════════════════
//  Dashboard
// ═══════════════════════════════════════════════

export function useDashboardSummary(params) {
  return useQuery({
    queryKey: ["analytics", "dashboard", params],
    queryFn: () => analyticsAPI.getDashboard(params).then((r) => r.data),
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}

// ═══════════════════════════════════════════════
//  Users
// ═══════════════════════════════════════════════

export function useUserSignups(params) {
  return useQuery({
    queryKey: ["analytics", "user-signups", params],
    queryFn: () => analyticsAPI.getUserSignups(params).then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useOnboardingFunnel() {
  return useQuery({
    queryKey: ["analytics", "onboarding-funnel"],
    queryFn: () => analyticsAPI.getOnboardingFunnel().then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useRolesDistribution() {
  return useQuery({
    queryKey: ["analytics", "roles-distribution"],
    queryFn: () => analyticsAPI.getRolesDistribution().then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useUserActivity(params) {
  return useQuery({
    queryKey: ["analytics", "user-activity", params],
    queryFn: () => analyticsAPI.getUserActivity(params).then((r) => r.data),
    staleTime: 60_000,
  });
}

// ═══════════════════════════════════════════════
//  Engagement
// ═══════════════════════════════════════════════

export function useImpressions(params) {
  return useQuery({
    queryKey: ["analytics", "impressions", params],
    queryFn: () => analyticsAPI.getImpressions(params).then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useSwipeRates(params) {
  return useQuery({
    queryKey: ["analytics", "swipe-rates", params],
    queryFn: () => analyticsAPI.getSwipeRates(params).then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useFeedDepth() {
  return useQuery({
    queryKey: ["analytics", "feed-depth"],
    queryFn: () => analyticsAPI.getFeedDepth().then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useDreamBoard() {
  return useQuery({
    queryKey: ["analytics", "dream-board"],
    queryFn: () => analyticsAPI.getDreamBoard().then((r) => r.data),
    staleTime: 60_000,
  });
}

export function usePreviewConversion(params) {
  return useQuery({
    queryKey: ["analytics", "preview-conversion", params],
    queryFn: () => analyticsAPI.getPreviewConversion(params).then((r) => r.data),
    staleTime: 60_000,
  });
}

// ═══════════════════════════════════════════════
//  Agents
// ═══════════════════════════════════════════════

export function useAgentRegistrations(params) {
  return useQuery({
    queryKey: ["analytics", "agent-registrations", params],
    queryFn: () => analyticsAPI.getAgentRegistrations(params).then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useAgentsByBrokerage() {
  return useQuery({
    queryKey: ["analytics", "agents-brokerage"],
    queryFn: () => analyticsAPI.getAgentsByBrokerage().then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useClientRatio() {
  return useQuery({
    queryKey: ["analytics", "client-ratio"],
    queryFn: () => analyticsAPI.getClientRatio().then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useLicenseCoverage() {
  return useQuery({
    queryKey: ["analytics", "license-coverage"],
    queryFn: () => analyticsAPI.getLicenseCoverage().then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useClientStatus() {
  return useQuery({
    queryKey: ["analytics", "client-status"],
    queryFn: () => analyticsAPI.getClientStatus().then((r) => r.data),
    staleTime: 60_000,
  });
}

// ═══════════════════════════════════════════════
//  Chains
// ═══════════════════════════════════════════════

export function useChainStatus(params) {
  return useQuery({
    queryKey: ["analytics", "chain-status", params],
    queryFn: () => analyticsAPI.getChainStatus(params).then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useChainTypes() {
  return useQuery({
    queryKey: ["analytics", "chain-types"],
    queryFn: () => analyticsAPI.getChainTypes().then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useChainSize() {
  return useQuery({
    queryKey: ["analytics", "chain-size"],
    queryFn: () => analyticsAPI.getChainSize().then((r) => r.data),
    staleTime: 60_000,
  });
}

// ═══════════════════════════════════════════════
//  Referrals
// ═══════════════════════════════════════════════

export function useReferralVolume(params) {
  return useQuery({
    queryKey: ["analytics", "referral-volume", params],
    queryFn: () => analyticsAPI.getReferralVolume(params).then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useReferralConversion() {
  return useQuery({
    queryKey: ["analytics", "referral-conversion"],
    queryFn: () => analyticsAPI.getReferralConversion().then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useReferralLeaderboard(params) {
  return useQuery({
    queryKey: ["analytics", "referral-leaderboard", params],
    queryFn: () => analyticsAPI.getReferralLeaderboard(params).then((r) => r.data),
    staleTime: 60_000,
  });
}

// ═══════════════════════════════════════════════
//  Listings
// ═══════════════════════════════════════════════

export function useListingsOverview() {
  return useQuery({
    queryKey: ["analytics", "listings-overview"],
    queryFn: () => analyticsAPI.getListingsOverview().then((r) => r.data),
    staleTime: 60_000,
  });
}
