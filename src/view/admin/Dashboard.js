import React, { useState } from "react";
//React route dom
import { useNavigate } from "react-router-dom";
//API service
import authService from "./../../api/authService";
//utils
import { notify } from "./../../utils/Notification";
//Spinner loader
import Loader from "./../../components/atom/loader";
//js-cookies
import Cookies from "js-cookie";

function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const adminLogout = async () => {
    try {
      setLoading(true);
      const response = await authService.adminLogout();

      if (response.status === 204) {
        setLoading(false);
        Cookies.remove("auth_admin_token"); // remove token in cookies
        navigate("/admin-login");
      } else if (response.status === 401) {
        setLoading(false);
        notify("error", "Unauthorized", response.message);
      } else if (response.status === 500) {
        setLoading(false);
        notify("error", "System Error", response.message);
      }
    } catch (error) {
      setLoading(false);
      notify(
        "error",
        "Error",
        "An unexpected error occurred. Please try again."
      );
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div>
        Dashboard
        <button onClick={adminLogout} disabled={loading}>
          Logout
        </button>
      </div>
    </>
  );
}

export default Dashboard;