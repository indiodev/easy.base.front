import { API } from '@libs/api';
import { CreateTable, Table } from '@models/table.model';

export default class TableService {
	public async list(): Promise<Table[]> {
		const { data } = await API.get('/tables');
		return data;
	}

	public async show(id: string): Promise<Table> {
		const { data } = await API.get(`/tables/${id}`);
		return data;
	}

	public async create(payload: CreateTable): Promise<Table> {
		const { data } = await API.post('/tables', payload);
		return data;
	}
}
