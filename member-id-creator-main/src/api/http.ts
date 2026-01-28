import axios from "axios";

const api = axios.create({
  baseURL: "https://membericnv.onrender.com",
  withCredentials: true, // mantém cookie no desktop
});

// 🔑 Interceptor para iPhone / mobilehr
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
