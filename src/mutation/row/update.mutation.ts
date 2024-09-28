import type { UseMutationResult } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { Service } from '@services/index';

type Payload = {
	data: FormData;
	id: string;
	tableId: string;
};
async function mutator(payload: Payload): Promise<void> {
	Service.row.update(payload);
}

interface Props {
	onSuccess: () => void;
	onError: (error: Error | AxiosError) => void;
}

export function useRowUpdateMutation({
	onSuccess,
	onError,
}: Props): UseMutationResult<void, Error | AxiosError, Payload> {
	return useMutation({
		mutationFn: mutator,
		onSuccess,
		onError,
	});
}
