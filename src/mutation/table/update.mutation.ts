import type { UseMutationResult } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { Table } from '@models/table.model';
import { Service } from '@services/index';

async function mutator(payload: Partial<Table>): Promise<Table> {
	return Service.table.update(payload);
}

interface Props {
	onSuccess: (data: Table) => void;
	onError: (error: Error | AxiosError) => void;
}

export function useTableUpdateMutation({
	onSuccess,
	onError,
}: Props): UseMutationResult<Table, Error | AxiosError, Partial<Table>> {
	return useMutation({
		mutationFn: mutator,
		onSuccess,
		onError,
	});
}
