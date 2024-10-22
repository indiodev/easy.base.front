import type { UseMutationResult } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { UserTableUpdate } from '@models/user.model';
import { Service } from '@services/index';

async function mutator(payload: Partial<UserTableUpdate>): Promise<void> {
	await Service.user.tableLayout(payload);
}

interface Props {
	onSuccess: () => void;
	onError: (error: Error | AxiosError) => void;
}

export function useUserTableLayoutMutation({
	onSuccess,
	onError,
}: Props): UseMutationResult<
	void,
	Error | AxiosError,
	Partial<UserTableUpdate>
> {
	return useMutation({
		mutationFn: mutator,
		onSuccess,
		onError,
	});
}
