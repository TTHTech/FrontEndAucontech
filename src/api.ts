import axios from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL ?? "https://backendaucontech.onrender.com",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

console.log("API baseURL =", api.defaults.baseURL);
