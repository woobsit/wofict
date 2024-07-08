import React from "react";
import "./../App.css";
import LogoImage from "./../assets/images/logo.png"

function Login() {
  return (
    <>
<nav className="nav">
    <img src={LogoImage} alt="logo" className="nav__logo" />
</nav>

    <div className="form">
      <div className="form__box">
        <h1 className="form__header-one">Student Login</h1>
        <h5 className="form__header-two">Please sign in login</h5>

        <div className="form__inputs-box">
          <input type="text" placeholder="email" />
          <input type="password" placeholder="password" />
          <button className="form__button">Login</button>
        </div>
      </div>
    </div>
    </>
  );
}

export default Login;
