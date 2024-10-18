import { useQuery } from '@tanstack/react-query';

import { QUERY } from '@models/base.model';
import { Service } from '@services/index';

async function fetcher(query: { columnId: string; collection: string }) {
	return await Service.row.findMany(query);
}

export function useRowFindManyQuery(query: {
	columnId: string;
	collection: string;
}) {
	return useQuery({
		queryKey: [QUERY.ROW_FIND_MANY, query.columnId, query.collection],
		queryFn: () => fetcher(query),
		enabled: !!query.columnId && !!query.collection,
	});
}
