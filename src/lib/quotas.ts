/**
 * Quota configuration for different user tiers
 */

export interface QuotaConfig {
  publishedJourneys: number;
  maxPhotos: number;
  customMusic: boolean;
  passwordProtection: boolean;
}

export const TIER_QUOTAS: Record<string, QuotaConfig> = {
  free: {
    publishedJourneys: 1,
    maxPhotos: 6,
    customMusic: false,
    passwordProtection: false,
  },
  pro: {
    publishedJourneys: -1, // Unlimited
    maxPhotos: 20,
    customMusic: true,
    passwordProtection: true,
  },
};

/**
 * Returns the quota configuration for a given subscription tier
 */
export function getQuotaForTier(tier: string = 'free'): QuotaConfig {
  return TIER_QUOTAS[tier] || TIER_QUOTAS.free;
}
