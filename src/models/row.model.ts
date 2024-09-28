export interface Row {
	_id: string;
	value: Record<string, number | string>;
	config: Object | null;
	createdAt: string;
	updatedAt: string | null;
	deletedAt: string | null;
	tableId: string;
	userId: string | null;
}
