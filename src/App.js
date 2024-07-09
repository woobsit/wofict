import "./App.css";
import LandingPage from "./view/LandingPage";
import React from "react";
//React Router package
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<LandingPage />} key="landing-page" />
      </Route>
    </Routes>
  );
}

export default App;
