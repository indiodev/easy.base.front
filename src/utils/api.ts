import axios, { AxiosInstance } from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL
}) as AxiosInstance;

export default api;