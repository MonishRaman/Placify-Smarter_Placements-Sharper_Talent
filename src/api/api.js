import axios from "axios";

// Base URL for backend API
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // if you need cookies / JWT in headers
});

export default API;
