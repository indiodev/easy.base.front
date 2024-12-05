import { tanstack } from '@libs/tanstack';
import { QUERY } from '@models/base.model';
import { Table } from '@models/table.model';
import React from 'react';
import { useParams } from 'react-router-dom';

export function useTableColumns() {
	const params = useParams();

	const [columns, setColumns] = React.useState<Table['columns']>([]);

	const loadColumns = React.useCallback(() => {
		const table_list = tanstack.getQueryData<Table[]>([QUERY.TABLE_LIST]);
		const columns = table_list?.find((t) => t._id === params.id)?.columns;
		return columns ?? [];
	}, [params.id]);

	const initialColumns = React.useMemo(() => loadColumns(), [loadColumns]);

	React.useEffect(() => {
		setColumns(initialColumns);
	}, [initialColumns]);

	const hasMoreThanFiveColumns = (columns?.length ?? 0) > 5;

	return {
		columns,
		setColumns,
		hasMoreThanFiveColumns,
	};
}
