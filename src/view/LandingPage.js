import React, { useState, useEffect } from "react";
//React route dom
import { Link, useNavigate } from "react-router-dom";

//images
import LogoImage from "./../assets/images/logo.png";

//Atom component
import Button from "./../components/atom/button/Button";
import Typography from "./../components/atom/typography/Typography";

//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey, faEye } from "@fortawesome/free-solid-svg-icons";

//Validator
import validator from "validator";

//Spinner loader
import Loader from "./../components/atom/loader";

//API service
import authService from "./../api/authService";

//js-cookies
import Cookies from "js-cookie";

//utils
import { notify } from "./../utils/Notification";

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
        inputFields.password,
        inputFields.remember_token
      );

      if (response.status === 200) {
        // Combine token, user info, and any other data
        const userInfo = {
          token: response.token,
          user_info: {
            firstname: response.user_info.firstname,
            surname: response.user_info.surname,
            other_names: response.user_info.other_names,
            email: response.user_info.email,
            photo: response.user_info.photo,
            // Add any other essential user info here
          },
          website_info: response.website_info, // If you need to store website info as well
        };
        // Stringify the combined data
        const cookieData = JSON.stringify(userInfo);
        //Here I used the remember me value in the checkbox as the condition of the lenght of the token.
        const expirationTime = response.remember_me ? 30 : 1;
        Cookies.set("auth_user_data", cookieData, {
          expires: expirationTime,
          secure: true,
          sameSite: "lax",
        });

        if (response.admission_status === "admitted") {
          navigate("/home");
        } else {
          navigate("/admission");
        }
      } else if (response.status === 422) {
        notify("error", "Input Validation", response.message);
      } else if (response.status === 401) {
        notify("error", "User Login", response.message);
      } else if (response.status === 500) {
        notify("error", "System Error", response.message);
      } else {
        notify("error", "Error", "An unexpected error occurred");
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
              Student Login
            </Typography>

            <Typography variant="p" className="landing-form__header-two">
              Enter your details to login
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
              <div className="landing-form__text-link-box">
                <Typography variant="span">Not registered?</Typography>{" "}
                <Typography
                  variant="span"
                  className="landing-form__typography-link"
                >
                  <Link to="/register">Register now</Link>
                </Typography>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default LandingPage;
