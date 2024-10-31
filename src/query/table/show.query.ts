import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { QUERY } from '@models/base.model';
import { Table } from '@models/table.model';
import { Service } from '@services/index';

async function fetcher(query: {
	id: string;
	[key: string]: number | string | boolean;
}): Promise<Table> {
	return await Service.table.show(query);
}

export function useTableShowQuery(query: {
	id: string;
	[key: string]: number | string | boolean;
}): UseQueryResult<Table, Error | AxiosError> {
	return useQuery({
		queryKey: [QUERY.TABLE_SHOW, query.id],
		queryFn: () => fetcher(query),
		enabled: !!query.id,
	});
}
