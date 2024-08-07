import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("GBD-TOKEN")?.replaceAll('"', "");
  if (config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.data?.code === 401) {
      console.error(error);
      console.log("Erro 401");
    }
    return Promise.reject(error);
  }
);

export { API };
