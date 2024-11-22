/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Row {
	_id: string;
	value: Record<string, any>;
	config: object | null;
	createdAt: string;
	updatedAt: string | null;
	deletedAt: string | null;
	tableId: string;
	userId: string | null;
}
