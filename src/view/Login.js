import React from "react";
import "./../App.css";
import LogoImage from "./../assets/images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey } from "@fortawesome/free-solid-svg-icons";

function Login() {
  return (
    <div className="container">
      <div className="form">
        <div className="form__logo-container">
          <img src={LogoImage} alt="logo" className="form__logo-image" />
        </div>
        <div className="form__box">
          <h2 className="form__header-one">Student Login</h2>
          <h6 className="form__header-two">Please sign in to login</h6>

          <div className="form__inputs-box">
            <div className="form__input-icon">
              <FontAwesomeIcon icon={faUser} className=""/>
              <input
                type="text"
                placeholder="email"
                className="form__input form__input-text"
              />
            </div>
            <div className="form__input-icon">
              <FontAwesomeIcon icon={faKey} />
            <input
              type="password"
              placeholder="password"
              className="form__input form__input-password"
            />
            </div>
            <button className="form__button">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
