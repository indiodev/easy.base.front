import { useMutation, UseMutationResult } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { CreateOrUpdateColumn } from '@models/column.model';
import { Service } from '@services/index';

async function mutator(payload: CreateOrUpdateColumn): Promise<void> {
	await Service.column.update(payload);
}

interface Props {
	onSuccess: () => void;
	onError: (error: Error | AxiosError) => void;
}

export function useColumnUpdateMutation({
	onSuccess,
	onError,
}: Props): UseMutationResult<void, Error | AxiosError, CreateOrUpdateColumn> {
	return useMutation({
		mutationFn: mutator,
		onSuccess,
		onError,
	});
}
