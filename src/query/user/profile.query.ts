import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { QUERY } from '@models/base.model';
import { User } from '@models/user.model';
import { Service } from '@services/index';

async function fetcher(): Promise<User> {
	return await Service.user.profile();
}

export function useUserProfileQuery(): UseQueryResult<
	User,
	Error | AxiosError
> {
	return useQuery({
		queryKey: [QUERY.USER_PROFILE],
		queryFn: fetcher,
	});
}
