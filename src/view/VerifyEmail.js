import React, { useState, useEffect } from "react";
//React route dom
import { useParams, useNavigate } from "react-router-dom";
//API service
import authService from "./../api/authService";
//utils
import { notify } from "./../utils/Notification";
//sweet alert2
import Swal from "sweetalert2";
//Spinner loader
import Loader from "./../components/atom/loader";

function VerifyEmail() {
  const { verify } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const setVerifyEmail = async () => {
      setLoading(true);
      try {
        const response = await authService.verifyEmail(verify);
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Email Verified!",
            text: "Your email has been successfully validated.",
            showConfirmButton: true, // Show the "OK" button
            allowOutsideClick: false, // Prevent closing by clicking outside the dialog
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/");
            }
          });
        } else if (response.status === 422) {
          notify("error", "Invalid", "Invalid");
        } else if (response.status === 401) {
          notify("error", "Invalid details", response.message);
        } else if (response.status === 500) {
          notify("error", "System Error", response.message);
        } else {
          notify("error", "Error", response.message);
        }
      } catch (error) {
        notify(
          "error",
          "Error",
          "An unexpected error occurred. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    setVerifyEmail();
  }, []);

  return <>{loading && <Loader />}</>;
}

export default VerifyEmail;
