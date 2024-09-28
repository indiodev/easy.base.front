import { API } from '@libs/api';
import { Column, CreateOrUpdateColumn } from '@models/column.model';

export default class ColumnService {
	async create(payload: CreateOrUpdateColumn) {
		const { data } = await API.post('/columns', payload);
		return data;
	}

	async update(payload: CreateOrUpdateColumn) {
		const { data } = await API.patch(
			`/columns/${payload?.column?._id}`,
			payload,
		);
		return data;
	}

	public async show(query: { id: string; tableId: string }): Promise<Column> {
		const { data } = await API.get(
			`/tables/${query.tableId}/columns/${query.id}`,
		);
		return data;
	}

	public async findManyByTableId(tableId: string): Promise<Column[]> {
		const { data } = await API.get(`tables/${tableId}/columns`);
		return data;
	}
}
