import { API } from '@libs/api';
import { User, UserTableUpdate } from '@models/user.model';

export default class UserService {
	public async profile(): Promise<User> {
		const { data } = await API.get('/users/profile');
		return data;
	}

	public async list(): Promise<User[]> {
		const { data } = await API.get('/users');
		return data;
	}

	public async tableLayout(payload: UserTableUpdate): Promise<void> {
		await API.patch('/users/table-layout', payload);
	}
}
