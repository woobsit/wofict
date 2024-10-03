import axiosInstance from "./axiosInstance";

const handleRequest = async (url, method = "get", data = null, config = {}) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // For GET requests, pass data as query parameters
    const finalConfig =
      method === "get" && data ? { ...config, params: data } : config;

    const response = await axiosInstance[method](
      url,
      method === "get" ? finalConfig : data,
      finalConfig
    );
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

  getApprovedCredentials: (page = 1) =>
    handleRequest(`/get-approved-credentials?page=${page}`),

  getPendingApprovalCredentials: (page = 1) =>
    handleRequest(`/get-pending-approval-credentials?page=${page}`),
  //Users with credentials
  getUserByCredentials: (id) => handleRequest(`/get-user-by-credentials/${id}`),
  // //view credentials of user
  // viewCredentials: (id) =>
  //   handleRequest(`/view-credentials/${id}`, "get", null, {
  //     responseType: "blob",
  //   }),
  //Approve credentials
  getApprovedCredential: (id) => handleRequest(`/approve-credential/${id}`),

  //Disapprove/pend credentials
  getPendCredential: (id) => handleRequest(`/pend-credential/${id}`),
  //Search credentials
  getSearchedCredentials: (searchTerm) =>
    handleRequest(
      `/search-credentials?prospective-students=${searchTerm}`,
      "get"
    ),

  getSearchedApprovedCredentials: (searchTerm) =>
    handleRequest(
      `/search-approved-credentials?approved-credentials-students=${searchTerm}`,
      "get"
    ),

  getSearchedPendingCredentials: (searchTerm) =>
    handleRequest(
      `/search-pending-credentials?pending-credentials-students=${searchTerm}`,
      "get"
    ),

  getAllAppliedUsers: () => handleRequest("get-all-applied-users"),

  getUsersWithGuarantors: (page = 1) =>
    handleRequest(`/users-with-guarantors?page=${page}`),

  getPendingApprovalGuarantors: (page = 1) =>
    handleRequest(`/pending-approval-guarantors?page=${page}`),
  getUsersWithApprovedGuarantors: (page = 1) =>
    handleRequest(`/users-with-approved-guarantors?page=${page}`),
  //Search users with guarantors
  getAllSearchedUsersWithGuarantors: (searchTerm) =>
    handleRequest(
      `/search-all-users-with-guarantors?all-guarantors-students=${searchTerm}`,
      "get"
    ),
  //Search users with guarantors pending/not approved
  getSearchGuarantorsNotApproved: (searchTerm) =>
    handleRequest(
      `/search-users-not-approved-guarantors?guarantors-not-approved-students=${searchTerm}`,
      "get"
    ),
  //Search users with approved guarantors
  getSearchedApprovedGuarantors: (searchTerm) =>
    handleRequest(
      `/search-users-with-approved-guarantors?approved-guarantors-students=${searchTerm}`,
      "get"
    ),
  //Approve guarantors status
  getApproveGuarantor: (id) => handleRequest(`/approve-guarantor/${id}`),
  //Disapprove/pend guarantors status
  getDisapproveGuarantor: (id) => handleRequest(`/disapprove-guarantor/${id}`),
  //Users with guarantors
  getUserWithGuarantors: (id) =>
    handleRequest(`/get-user-with-guarantors-by-id/${id}`),
  //Get all registered users. (email confirmed)
  getAllRegisteredUsers: (page = 1) =>
    handleRequest(`/get-all-registered-users?page=${page}`),
  //Search all registered users
  getSearchAllRegisteredUsers: (searchTerm) =>
    handleRequest(
      `/search-all-registered-users?search-all-registered-users=${searchTerm}`,
      "get"
    ),
  //Registered user
  getRegisteredUser: (id) => handleRequest(`/get-registered-user/${id}`),
  //Get all users to be admitted.
  getUsersToBeAdmitted: (page = 1) =>
    handleRequest(`/get-users-to-be-admitted?page=${page}`),
  //Search users to be admitted
  getSearchedUsersToBeAdmitted: (searchTerm) =>
    handleRequest(
      `/search-users-to-be-admitted?users-to-be-admitted=${searchTerm}`,
      "get"
    ),
  //admit user
  getAdmit: (id) => handleRequest(`/admit-user/${id}`),
  //current students count
  getCurrentStudentsCount: () => handleRequest(`/current-students-count`),
  //students growth
  getCurrentStudentsGrowth: () => handleRequest(`/students-growth-rate`),
  //registered users count
  getRegisteredUsersCount: () => handleRequest(`/registered-users-count`),
  //registered users growth
  getRegisteredUsersGrowth: () =>
    handleRequest(`/registered-users-growth-rate`),
  //pending credentials users count
  getPendingCredentialsUsersCount: () =>
    handleRequest(`/pending-credentials-users-count`),
  //growth rate pending credentials users
  getPendingCredentialsUsersGrowth: () =>
    handleRequest(`/pending-credentials-users-growth-rate`),
};

export default authService;
