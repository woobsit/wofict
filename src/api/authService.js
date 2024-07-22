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
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  userLogout: async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const token = Cookies.get("auth_user_token");
      if (!token) {
        throw new Error();
      }
      const response = await axiosInstance.post("/user-logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  userForgetPassword: async (email) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const token = "";
      const response = await axiosInstance.post(
        "/user-forget-password",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  userConfirmForgetPasswordToken: async (id) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const token = "";
      const response = await axiosInstance.post(
        "/user-confirm-forget-password-token",
        { new_password_token: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  userEnterNewPassword: async (email, password, password_confirmation) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const token = "";
      const response = await axiosInstance.post(
        "/user-enter-new-password",
        { email, password, password_confirmation },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
