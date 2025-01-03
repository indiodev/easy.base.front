/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';

type QueryStoreProps = {
	query: Record<string, any>;
	merge(query?: Record<string, any>): void;
};

export const INITIAL_QUERY_STATE = {
	page: 1,
	per_page: 10,
	filter: 'inactive',
} as const;

export const QueryStore = create<QueryStoreProps>((set) => ({
	query: INITIAL_QUERY_STATE,
	merge(query) {
		set((state) => ({ ...state, query: { ...state.query, ...query } }));
	},
}));
