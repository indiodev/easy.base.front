import { API } from '@libs/api';
import { Row } from '@models/row.model';

export default class RowService {
	public async create({
		id,
		data: payload,
	}: {
		data: FormData;
		id: string;
	}): Promise<Row> {
		const { data } = await API.post(`/tables/${id}/row`, payload, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		return data;
	}

	public async update({
		tableId,
		id,
		data: payload,
	}: {
		data: FormData;
		tableId: string;
		id: string;
	}): Promise<Row> {
		const { data } = await API.patch(`/tables/${tableId}/row/${id}`, payload, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		return data;
	}

	public async show(payload: { tableId: string; id: string }): Promise<Row> {
		const { data } = await API.get(
			`/tables/${payload.tableId}/row/${payload.id}`,
		);
		return data;
	}

	public async findMany({
		collection,
		columnId,
	}: {
		columnId: string;
		collection: string;
	}) {
		//

		const { data } = await API.get(
			`/tables/${collection}/column/${columnId}/row`,
		);
		return data;
	}

	public async delete(payload: { tableId: string; id: string }) {
		const { data } = await API.delete(
			`/tables/${payload.tableId}/row/${payload.id}`,
		);
		return data;
	}
}
