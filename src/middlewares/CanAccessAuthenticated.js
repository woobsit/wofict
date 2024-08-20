import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import PropTypes from "prop-types";

const CanAccessAuthenticated = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticatedAdmin = Cookies.get("auth_admin_token");
    const isAuthenticatedStudent = Cookies.get("auth_user_token");

    // Additional authentication checks based on user type
    if (isAuthenticatedAdmin) {
      navigate("/admin/dashboard");
    } else if (isAuthenticatedStudent) {
      navigate("/dashboard");
    }
  }, []);

  return <Outlet />;
};

CanAccessAuthenticated.propTypes = {
  children: PropTypes.node,
};

export default CanAccessAuthenticated;
