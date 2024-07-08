import React from "react";
import "./../App.css";
import LogoImage from "./../assets/images/logo.png";

function Login() {
  return (
    <div className="container">
      <div className="form">
        <div className="form__logo-container">
        <img src={LogoImage} alt="logo" className="form__logo-image" /></div>
        <div className="form__box">
          <h2 className="form__header-one">Student Login</h2>
          <h6 className="form__header-two">Please sign in to login</h6>

          <div className="form__inputs-box">
            <input type="text" placeholder="email" className="form__input form__input-text"/>
            <input type="password" placeholder="password" className="form__input form__input-password" />
            <button className="form__button">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
