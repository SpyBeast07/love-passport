import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";

// Note: This helper is primarily for Next.js environments but provides useful
// server-side utilities that might be adaptable or referencable.
// In a pure Expo environment, some of these might not be directly usable
// without a Next.js backend, but we include it for completeness as per the guide.
export const {
    handler,
    preloadAuthQuery,
    isAuthenticated,
    getToken,
    fetchAuthQuery,
    fetchAuthMutation,
    fetchAuthAction,
} = convexBetterAuthNextJs({
    convexUrl: process.env.EXPO_PUBLIC_CONVEX_URL!,
    convexSiteUrl: process.env.EXPO_PUBLIC_CONVEX_SITE_URL!,
});
