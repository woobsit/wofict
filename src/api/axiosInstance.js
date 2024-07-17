// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api", // Set your base URL here
  withCredentials: true, // This allows cookies to be sent with requests
});

export default axiosInstance;
