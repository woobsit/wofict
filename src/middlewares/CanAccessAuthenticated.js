import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import PropTypes from "prop-types";

const CanAccessAuthenticated = () => {
  const isAuthenticatedAdmin = Cookies.get("auth_admin_token");
  const isAuthenticatedStudent = Cookies.get("auth_user_token");

  // Additional authentication checks based on user type
  if (isAuthenticatedAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (isAuthenticatedStudent) {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <Outlet />;
  }
};

CanAccessAuthenticated.propTypes = {
  children: PropTypes.node,
};

export default CanAccessAuthenticated;
