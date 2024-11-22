/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';

type QueryStoreProps = {
	query: Record<string, any>;
	merge(query?: Record<string, any>): void;
};

export const QueryStore = create<QueryStoreProps>((set) => ({
	query: {
		page: 1,
		per_page: 1,
		filter: 'inactive',
	},
	merge(query) {
		set((state) => ({ ...state, query: { ...state.query, ...query } }));
	},
}));

// export function useQueryStore() {
// 	const store = QueryStore();
// 	const location = useLocation();
// 	const [search, setSearch] = useSearchParams(
// 		new URLSearchParams(location.search),
// 	);
// 	function merge(query?: Record<string, any>): void {
// 		store.merge({ ...Object.fromEntries(search), ...query });

// 		setSearch(store.query);
// 	}

// 	return { query: store.query, merge };
// }
