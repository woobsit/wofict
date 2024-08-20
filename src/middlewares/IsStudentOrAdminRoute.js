import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import PropTypes from "prop-types";

const IsStudentOrAdminRoute = ({ userType }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticatedStudent = Cookies.get("auth_user_token");
    const isAuthenticatedAdmin = Cookies.get("auth_admin_token");

    if (userType === "student") {
      if (!isAuthenticatedStudent) {
        // If user is not authenticated, check if admin is authenticated
        if (isAuthenticatedAdmin) {
          navigate("/admin/dashboard"); // Redirect admin to their dashboard
        } else {
          navigate("/admin/login"); // Redirect unauthenticated users to homepage
        }
      }
    } else if (userType === "admin") {
      if (!isAuthenticatedAdmin) {
        // If admin is not authenticated, check if user is authenticated
        if (isAuthenticatedStudent) {
          navigate("/dashboard"); // Redirect user to their dashboard
        } else {
          navigate("/"); // Redirect unauthenticated admins to homepage
        }
      }
    }
  }, [userType, navigate]);

  return <Outlet />;
};

IsStudentOrAdminRoute.propTypes = {
  userType: PropTypes.string.isRequired,
};

export default IsStudentOrAdminRoute;
