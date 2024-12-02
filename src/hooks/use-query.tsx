/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryStore } from '@store/query.store';
import { useLocation, useSearchParams } from 'react-router-dom';

interface QueryState {
	filter: 'active' | 'inactive';
	query: Record<string, any>;
	merge(query?: Record<string, any>): void;
}

export function useQueryStore(): QueryState {
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

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { filter, row_id, ...query } = store.query;

	return { filter, query, merge };
}
