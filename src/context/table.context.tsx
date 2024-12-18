import { tanstack } from '@libs/tanstack';
import { QUERY } from '@models/base.model';
import { Column } from '@models/column.model';
import { Table } from '@models/table.model';
import React from 'react';

type FindTableColumnById = {
	columnId: string;
	tableId: string;
};
export interface TableContextType {
	tables: Table[];
	findTableById: (id: string) => Table | null;
	findTableByCollection: (collection: string) => Table | null;
	findOneColumn: (query: FindTableColumnById) => Column | null;
	findManyColumnByTableId: (id: string) => Column[];
}

export const TableContext = React.createContext<TableContextType | undefined>(
	undefined,
);

type TableContextProps = {
	children: React.ReactNode;
};

export const TableProvider = ({ children }: TableContextProps) => {
	const [tables, setTables] = React.useState<Table[]>([]);

	const loadTables = React.useCallback(() => {
		const table_list = tanstack.getQueryData<Table[]>([QUERY.TABLE_LIST]);
		return table_list ?? [];
	}, []);

	const initialTables = React.useMemo(() => loadTables(), [loadTables]);

	const findTableById = React.useCallback(
		(id: string) => {
			return tables.find((table) => table._id === id) ?? null;
		},
		[tables],
	);

	const findTableByCollection = React.useCallback(
		(collection: string) => {
			return (
				tables.find((table) => table.data_collection === collection) ?? null
			);
		},
		[tables],
	);

	const findOneColumn = React.useCallback(
		(query: FindTableColumnById) => {
			return (
				tables
					.find((table) => table._id === query.tableId)
					?.columns.find((column) => column._id === query.columnId) ?? null
			);
		},
		[tables],
	);

	const findManyColumnByTableId = React.useCallback(
		(id: string) => {
			return tables.find((table) => table._id === id)?.columns ?? [];
		},
		[tables],
	);

	React.useEffect(() => {
		setTables(initialTables);
	}, [initialTables]);

	return (
		<TableContext.Provider
			value={{
				tables,
				findTableById,
				findTableByCollection,
				findOneColumn,
				findManyColumnByTableId,
				// table,
				// columns,
				// updateColumn,
				// addColumn,
				// hasMoreThanFiveColumns,
			}}
		>
			{children}
		</TableContext.Provider>
	);
};
