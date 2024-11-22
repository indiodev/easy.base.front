import { QueryClient } from '@tanstack/react-query';

// export const tanstack = new QueryClient({
// 	defaultOptions: {
// 		queries: {
// 			retry: false,
// 			refetchOnWindowFocus: true,

// 			// staleTime: 5000 * 60 // 1 minute
// 		},
// 	},
// });

export const tanstack = new QueryClient();
