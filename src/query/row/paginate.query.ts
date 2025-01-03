/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { MetaResponse, QUERY, QueryParams } from '@models/base.model';
import { Row } from '@models/row.model';
import { Service } from '@services/index';

async function fetcher(query: QueryParams): Promise<MetaResponse<Row[]>> {
	return await Service.row.paginate(query);
}

export function useRowPaginateQuery({
	id,
	...query
}: QueryParams): UseQueryResult<MetaResponse<Row[]>, Error | AxiosError> {
	return useQuery({
		queryKey: [QUERY.ROW_PAGINATE, id, query],
		queryFn: () => fetcher({ ...query, id }),
		enabled: !!id,
	});
}
