import type { UseMutationResult } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { UserUpdateTable } from '@models/user.model';
import { Service } from '@services/index';

async function mutator(payload: Partial<UserUpdateTable>): Promise<void> {
	await Service.user.updateTable(payload);
}

interface Props {
	onSuccess: () => void;
	onError: (error: Error | AxiosError) => void;
}

export function useUserUpdateTableMutation({
	onSuccess,
	onError,
}: Props): UseMutationResult<
	void,
	Error | AxiosError,
	Partial<UserUpdateTable>
> {
	return useMutation({
		mutationFn: mutator,
		onSuccess,
		onError,
	});
}
