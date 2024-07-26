// src/api/interceptors.js
import axiosInstance from "./axiosInstance";
//js-cookies
import Cookies from "js-cookie";

export const setupInterceptors = () => {
  axiosInstance.interceptors.request.use(
    (config) => {
      var token = "";
      if (Cookies.get("auth_user_token")) {
        token = Cookies.get("auth_user_token");
        config.headers["Authorization"] = token ? `Bearer ${token}` : "";
      } else if (Cookies.get("auth_admin_token")) {
        token = Cookies.get("auth_admin_token");
        config.headers["Authorization"] = token ? `Bearer ${token}` : "";
      } else {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Handle errors globally if needed
      return Promise.reject(error);
    }
  );
};
