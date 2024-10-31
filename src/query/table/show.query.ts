/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { MetaResponse, QUERY } from '@models/base.model';
import { Table } from '@models/table.model';
import { Service } from '@services/index';

async function fetcher(query: {
	id: string;
	[key: string]: any;
}): Promise<MetaResponse<Table>> {
	return await Service.table.show(query);
}

export function useTableShowQuery(query: {
	id: string;
	[key: string]: any;
}): UseQueryResult<MetaResponse<Table>, Error | AxiosError> {
	return useQuery({
		queryKey: [QUERY.TABLE_SHOW, query.id],
		queryFn: () => fetcher(query),
		enabled: !!query.id,
	});
}
