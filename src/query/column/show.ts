import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { QUERY } from '@models/base.model';
import { Column } from '@models/column.model';
import { Service } from '@services/index';

async function fetcher(query: {
	id: string;
	tableId: string;
}): Promise<Column> {
	return await Service.column.show(query);
}

export function useColumnShowQuery(query: {
	id: string;
	tableId: string;
}): UseQueryResult<Column, Error | AxiosError> {
	return useQuery({
		queryKey: [QUERY.COLUMN_SHOW, query.id, query.tableId],
		queryFn: () => fetcher(query),
		enabled: !!query.id && !!query.tableId,
	});
}
