import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { QUERY } from '@models/base.model';
import { Table } from '@models/table.model';
import { Service } from '@services/index';

async function fetcher(id: string): Promise<Table> {
	return await Service.table.show(id);
}

export function useTableShowQuery({
	id,
}: {
	id: string;
}): UseQueryResult<Table, Error | AxiosError> {
	return useQuery({
		queryKey: [QUERY.TABLE_SHOW, id],
		queryFn: () => fetcher(id),
		enabled: !!id,
	});
}
