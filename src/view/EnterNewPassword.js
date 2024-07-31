import React, { useState, useEffect } from "react";
//React route dom
import { Link, useParams, useNavigate } from "react-router-dom";
import "./../App.css";
import LogoImage from "./../assets/images/logo.png";

//Custom component
import Button from "./../components/atom/button/Button";
import Typography from "./../components/atom/typography/Typography";

//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey, faEye } from "@fortawesome/free-solid-svg-icons";

//Validator package
import validator from "validator";

//Spinner loader
import Loader from "./../components/atom/loader";

//API service
import authService from "./../api/authService";

//utils
import { notify } from "./../utils/Notification";

//sweet alert2
import Swal from "sweetalert2";

function EnterNewPassword() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inputFields, setInputFields] = useState({
    email: "",
    password: "",
    password_confirmation: "",
    forget_password: id,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enterNewPasswordForm, setEnterNewPasswordForm] = useState(false);

  //Show and hide password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  //Set value of inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputFields({ ...inputFields, [name]: value });
  };

  //Validate inputs
  const validate = (inputValues) => {
    let errors = {};
    if (!validator.isEmail(inputValues.email)) {
      errors.email = "Enter a valid email address";
    }
    if (inputValues.password.length < 6) {
      errors.password = "Password should not be less than 6 characters";
    } else if (inputValues.password !== inputValues.password_confirmation) {
      errors.password_confirmation =
        "Password and confirm password did not match";
    }

    return errors;
  };

  //Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validate(inputFields)); //object of errors
    setSubmitting(true);
  };

  //When form values are valid
  useEffect(() => {
    if (Object.keys(errors).length === 0 && submitting) {
      makeRequest();
    }
  }, [errors]);

  const confirmForgetPasswordToken = async () => {
    try {
      setLoading(true);
      const response = await authService.userConfirmForgetPasswordToken(id);

      if (response.status === 200) {
        setEnterNewPasswordForm(true);
        setLoading(false);
      } else if (response.status === 422) {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Invalid link",
          text: response.message,
          showConfirmButton: true, // Show the "OK" button
          allowOutsideClick: false, // Prevent closing by clicking outside the dialog
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/");
          }
        });
      } else if (response.status === 401) {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Invalid",
          text: response.message,
          showConfirmButton: true, // Show the "OK" button
          allowOutsideClick: false, // Prevent closing by clicking outside the dialog
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/");
          }
        });
      } else if (response.status === 500) {
        setLoading(false);
        notify("error", "System Error", response.message);
      } else {
        setLoading(false);
        notify("error", "Error", response.message);
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

  useEffect(() => {
    confirmForgetPasswordToken();
  }, []);
  const makeRequest = async () => {
    try {
      setLoading(true);
      const response = await authService.userEnterNewPassword(
        inputFields.email,
        inputFields.password,
        inputFields.password_confirmation,
        id
      );
      if (response.status === 200) {
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Password Reset",
          text: response.message,
          showConfirmButton: true, // Show the "OK" button
          allowOutsideClick: false, // Prevent closing by clicking outside the dialog
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/");
          }
        });
      } else if (response.status === 422) {
        setLoading(false);
        notify(
          "error",
          "Please enter only valid characters.",
          response.message
        );
      } else if (response.status === 401) {
        setLoading(false);
        notify("error", "Invalid details", response.message);
      } else if (response.status === 500) {
        setLoading(false);
        notify("error", "System Error", response.message);
      } else {
        setLoading(false);
        notify("error", "Error", response.message);
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
      {enterNewPasswordForm && (
        <div className="landing-form__container">
          <form className="landing-form" onSubmit={handleSubmit}>
            <div className="landing-form__logo-container">
              <Link to="/">
                <img
                  src={LogoImage}
                  alt="logo"
                  className="landing-form__logo-image"
                />
              </Link>
            </div>
            <div className="landing-form__box">
              <Typography variant="h3" className="landing-form__header-one">
                Reset Password Form
              </Typography>

              <Typography variant="p" className="landing-form__header-two">
                Enter your email and your new password
              </Typography>

              <div className="landing-form__inputs-box">
                <div className="landing-form__input-box-container">
                  <div className="landing-form__input-box">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="landing-form__input-icon"
                    />
                    <input
                      // type="email"
                      type="text"
                      placeholder="Enter your email"
                      className="landing-form__input"
                      // required
                      value={inputFields.email}
                      onChange={handleChange}
                      name="email"
                    />
                  </div>

                  <Typography className="landing-form__span" variant="span">
                    {errors.email}
                  </Typography>
                </div>
                <div className="landing-form__input-box-container">
                  <div className="landing-form__input-box">
                    <FontAwesomeIcon
                      icon={faKey}
                      className="landing-form__input-icon"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="landing-form__input"
                      // required
                      value={inputFields.password}
                      onChange={handleChange}
                      name="password"
                    />
                    <FontAwesomeIcon
                      icon={faEye}
                      className="landing-form__input-icon--eye"
                      onClick={togglePasswordVisibility}
                    />
                    <FontAwesomeIcon
                      icon={faEye}
                      className="landing-form__input-icon--eye"
                      onClick={toggleConfirmPasswordVisibility}
                    />
                  </div>

                  <Typography className="landing-form__span" variant="span">
                    {errors.password}
                  </Typography>
                </div>
                <div className="landing-form__input-box-container">
                  <div className="landing-form__input-box">
                    <FontAwesomeIcon
                      icon={faKey}
                      className="landing-form__input-icon"
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="landing-form__input"
                      // required
                      value={inputFields.password_confirmation}
                      onChange={handleChange}
                      name="password_confirmation"
                    />
                  </div>

                  <Typography className="landing-form__span" variant="span">
                    {errors.password_confirmation}
                  </Typography>
                </div>
                <Button className="landing-form__button" disabled={loading}>
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default EnterNewPassword;
