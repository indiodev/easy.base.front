import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: false, //debug
});

API.interceptors.request.use((config) => {
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
