// src/api/authService.js
import axiosInstance from "./axiosInstance";
//js-cookies
import Cookies from "js-cookie";

const authService = {
  userLogin: async (email, password, remember_token) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axiosInstance.post("/user-login", {
        email,
        password,
        remember_token,
      });
      if (response.data.token) {
        Cookies.set("auth_user_token", response.data.token); // Store token in cookies
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  register: async (userData) => {
    // eslint-disable-next-line no-useless-catch
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
