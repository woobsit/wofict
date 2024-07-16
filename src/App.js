import "./App.css";
import LandingPage from "./view/LandingPage";
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
        </Route>
      </Routes>
    </div>
  );
}

export default App;
