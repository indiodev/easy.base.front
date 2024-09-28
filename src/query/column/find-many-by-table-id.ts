import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { QUERY } from '@models/base.model';
import { Column } from '@models/column.model';
import { Service } from '@services/index';

async function fetcher(tableId: string): Promise<Column[]> {
	return await Service.column.findManyByTableId(tableId);
}

export function useColumnFindManyByTableIdQuery({
	tableId,
}: {
	tableId: string;
}): UseQueryResult<Column[], Error | AxiosError> {
	return useQuery({
		queryKey: [QUERY.COLUMN_FIND_MANY_BY_TABLE_ID, tableId],
		queryFn: () => fetcher(tableId),
		enabled: !!tableId,
	});
}
