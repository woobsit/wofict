import "./App.css";
import LandingPage from "./view/LandingPage";
import React from "react";
//React Router package
import { Routes, Route, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  const getBackgroundClass = (pathname) => {
    switch (pathname) {
      case "/dashboard":
        return "dashboard-background";
      case "/about":
        return "about-background";
      case "/contact":
        return "contact-background";
      default:
        return "home-background";
    }
  };

  const backgroundClass = getBackgroundClass(location.pathname);

  return (
    <div className={`app ${backgroundClass}`}>
      <Routes>
        <Route>
          <Route path="/" element={<LandingPage />} key="landing-page" />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
