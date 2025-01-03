import { COLUMN_FORMAT, COLUMN_TYPE } from './base.model';

export interface Column {
	_id: string;
	title: string;
	identifier: string | null;
	slug: string;
	type: COLUMN_TYPE;
	data: string | null;
	config: {
		options?: { label: string; value: string }[];
		multiple?: boolean;
		display?: boolean;
		required?: boolean;
		filter?: boolean;
		default?: string;
		format?: COLUMN_FORMAT;
		relation?: {
			collection: string;
			path: string;
			slug: string;
			visible?: string;
		};
	};
	status: string | null;
	created_at: string;
	updated_at: string | null;
	deleted_at: string | null;
	tableId: string;
}

export type CreateOrUpdateColumn = {
	tableId: string;
	column: Partial<Column>;
};
