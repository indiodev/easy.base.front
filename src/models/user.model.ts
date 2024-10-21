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
}
