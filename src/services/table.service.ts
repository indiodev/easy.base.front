import { API } from '@libs/api';
import { MetaResponse } from '@models/base.model';
import { Table } from '@models/table.model';

export default class TableService {
	public async list(): Promise<Table[]> {
		const { data } = await API.get('/tables');
		return data;
	}

	public async show({
		id,
		...query
	}: { id?: string } & Partial<Record<string, number | string>>): Promise<
		MetaResponse<Table>
	> {
		const { data } = await API.get(`/tables/${id}`, {
			params: query,
		});
		return data;
	}

	public async create(payload: Partial<Table>): Promise<Table> {
		const { data } = await API.post('/tables', payload);
		return data;
	}

	public async update({ _id, ...payload }: Partial<Table>): Promise<Table> {
		const { data } = await API.put(`/tables/${_id}`, payload);
		return data;
	}
}
