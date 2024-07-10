import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./../App.css";
import LogoImage from "./../assets/images/logo.png";
//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey, faEye } from "@fortawesome/free-solid-svg-icons";
//Validor
import validator from "validator";

function LandingPage() {
  const [inputFields, setInputFields] = useState({
    email: "",
    password: "",
    remember_token: null,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (Object.keys(errors).length === 0 && submitting) {
      //finishSubmit();
      console.log("submitted");
    }
  }, [errors]);

  //Show and hide password
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <div className="form__logo-container">
          <Link to="/">
            <img src={LogoImage} alt="logo" className="form__logo-image" />
          </Link>
        </div>
        <div className="form__box">
          <h2 className="form__header-one">Student Login</h2>
          <h6 className="form__header-two">Enter your details to login</h6>

          <div className="form__inputs-box">
            <div className="form__input-box">
              <FontAwesomeIcon icon={faUser} className="form__input-icon" />
              <input
                type="email"
                placeholder="Enter your email/username"
                className="form__input"
                required
                value={inputFields.email}
                onChange={handleChange}
                name="email"
              />
            </div>
            <p className="text-tertiary" id="error-message">
              <span>{errors.email}</span>
            </p>
            <div className="form__input-box">
              <FontAwesomeIcon icon={faKey} className="form__input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="form__input"
                required
                value={password}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon={faEye}
                className="form__input-icon--eye"
                onClick={togglePasswordVisibility}
              />
            </div>
            <p className="text-tertiary" id="error-message">
              <span>{errors.password}</span>
            </p>
            <div className="form__checkbox-link-box">
              <div className="form__checkbox-box">
                <input
                  type="checkbox"
                  className="form__input--checkbox"
                  id="remember"
                  value={inputFields.remember_token}
                  onChange={handleChange}
                  name="remember_token"
                />
                <label htmlFor="remember" className="form__checkbox-label">
                  Remember me?
                </label>
              </div>
              <div>
                <Link to="/forget-password" className="form__link">
                  Forget password?
                </Link>
              </div>
            </div>

            <button className="form__button" disabled={loading}>
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LandingPage;
