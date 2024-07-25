import React, { useState, useEffect } from "react";
//React route dom
import { Link, useNavigate } from "react-router-dom";
//app.css style
import "./../App.css";

//images
import LogoImage from "./../assets/images/logo.png";

//Custom component
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

function Register() {
  const navigate = useNavigate();

  const [inputFields, setInputFields] = useState({
    firstname: "",
    surname: "",
    other_names: "",
    email: "",
    password: "",
    gender: "",
    date_of_birth: "",
    phone_number: "",
    contact_address: "",
    state_of_origin: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  //Show and hide password
  const [showPassword, setShowPassword] = useState(false);
  //   const [firstPage, setFirstPage] = useState(true);
  //   const [secondPage, setSecondPage] = useState(false);
  //   const [thirdPage, setThirdPage] = useState(false);

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
        //Here I used the remember me value in the checkbox as the condition of the lenght of the token. With this I do not have to create a remember me cookie which would be different from the token cookie.
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
        notify("error", "Input Validation", response.message);
      } else if (response.status === 401) {
        setLoading(false);
        notify("error", "User Login", response.message);
      } else if (response.status === 500) {
        setLoading(false);
        notify("error", "System Error", response.message);
      } else {
        setLoading(false);
        notify("error", "Error", "An unexpected error occurred");
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
              Student Register
            </Typography>

            <Typography variant="p" className="landing-form__header-two">
              Enter your info to register
            </Typography>

            <div className="steps">
              <div className="steps__content-container">
                <div className="steps__content-number">1</div>
                <Typography variant="span" className="steps__content-text">
                  Personal info
                </Typography>
                <span></span>
              </div>
              <div className="steps__content-container">
                <div className="steps__content-number">2</div>
                <Typography variant="span" className="steps__content-text">
                  Educational background
                </Typography>
              </div>
              <div className="steps__content-container">
                <div className="steps__content-number">3</div>
                <Typography variant="span" className="steps__content-text">
                  Course of choice
                </Typography>
              </div>
            </div>

            <div className="landing-form__inputs-box">
              <div className="landing-form__input-box-container">
                <div className="landing-form__input-box">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="landing-form__input-icon"
                  />
                  <input
                    type="text"
                    placeholder="Enter your firstname"
                    className="landing-form__input"
                    // required
                    value={inputFields.firstname}
                    onChange={handleChange}
                    name="firstname"
                  />
                </div>

                <Typography className="landing-form__span" variant="span">
                  {errors.firstname}
                </Typography>
              </div>
              <div className="landing-form__input-box-container">
                <div className="landing-form__input-box">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="landing-form__input-icon"
                  />
                  <input
                    type="text"
                    placeholder="Enter your surname"
                    className="landing-form__input"
                    // required
                    value={inputFields.surname}
                    onChange={handleChange}
                    name="surname"
                  />
                </div>

                <Typography className="landing-form__span" variant="span">
                  {errors.surname}
                </Typography>
              </div>
              <div className="landing-form__input-box-container">
                <div className="landing-form__input-box">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="landing-form__input-icon"
                  />
                  <input
                    type="text"
                    placeholder="Enter your email"
                    className="landing-form__input"
                    // required
                    value={inputFields.other_names}
                    onChange={handleChange}
                    name="other_names"
                  />
                </div>

                <Typography className="landing-form__span" variant="span">
                  {errors.other_names}
                </Typography>
              </div>
              <div>
                <input type="radio" name="gender" />
                <input type="radio" name="gender" />
              </div>
              <div>
                <input type="date" name="date_of_birth" />
              </div>
              <div className="landing-form__input-box-container">
                <div className="landing-form__input-box">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="landing-form__input-icon"
                  />
                  <input
                    type="text"
                    placeholder="Enter your email"
                    className="landing-form__input"
                    // required
                    value={inputFields.phone_number}
                    onChange={handleChange}
                    name="phone_number"
                  />
                </div>

                <Typography className="landing-form__span" variant="span">
                  {errors.phone_number}
                </Typography>
              </div>
              <textarea
                name="contact_address"
                placeholder="Enter your contact address"
              ></textarea>
              <select>
                <option>Lagos</option>
                <option>Abia</option>
                <option>Osun</option>
                <option>Kaduna</option>
              </select>
              <div className="landing-form__input-box-container">
                <div className="landing-form__input-box">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="landing-form__input-icon"
                  />
                  <input
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
                Next
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Register;
