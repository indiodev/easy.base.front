/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useSearchParams } from 'react-router-dom';
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

// eslint-disable-next-line react-refresh/only-export-components
export function useQueryStore() {
	const store = QueryStore();
	const location = useLocation();
	const [search, setSearch] = useSearchParams(
		new URLSearchParams(location.search),
	);
	function merge(query?: Record<string, any>): void {
		const mergedQuery = { ...Object.fromEntries(search), ...query };
		store.merge(mergedQuery);
		setSearch(new URLSearchParams(mergedQuery));
	}

	return { query: store.query, merge };
}
