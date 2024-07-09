import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./../App.css";
import LogoImage from "./../assets/images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey } from "@fortawesome/free-solid-svg-icons";

function LandingPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container">
      <div className="form">
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
                type="text"
                placeholder="Enter your email/username"
                className="form__input"
                required
              />
            </div>
            <div className="form__input-box">
              <FontAwesomeIcon icon={faKey} className="form__input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="form__input"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="toggle-password-visibility"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            <div className="form__checkbox-link-box">
              <div className="form__checkbox-box">
                <input
                  type="checkbox"
                  className="form__input--checkbox"
                  id="remember"
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
            <div>
              <div></div>
              <div></div>
            </div>
            <button className="form__button">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
