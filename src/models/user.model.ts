import { Row } from './row.model';
import { Table } from './table.model';

export interface User {
	_id: string;
	name: string;
	email: string;
	tables: Table[];
	// reviews: Review[],
	rows: Row[];
	// forms: Form[],
	created_at: string;
	config?: {
		table?: Record<string, { layout: 'grid' | 'list' }>;
	};
}

//name, email,

export interface UserUpdateTable {
	// id: string;
	tableId: string;
	layout: 'grid' | 'list';
	column_order?: {
		root?: string[];
		form?: string[];
	};
}
