import type { UseMutationResult } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { CreateTable, Table } from '@models/table.model';
import { Service } from '@services/index';

async function mutator(payload: CreateTable): Promise<Table> {
	return Service.table.create(payload);
}

interface Props {
	onSuccess: (data: Table) => void;
	onError: (error: Error | AxiosError) => void;
}

export function useTableCreateMutation({
	onSuccess,
	onError,
}: Props): UseMutationResult<Table, Error | AxiosError, CreateTable> {
	return useMutation({
		mutationFn: mutator,
		onSuccess,
		onError,
	});
}
