// src/api/authService.js
import axiosInstance from "./axiosInstance";

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
      const response = await axiosInstance.post("/user-logout");

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  userForgetPassword: async (email) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axiosInstance.post("/user-forget-password", {
        email,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  userConfirmForgetPasswordToken: async (id) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axiosInstance.post(
        "/user-confirm-forget-password-token",
        { forget_password: id }
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
      const response = await axiosInstance.post("/user-enter-new-password", {
        email,
        password,
        password_confirmation,
        forget_password,
      });
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
      const response = await axiosInstance.post("/admin-logout");

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  adminForgetPassword: async (email) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axiosInstance.post("/admin-forget-password", {
        email,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  adminConfirmForgetPasswordToken: async (id) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axiosInstance.post(
        "/admin-confirm-forget-password-token",
        { forget_password: id }
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
      const response = await axiosInstance.post("/admin-enter-new-password", {
        email,
        password,
        password_confirmation,
        forget_password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  websiteInfo: async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axiosInstance.get("/website-info");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getUser: async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axiosInstance.get("/get-user");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  downloadAcknowledgement: async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axiosInstance.get("/acknowledgement", {
        responseType: "blob", // Important to handle PDF response as a blob
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "acknowledgement.pdf"); // or any other extension
      document.body.appendChild(link);
      link.click();
      link.remove();

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  downloadGuarantor: async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axiosInstance.get("/guarantor", {
        responseType: "blob", // Important to handle PDF response as a blob
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "guarantor.pdf"); // or any other extension
      document.body.appendChild(link);
      link.click();
      link.remove();

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  uploadCredentials: async (qualification_level, upload_credentials) => {
    // eslint-disable-next-line no-useless-catch
    try {
      // Create a FormData object to hold the form fields and file
      const formData = new FormData();
      // Append the qualification text input
      formData.append("qualification_level", qualification_level);

      // Append the uploaded file (assuming upload_credentials is the file object)
      if (upload_credentials) {
        formData.append("upload_credentials", upload_credentials);
      }

      // Make the POST request with the FormData
      const response = await axiosInstance.post(
        "/upload-credentials",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Return the response data
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  uploadGuarantors: async (upload_credentials_1, upload_credentials_2) => {
    // eslint-disable-next-line no-useless-catch
    try {
      // Create a FormData object to hold the form fields and file
      const formData = new FormData();
      console.log(formData);
      // Append the uploaded file
      if (upload_credentials_1) {
        formData.append("upload_credentials_1", upload_credentials_1);
      } else if (upload_credentials_2) {
        formData.append("upload_credentials_2", upload_credentials_2);
      }
      // Make the POST request with the FormData
      const response = await axiosInstance.post(
        "/upload-guarantors",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Return the response data
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
