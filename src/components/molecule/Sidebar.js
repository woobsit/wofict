import React, { useState, useEffect } from "react";
//API service
import authService from "./../../api/authService";
//utils
import { notify } from "./../../utils/Notification";

function Sidebar() {
  const [fetchStatus, setFetchStatus] = useState(false);
  const [fetchWebsiteInfo, setFetchWebsiteInfo] = useState({});

  useEffect(() => {
    async function displayWebsiteInfo() {
      try {
        const response = await authService.websiteInfo();
        if (response.status === 201) {
          setFetchStatus(true);
          setFetchWebsiteInfo(response.result);
        } else if (response.status === 500) {
          notify("error", "System Error", response.message);
        }
      } catch (error) {
        notify(
          "error",
          "Error",
          "An unexpected error occurred. Please try again."
        );
      }
    }
    displayWebsiteInfo();
  }, []);

  return (
    <sidebar className="sidebar">
      <img
        className="sidebar__logo-image"
        src={
          fetchStatus && fetchWebsiteInfo[2].value + fetchWebsiteInfo[3].value
        }
        alt={fetchStatus && fetchWebsiteInfo[0].value}
        title={fetchStatus && fetchWebsiteInfo[0].value}
      />
      <div>links</div>
    </sidebar>
  );
}

export default Sidebar;
