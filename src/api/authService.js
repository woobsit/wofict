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
        { forget_password: id },
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
  userEnterNewPassword: async (
    email,
    password,
    password_confirmation,
    forget_password
  ) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const token = "";
      const response = await axiosInstance.post(
        "/user-enter-new-password",
        { email, password, password_confirmation, forget_password },
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
  userRegister: async (userData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axiosInstance.post("/register", userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  adminLogin: async (email, password, remember_token) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axiosInstance.post("/admin-login", {
        email,
        password,
        remember_token,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  adminLogout: async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const token = Cookies.get("auth_admin_token");
      if (!token) {
        throw new Error();
      }
      const response = await axiosInstance.post("/admin-logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  adminForgetPassword: async (email) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const token = "";
      const response = await axiosInstance.post(
        "/admin-forget-password",
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
  adminConfirmForgetPasswordToken: async (id) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const token = "";
      const response = await axiosInstance.post(
        "/admin-confirm-forget-password-token",
        { forget_password: id },
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
  adminEnterNewPassword: async (
    email,
    password,
    password_confirmation,
    forget_password
  ) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const token = "";
      const response = await axiosInstance.post(
        "/admin-enter-new-password",
        { email, password, password_confirmation, forget_password },
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
};

export default authService;
