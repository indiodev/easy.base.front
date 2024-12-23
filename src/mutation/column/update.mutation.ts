import { useMutation, UseMutationResult } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { Column, CreateOrUpdateColumn } from '@models/column.model';
import { Service } from '@services/index';

async function mutator(
	payload: CreateOrUpdateColumn,
): Promise<Partial<Column>> {
	return await Service.column.update(payload);
}

interface Props {
	onSuccess: (data: Partial<Column>) => void;
	onError: (error: Error | AxiosError) => void;
}

export function useColumnUpdateMutation({
	onSuccess,
	onError,
}: Props): UseMutationResult<
	Partial<Column>,
	Error | AxiosError,
	CreateOrUpdateColumn
> {
	return useMutation({
		mutationFn: mutator,
		onSuccess,
		onError,
	});
}
