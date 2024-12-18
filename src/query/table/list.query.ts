import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { QUERY } from '@models/base.model';
import { Table } from '@models/table.model';
import { Service } from '@services/index';

async function fetcher(): Promise<Table[]> {
	return await Service.table.list();
}

export function useTableListQuery(): UseQueryResult<
	Table[],
	Error | AxiosError
> {
	return useQuery({
		queryKey: [QUERY.TABLE_LIST],
		queryFn: fetcher,
	});
}
