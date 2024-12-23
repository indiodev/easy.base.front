/* eslint-disable @typescript-eslint/no-explicit-any */
import { tanstack } from '@libs/tanstack';
import { MetaResponse, QUERY } from '@models/base.model';
import { Column } from '@models/column.model';
import { Row } from '@models/row.model';
import { Table } from '@models/table.model';
import React from 'react';

type FindTableColumnById = {
	columnId: string;
	tableId: string;
};

type FindTableRowById = { tableId: string; query: Record<string, any> };

export interface TableContextType {
	tables: Table[];
	findTableById: (id: string) => Table | null;
	findTableByCollection: (collection: string) => Table | null;
	findOneColumn: (query: FindTableColumnById) => Column | null;
	findManyColumnByTableId: (id: string) => Column[];
	addColumnToTable: (tableId: string, column: Partial<Column>) => void;
	updateColumnFromTable: (tableId: string, column: Partial<Column>) => void;
	// findOneRow: (query: FindTableRowById) => Row['value'] | null;
	findManyRowByTableId: (query: FindTableRowById) => Row['value'][];
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

	const addColumnToTable = React.useCallback(
		(tableId: string, column: Partial<Column>) => {
			const table = tables.find((table) => table._id === tableId) ?? null;
			if (!table) return;

			const columns = [...table.columns, column] as Column[];

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

	const updateColumnFromTable = React.useCallback(
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

			tanstack.invalidateQueries({
				queryKey: [QUERY.TABLE_LIST],
			});

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

	const findManyRowByTableId = React.useCallback(
		({ tableId, query }: FindTableRowById) => {
			return (
				tanstack.getQueryData<MetaResponse<Row['value'][]>>([
					QUERY.ROW_PAGINATE,
					tableId,
					query,
				])?.data ?? []
			);
		},
		[],
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
				addColumnToTable,
				updateColumnFromTable,
				findManyRowByTableId,
			}}
		>
			{children}
		</TableContext.Provider>
	);
};
