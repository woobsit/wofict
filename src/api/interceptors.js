import axiosInstance from "./axiosInstance";
//js-cookies
import Cookies from "js-cookie";
//React route dom
//utils

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
      Cookies.remove("auth_user_token");
      Cookies.remove("auth_admin_token");
      if (error.response && error.response.status === 401) {
        // Unauthorized error, meaning the token is invalid
        window.location.replace("/");
        alert(
          "Session has expired. You have been logged out. Please try again later."
        );
      } else if (!error.response) {
        // Redirect to the login page with a message
        window.location.replace("/");
        alert(
          "There seems to be a problem with the backend. Please try again later."
        );
      }
      return Promise.reject(error);
    }
  );
};
