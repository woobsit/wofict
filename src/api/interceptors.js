// src/api/interceptors.js
import axiosInstance from "./axiosInstance";
//js-cookies
import Cookies from "js-cookie";

export const setupInterceptors = () => {
  axiosInstance.interceptors.request.use(
    (config) => {
      // Add authorization token to headers if it exists
      //const token = store.getState().auth.token;
      //const token = store.getState().auth.token;
      var token = "";
      token = Cookies.get("auth_user_token");

      if (token) {
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
