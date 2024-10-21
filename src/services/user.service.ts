import { API } from '@libs/api';
import { User } from '@models/user.model';

export default class UserService {
	public async list(): Promise<User[]> {
		const { data } = await API.get('/users');
		return data;
	}
}
