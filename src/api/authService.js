import axiosInstance from "./axiosInstance";

const handleRequest = async (url, method = "get", data = null, config = {}) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axiosInstance[method](url, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const authService = {
  userLogin: (email, password, remember_token) =>
    handleRequest("/user-login", "post", { email, password, remember_token }),

  userLogout: () => handleRequest("/user-logout", "post"),

  userForgetPassword: (email) =>
    handleRequest("/user-forget-password", "post", { email }),

  userConfirmForgetPasswordToken: (id) =>
    handleRequest("/user-confirm-forget-password-token", "post", {
      forget_password: id,
    }),

  userEnterNewPassword: (
    email,
    password,
    password_confirmation,
    forget_password
  ) =>
    handleRequest("/user-enter-new-password", "post", {
      email,
      password,
      password_confirmation,
      forget_password,
    }),

  userRegister: (userData) => handleRequest("/register", "post", userData),

  adminLogin: (email, password, remember_token) =>
    handleRequest("/admin-login", "post", { email, password, remember_token }),

  adminLogout: () => handleRequest("/admin-logout", "post"),

  adminForgetPassword: (email) =>
    handleRequest("/admin-forget-password", "post", { email }),

  adminConfirmForgetPasswordToken: (id) =>
    handleRequest("/admin-confirm-forget-password-token", "post", {
      forget_password: id,
    }),

  adminEnterNewPassword: (
    email,
    password,
    password_confirmation,
    forget_password
  ) =>
    handleRequest("/admin-enter-new-password", "post", {
      email,
      password,
      password_confirmation,
      forget_password,
    }),

  websiteInfo: () => handleRequest("/website-info"),

  getUser: () => handleRequest("/get-user"),

  getAdmin: () => handleRequest("/get-admin"),

  downloadAcknowledgement: async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axiosInstance.get("/acknowledgement", {
        responseType: "blob", // Important to handle PDF response as a blob
      });
      if (response.status === 201) {
        // Process the blob response
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "acknowledgement.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();

        return { status: response.status, data: response.data };
      } else {
        return {
          status: response.status,
          message: "Unexpected response status",
        };
      }
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
      if (response.status === 201) {
        // Process the blob response
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "guarantor.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();

        return { status: response.status, data: response.data };
      } else {
        return {
          status: response.status,
          message: "Unexpected response status",
        };
      }
    } catch (error) {
      throw error;
    }
  },
  uploadCredentials: (qualification_level, upload_credentials) => {
    const formData = new FormData();
    formData.append("qualification_level", qualification_level);
    if (upload_credentials)
      formData.append("upload_credentials", upload_credentials);
    return handleRequest("/upload-credentials", "post", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  uploadGuarantors: (upload_guarantors_1, upload_guarantors_2) => {
    const formData = new FormData();
    if (upload_guarantors_1)
      formData.append("upload_guarantors_1", upload_guarantors_1);
    if (upload_guarantors_2)
      formData.append("upload_guarantors_2", upload_guarantors_2);
    return handleRequest("/upload-guarantors", "post", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getAllUsers: (page = 1) => handleRequest(`/get-all-users?page=${page}`),

  getUserByCredentials: (id) => handleRequest(`/get-user-by-credentials/${id}`),

  viewCredentials: (id) =>
    handleRequest(`/view-credentials/${id}`, "get", null, {
      responseType: "blob",
    }),
};

export default authService;
