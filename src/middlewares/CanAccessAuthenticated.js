import React from "react";
import { Navigate, Outlet } from "react-router-dom";
//api
import getAuthAdminData from "./../api/handleAuthAdminCookies";
import getAuthUserData from "./../api/handleAuthUserCookies";

import PropTypes from "prop-types";

const CanAccessAuthenticated = () => {
  const isAuthenticatedAdmin = getAuthAdminData();
  const isAuthenticatedStudent = getAuthUserData();

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
