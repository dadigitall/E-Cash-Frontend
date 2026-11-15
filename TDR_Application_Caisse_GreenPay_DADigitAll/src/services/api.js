import axios from "axios";

// S'adapte à l'adresse utilisée pour ouvrir le site (localhost ou IP du PC)
const API_URL =
  import.meta.env.VITE_API_URL ?? `http://${window.location.hostname}:8000/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
