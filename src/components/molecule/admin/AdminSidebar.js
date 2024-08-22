import React, { useState, useEffect } from "react";
//React route dom
import { useLocation, Link } from "react-router-dom";
//API service
import authService from "./../../../api/authService";
//utils
import { notify } from "./../../../utils/Notification";
//prop types
import PropTypes from "prop-types";
//Atom component
import Typography from "./../../atom/typography/Typography";

function AdminSidebar({ routes }) {
  const [fetchWebsiteInfo, setFetchWebsiteInfo] = useState({});
  const [fetchWebsiteDataStatus, setFetchWebsiteDataStatus] = useState(false);
  const location = useLocation();
  const collapseName = location.pathname.replace("/admin/dashboard", "");

  useEffect(() => {
    async function displayWebsiteInfo() {
      try {
        const response = await authService.websiteInfo();
        if (response.status === 201) {
          setFetchWebsiteInfo(response.result);
          setFetchWebsiteDataStatus(true);
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

  // Render all the routes from the AmdinSidebar.js
  const renderRoutes = routes.map(
    ({ type, name, icon, title, key, href, route }) => {
      let returnValue;

      if (type === "collapse") {
        returnValue = href ? (
          <Link
            href={href}
            key={key}
            target="_blank"
            rel="noreferrer"
            className="sidebar__link"
          >
            {icon}
            <Typography
              variant="span"
              className={key === collapseName ? "active" : ""}
            >
              {name}
            </Typography>
          </Link>
        ) : (
          <Link key={key} to={route}>
            {icon}
            <Typography
              variant="span"
              className={key === collapseName ? "active" : ""}
            >
              {name}
            </Typography>
          </Link>
        );
      } else if (type === "title") {
        returnValue = <Typography variant="p">{title}</Typography>;
      } else if (type === "divider") {
        returnValue = (
          // <Divider
          //   key={key}
          //   light={
          //     (!darkMode && !whiteSidenav && !transparentSidenav) ||
          //     (darkMode && !transparentSidenav && whiteSidenav)
          //   }
          // />
          <hr />
        );
      }

      return returnValue;
    }
  );

  return (
    <sidebar className="sidebar">
      <div className="sidebar__logo-image-container">
        <img
          className="sidebar__logo-image"
          src={
            fetchWebsiteDataStatus &&
            fetchWebsiteInfo[2].value + fetchWebsiteInfo[3].value
          }
          alt={fetchWebsiteDataStatus && fetchWebsiteInfo[0].value}
          title={fetchWebsiteDataStatus && fetchWebsiteInfo[0].value}
        />
      </div>

      <div className="sidebar__list-container">
        <ul className="sidebar__unordered-list">{renderRoutes}</ul>
      </div>
    </sidebar>
  );
}

// Typechecking props for the Sidenav
AdminSidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default AdminSidebar;
