import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export const queryKeys = {
  reviews: ['reviews'] as const,
  reviewsWithFilters: (filters: Record<string, any>) => ['reviews', filters] as const,
  properties: ['properties'] as const,
  hostawayReviews: ['hostaway-reviews'] as const,
};
