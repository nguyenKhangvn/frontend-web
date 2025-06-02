import axios from "axios";
import { store } from "../redux/store";

// console.log("Axios base URL:", import.meta.env.VITE_API_URL);

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

instance.interceptors.request.use((config) => {
  let token = (store.getState() as any).account?.accessToken;

  if (!token) {
    token = localStorage.getItem("access_token") || "";
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;
