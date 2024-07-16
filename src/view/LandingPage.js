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
import { faUser, faKey, faEye } from "@fortawesome/free-solid-svg-icons";

//Validator package
import validator from "validator";

//Utility Spinner
import Loader from "./../components/atom/loader";

//API service
import authService from "./../api/authService";

//js-cookies
import Cookies from "js-cookie";

//react toastify
import { ToastContainer, toast } from "react-toastify";

function LandingPage() {
  const navigate = useNavigate();

  const [inputFields, setInputFields] = useState({
    email: "",
    password: "",
    remember_token: null,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  //Show and hide password
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  //Set value of inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setInputFields({ ...inputFields, [name]: newValue });
  };

  //Validate inputs
  const validate = (inputValues) => {
    let errors = {};
    if (!validator.isEmail(inputValues.email)) {
      errors.email = "Enter a valid email address";
    }
    if (inputValues.password.length < 6) {
      errors.password = "Password should not be less than 6 characters";
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
      const response = await authService.userLogin(
        inputFields.email,
        inputFields.password
      );

      if (response.status === 200) {
        const expirationTime = response.data.remember_me ? 30 : 1;
        Cookies.set("auth_user_token", response.token, {
          expires: expirationTime,
          secure: true,
          sameSite: "lax",
        });
        console.log(Cookies.get);
        setLoading(false);
        navigate("/home");

        //window.location.href = "/home";
      } else if (response.status === 422) {
        setLoading(false);
        toast.error("Login failed. Enter valid details and try again.");
      } else if (response.status === 401) {
        setLoading(false);
        toast.error(
          "Login failed. Please check your credentials and try again."
        );
      }
    } catch (error) {
      setLoading(false);
      setErrors("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <>
      {loading && <Loader />}
      <ToastContainer />
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
              Student Login
            </Typography>

            <Typography variant="p" className="landing-form__header-two">
              Enter your details to login
            </Typography>

            <div className="landing-form__inputs-box">
              <div className="landing-form__input-box-container">
                <div className="landing-form__input-box">
                  <FontAwesomeIcon
                    icon={faUser}
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
                    placeholder="Enter your password"
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
                </div>

                <Typography className="landing-form__span" variant="span">
                  {errors.password}
                </Typography>
              </div>
              <div className="landing-form__checkbox-link-box">
                <div className="landing-form__checkbox-box">
                  <input
                    type="checkbox"
                    className="landing-form__input--checkbox"
                    id="remember"
                    value={inputFields.remember_token}
                    onChange={handleChange}
                    name="remember_token"
                  />
                  <label
                    htmlFor="remember"
                    className="landing-form__checkbox-label"
                  >
                    Remember me?
                  </label>
                </div>
                <div>
                  <Link to="/forget-password" className="landing-form__link">
                    Forget password?
                  </Link>
                </div>
              </div>

              <Button className="landing-form__button" disabled={loading}>
                Login
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default LandingPage;
