/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryStore } from '@store/query.store';
import { useLocation, useSearchParams } from 'react-router-dom';

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
