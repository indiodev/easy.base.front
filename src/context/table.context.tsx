/* eslint-disable @typescript-eslint/no-explicit-any */
import { tanstack } from '@libs/tanstack';
import { MetaResponse, QUERY } from '@models/base.model';
import { Column } from '@models/column.model';
import { Row } from '@models/row.model';
import { Table } from '@models/table.model';
import { useTableListQuery } from '@query/table/list.query';
import React from 'react';

type FinOneColumn = {
	columnId: string;
	tableId: string;
};

type FindManyRow = { tableId: string; query: Record<string, any> };
type FindOneRow = {
	tableId: string;
	id: string;
	query: Record<string, any>;
};

export interface TableContextType {
	// TABLES
	isPending: boolean;
	isSuccess: boolean;
	isError: boolean;
	tables: Table[];
	findOneTable: (id: string) => Table | null;
	findOneTableByCollection: (collection: string) => Table | null;
	// COLUMNS
	findOneColumn: (query: FinOneColumn) => Column | null;
	findManyColumn: (id: string) => Column[];
	addColumn: (tableId: string, column: Partial<Column>) => void;
	updateColumn: (tableId: string, column: Partial<Column>) => void;
	// ROWS
	findManyRow: (query: FindManyRow) => Row[];
	findOneRow: (query: FindOneRow) => Row | null;
}

export const TableContext = React.createContext<TableContextType | undefined>(
	undefined,
);

type TableContextProps = {
	children: React.ReactNode;
};

export const TableProvider = ({ children }: TableContextProps) => {
	// TABLES
	const { data: response, status } = useTableListQuery();
	const [tables, setTables] = React.useState<Table[]>([]);

	const isPending = status === 'pending';
	const isSuccess = status === 'success';
	const isError = status === 'error';

	const loadTables = React.useCallback(() => {
		if (isPending) return [];
		if (isError) return [];
		return response ?? [];
	}, [isError, isPending, response]);

	const initialTables = React.useMemo(() => loadTables(), [loadTables]);

	const findOneTable = React.useCallback(
		(id: string) => {
			return tables.find((table) => table._id === id) ?? null;
		},
		[tables],
	);

	const findOneTableByCollection = React.useCallback(
		(collection: string) => {
			return (
				tables.find((table) => table.data_collection === collection) ?? null
			);
		},
		[tables],
	);

	// COLUMNS

	const findOneColumn = React.useCallback(
		(query: FinOneColumn) => {
			return (
				tables
					.find((table) => table._id === query.tableId)
					?.columns.find((column) => column._id === query.columnId) ?? null
			);
		},
		[tables],
	);

	const findManyColumn = React.useCallback(
		(id: string) => {
			return tables.find((table) => table._id === id)?.columns ?? [];
		},
		[tables],
	);

	const addColumn = React.useCallback(
		(tableId: string, column: Partial<Column>) => {
			const table = tables.find((table) => table._id === tableId) ?? null;
			if (!table) return;

			const columns = [...table.columns, column] as Column[];

			// tanstack.invalidateQueries({
			// 	queryKey: [QUERY.TABLE_LIST],
			// });

			tanstack.setQueryData<Table[]>([QUERY.TABLE_LIST], (prev) => {
				const data =
					prev?.map((table) => {
						if (table._id === tableId) {
							return {
								...table,
								columns,
							};
						}
						return table;
					}) ?? [];
				setTables(data);
				return data;
			});
		},
		[tables],
	);

	const updateColumn = React.useCallback(
		(tableId: string, column: Partial<Column>) => {
			const table = tables.find((table) => table._id === tableId) ?? null;
			if (!table) return;

			const columns = table?.columns.map((col) => {
				if (col._id === column._id) {
					return {
						...col,
						...column,
					};
				}
				return col;
			}) as Column[];

			// tanstack.invalidateQueries({
			// 	queryKey: [QUERY.TABLE_LIST],
			// });

			tanstack.setQueryData<Table[]>([QUERY.TABLE_LIST], (prev) => {
				const data =
					prev?.map((table) => {
						if (table._id === tableId) {
							return {
								...table,
								columns,
							};
						}
						return table;
					}) ?? [];
				setTables(data);
				return data;
			});
		},
		[tables],
	);

	// ROWS

	const findManyRow = React.useCallback(({ tableId, query }: FindManyRow) => {
		const rows = tanstack.getQueryData<MetaResponse<Row[]>>([
			QUERY.ROW_PAGINATE,
			tableId,
			query,
		])?.data;
		return rows ?? [];
	}, []);

	const findOneRow = React.useCallback(({ tableId, id, query }: FindOneRow) => {
		const rows =
			tanstack.getQueryData<MetaResponse<Row[]>>([
				QUERY.ROW_PAGINATE,
				tableId,
				query,
			])?.data ?? [];

		const row = rows?.find((row) => row._id === id);
		console.info({ rows, row, query, tableId });
		return row ?? null;
	}, []);

	React.useEffect(() => {
		setTables(initialTables);
	}, [initialTables]);

	return (
		<TableContext.Provider
			value={{
				// TABLES
				tables,
				isPending,
				isSuccess,
				isError,
				findOneTable,
				findOneTableByCollection,
				// COLUMNS
				findOneColumn,
				findManyColumn,
				addColumn,
				updateColumn,
				// ROWS
				findManyRow,
				findOneRow,
			}}
		>
			{children}
		</TableContext.Provider>
	);
};
