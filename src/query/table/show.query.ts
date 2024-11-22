/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { MetaResponse, QUERY, QueryParams } from '@models/base.model';
import { Table } from '@models/table.model';
import { Service } from '@services/index';

async function fetcher(query: QueryParams): Promise<MetaResponse<Table>> {
	return await Service.table.show(query);
}

export function useTableShowQuery({
	id,
	...query
}: QueryParams): UseQueryResult<MetaResponse<Table>, Error | AxiosError> {
	return useQuery({
		queryKey: [QUERY.TABLE_SHOW, id, query],
		queryFn: () => fetcher({ ...query, id }),
		enabled: !!id,
	});

	// return { ...result, data };
}
