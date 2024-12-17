import { Column } from './column.model';
import { Row } from './row.model';

export interface Table {
	_id: string;
	id: string;
	title: string;
	description?: string;
	logo?: string;
	identifier: string;
	config?: {
		layout?: 'grid' | 'list';
		visibility?: 'PUBLIC' | 'FOR_LOGGED_IN' | 'FOR_ADMINISTRATORS';
		collaboration?: 'RESTRICTED' | 'OPEN';
		administrators?: string[];
	};
	category: string | null;
	data_collection: string;
	status: string | null;
	created_at: string;
	updated_at: string | null;
	deleted_at: string | null;
	ownerId: string | null;
	columns: Column[];
	rows: Row[];
}
