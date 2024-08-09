import React from "react";
//React Router package
import { Routes, Route, useLocation } from "react-router-dom";
import { setupInterceptors } from "./api/interceptors";
//views
import Home from "./view/Home";
import LandingPage from "./view/LandingPage";
import Register from "./view/Register";
import ForgetPassword from "./view/ForgetPassword";
import EnterNewPassword from "./view/EnterNewPassword";
import AdminLogin from "./view/admin/AdminLogin";
import Dashboard from "./view/admin/Dashboard";
import AdminForgetPassword from "./view/admin/AdminForgetPassword";
import AdminEnterNewPassword from "./view/admin/AdminEnterNewPassword";
//React Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
//scss style
import "./App.scss";

//import store from './store';

function App() {
  setupInterceptors();

  const location = useLocation();

  const getBackgroundClass = (pathname) => {
    switch (pathname) {
      case "/":
        return "landing-page-background";
      default:
        return "home-background";
    }
  };

  const backgroundClass = getBackgroundClass(location.pathname);

  return (
    <div className={`${backgroundClass}`}>
      <Routes>
        <Route>
          <Route path="/" element={<LandingPage />} key="landing-page" />
          <Route path="/register" element={<Register />} key="register" />
          <Route path="/home" element={<Home />} key="home" />
          <Route
            path="/forget-password"
            element={<ForgetPassword />}
            key="forget-password"
          />
        </Route>
        <Route
          path="/enter-new-password/:id"
          element={<EnterNewPassword />}
          key="enter-new-password"
        />
        <Route path="/admin-login" element={<AdminLogin />} key="admin-login" />
        <Route path="/dashboard" element={<Dashboard />} key="dashboard" />
        <Route
          path="/admin-forget-password"
          element={<AdminForgetPassword />}
          key="admin-forget-password"
        />
        <Route
          path="/admin-enter-new-password/:id"
          element={<AdminEnterNewPassword />}
          key="admin-enter-new-password"
        />
      </Routes>
    </div>
  );
}

export default App;
