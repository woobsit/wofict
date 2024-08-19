// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1", // Set your base URL here
  withCredentials: true, // This allows cookies to be sent with requests
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default axiosInstance;
