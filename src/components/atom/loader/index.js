import React from "react";
import "./loader.css";

export default function Loader() {
  return (
    <div>
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
      </div>
    </div>
  );
}
