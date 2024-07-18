import Home from "./view/Home";

import React from "react";

//React Router package
import { Routes, Route, useLocation } from "react-router-dom";
import { setupInterceptors } from "./api/interceptors";

//pages
import LandingPage from "./view/LandingPage";
import Register from "./view/Register";
import AdminLogin from "./view/AdminLogin";

//css style
import "./App.css";

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
            path="/admin-login"
            element={<AdminLogin />}
            key="admin-login"
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
