import React, { useState, useEffect } from "react";
//React route dom
import { Link, useNavigate } from "react-router-dom";
import "./../App.css";
import LogoImage from "./../assets/images/logo.png";

//Custom component
import Button from "./../components/atom/button/Button";
import Typography from "./../components/atom/typography/Typography";

//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

//Validator package
import validator from "validator";

//Spinner loader
import Loader from "./../components/atom/loader";

//API service
import authService from "./../api/authService";

//js-cookies
import Cookies from "js-cookie";

//sweet alert2
import Swal from "sweetalert2";

function ForgetPassword() {
  const navigate = useNavigate();

  const [inputFields, setInputFields] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const makeRequest = async () => {
    try {
      setLoading(true);
      const response = await authService.userLogin(inputFields.email);

      if (response.status === 200) {
        const expirationTime = response.remember_me ? 30 : 1;
        Cookies.set("auth_user_token", response.token, {
          expires: expirationTime,
          secure: true,
          sameSite: "lax",
        });
        setLoading(false);
        navigate("/home");
      } else if (response.status === 422) {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: response.message,
          text: "Please enter only valid characters.",
        });
      } else if (response.status === 401) {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: response.message,
          text: "Invalid login details",
        });
      } else if (response.status === 500) {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "System Error",
          text: "System error occurred",
        });
      } else {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An unexpected error occurred",
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
              Forget Password Form
            </Typography>

            <Typography variant="p" className="landing-form__header-two">
              Enter your email address
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

              <Button className="landing-form__button" disabled={loading}>
                Submit
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default ForgetPassword;
