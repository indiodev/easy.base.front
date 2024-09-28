// import { Service } from '@services/index';
import type { UseMutationResult } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import type { AuthSignIn, AuthTokenResponse } from '@models/auth.model';
import { Service } from '@services/index';

async function mutator(data: AuthSignIn): Promise<AuthTokenResponse> {
	return Service.auth.signIn(data);
}

interface Props {
	onSuccess: (data: AuthTokenResponse) => void;
	onError: (error: Error | AxiosError) => void;
}

export function useSignInMutation({
	onSuccess,
	onError,
}: Props): UseMutationResult<
	AuthTokenResponse,
	Error | AxiosError,
	AuthSignIn
> {
	return useMutation({
		mutationFn: mutator,
		onSuccess,
		onError,
	});
}
