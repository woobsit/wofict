import React from "react";
// import { Link } from "react-router-dom";
import "./../App.css";
import LogoImage from "./../assets/images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey } from "@fortawesome/free-solid-svg-icons";

function Home() {
  return (
    <div className="container">
      <div className="form">
        <div className="form__logo-container">
          <img src={LogoImage} alt="logo" className="form__logo-image" />
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
                type="password"
                placeholder="Enter your password"
                className="form__input"
                required
              />
            </div>
            <div className="form__checkbox-link-box">
              <div id="form__checkbox-box">
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
                <a href="/" className="form__link">
                  Forget password?
                </a>
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

export default Home;
