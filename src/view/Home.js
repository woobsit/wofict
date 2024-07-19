import React, { useState } from "react";
//React route dom
import { useNavigate } from "react-router-dom";
//API service
import authService from "./../api/authService";
//sweet alert2
import Swal from "sweetalert2";
//Spinner loader
import Loader from "./../components/atom/loader";
//js-cookies
import Cookies from "js-cookie";
function Home() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const userLogout = async () => {
    try {
      setLoading(true);
      const response = await authService.userLogout();

      if (response.status === 204) {
        setLoading(false);
        Cookies.remove("auth_user_token"); // remove token in cookies
        navigate("/");
      } else if (response.status === 401) {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: response.message,
          text: "Unauthorized user",
        });
      } else if (response.status === 500) {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: response.message,
          text: "A system error has occurred",
        });
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div>
        Home
        <button onClick={userLogout} disabled={loading}>
          Logout
        </button>
      </div>
    </>
  );
}

export default Home;
