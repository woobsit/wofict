import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import PropTypes from "prop-types";

const IsStudentOrAdminRoute = ({ userType }) => {
  const isAuthenticatedStudent = Cookies.get("auth_user_token");
  const isAuthenticatedAdmin = Cookies.get("auth_admin_token");

  if (userType === "student") {
    if (!isAuthenticatedStudent) {
      // If user is not authenticated, check if admin is authenticated
      if (isAuthenticatedAdmin) {
        return <Navigate to="/admin/dashboard" replace />;

        // Redirect admin to their dashboard
      } else {
        return <Navigate to="/admin/login" replace />;
        // Redirect unauthenticated users to homepage
      }
    }
  } else if (userType === "admin") {
    if (!isAuthenticatedAdmin) {
      // If admin is not authenticated, check if user is authenticated
      if (isAuthenticatedStudent) {
        return <Navigate to="/dashboard" replace />;
        // Redirect user to their dashboard
      } else {
        return <Navigate to="/" replace />;
        // Redirect unauthenticated admins to homepage
      }
    }
  }

  return <Outlet />;
};

IsStudentOrAdminRoute.propTypes = {
  userType: PropTypes.string.isRequired,
};

export default IsStudentOrAdminRoute;
