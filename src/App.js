import "./App.css";
import LandingPage from "./view/LandingPage";
import Register from "./view/Register";
import Home from "./view/Home";

import React from "react";
//React Router package
import { Routes, Route, useLocation } from "react-router-dom";
import { setupInterceptors } from "./api/interceptors";

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
        </Route>
      </Routes>
    </div>
  );
}

export default App;
