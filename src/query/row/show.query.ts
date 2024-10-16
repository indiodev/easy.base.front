import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { QUERY } from '@models/base.model';
import { Row } from '@models/row.model';
import { Service } from '@services/index';

async function fetcher(query: { id: string; tableId: string }): Promise<Row> {
	return await Service.row.show(query);
}

export function useRowShowQuery(query: {
	id: string;
	tableId: string;
}): UseQueryResult<Row, Error | AxiosError> {
	return useQuery({
		queryKey: [QUERY.ROW_SHOW, query.id, query.tableId],
		queryFn: () => fetcher(query),
		enabled: !!query.id && !!query.tableId,
	});
}
