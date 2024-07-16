// src/api/authService.js
import axiosInstance from "./axiosInstance";
//js-cookies
import Cookies from "js-cookie";

const authService = {
  userLogin: async (email, password) => {
    try {
      const response = await axiosInstance.post("/user-login", {
        email,
        password,
      });
      if (response.data.token) {
        Cookies.set("auth_user_token", response.data.token); // Store token in local storage
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  register: async (userData) => {
    try {
      const response = await axiosInstance.post("/register", userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // Add more authentication-related methods as needed
};

export default authService;
