import type { UseMutationResult } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { Row } from '@models/row.model';
import { Service } from '@services/index';

type Payload = {
	data: unknown;
	id: string;
};
async function mutator(payload: Payload): Promise<Row> {
	return Service.row.create(payload);
}

interface Props {
	onSuccess: (data: Row) => void;
	onError: (error: Error | AxiosError) => void;
}

export function useRowCreateMutation({
	onSuccess,
	onError,
}: Props): UseMutationResult<Row, Error | AxiosError, Payload> {
	return useMutation({
		mutationFn: mutator,
		onSuccess,
		onError,
	});
}
