import type { UseMutationResult } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { Service } from '@services/index';

type Payload = { tableId: string; id: string };

async function mutator(payload: Payload): Promise<void> {
	return Service.row.delete(payload);
}

interface Props {
	onSuccess: () => void;
	onError: (error: Error | AxiosError) => void;
}

export function useRowDeleteMutation({
	onSuccess,
	onError,
}: Props): UseMutationResult<void, Error | AxiosError, Payload> {
	return useMutation({
		mutationFn: mutator,
		onSuccess,
		onError,
	});
}
