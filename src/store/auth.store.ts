import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { API } from '@libs/api';
import { STORE } from '@models/base.model';

type AuthStoreProps = {
	token?: string;

	append(payload: { token: string }): void;
	clear(): void;
};

export const AuthStore = create<AuthStoreProps>()(
	persist(
		(set) => ({
			token: undefined,
			append(payload): void {
				API.defaults.headers.common.Authorization = `Bearer ${payload.token}`;
				set(payload);
			},
			clear(): void {
				set({ token: undefined });
			},
		}),
		{
			name: STORE.AUTH_STORE,
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
