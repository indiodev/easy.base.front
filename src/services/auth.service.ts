import { API } from '@libs/api';
import { AuthSignIn, AuthTokenResponse } from '@models/auth.model';

export default class AuthService {
	public async signIn(payload: AuthSignIn): Promise<AuthTokenResponse> {
		const { data } = await API.post('/login', payload);
		return data;
	}
}
