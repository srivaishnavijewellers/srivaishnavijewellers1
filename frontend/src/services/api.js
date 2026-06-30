import axios from "axios";
import { clearSession, getStoredSession } from "../utils/authStorage.js";
import { base_url } from "../config.js";

const api = axios.create({
  baseURL: base_url
});

api.interceptors.request.use((config) => {
  const session = getStoredSession();

  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession();
    }

    return Promise.reject(error);
  }
);

export default api;

