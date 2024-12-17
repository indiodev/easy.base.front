import { STORE } from '@models/base.model';
import axios from 'axios';

const API = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333',
	withCredentials: true,
});

const store = JSON.parse(sessionStorage.getItem(STORE.AUTH_STORE) || '{}');

API.defaults.headers.common['Content-Type'] = 'application/json';

if (store?.state?.token) {
	API.defaults.headers.common.Authorization = `Bearer ${store?.state?.token}`;
}

if (!store?.state?.token) {
	sessionStorage.clear();
}

API.interceptors.request.use(
	function (config) {
		return config;
	},
	function (error) {
		console.error(error);
		return Promise.reject(error);
	},
);

API.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		console.error(error);
		return Promise.reject(error);
	},
);

export { API };
