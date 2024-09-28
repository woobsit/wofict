import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import authService from "../../../../api/authService";
import { notify } from "../../../../utils/Notification";
import PropTypes from "prop-types";
import Typography from "../../../atom/typography/Typography";
import SidenavCollapse from "./SidenavCollapse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";

function AdminSidebar({ routes }) {
  const [fetchWebsiteInfo, setFetchWebsiteInfo] = useState({});
  const [fetchWebsiteDataStatus, setFetchWebsiteDataStatus] = useState(false);
  const [openCollapse, setOpenCollapse] = useState(null); // Track the currently opened collapse
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");

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

  const toggleCollapse = (name) => {
    setOpenCollapse(openCollapse === name ? null : name); // Toggle open or close
  };

  const renderRoutes = routes.map(
    ({ type, name, icon, title, noCollapse, key, route, children }) => {
      let returnValue;

      if (type === "collapse") {
        const isOpen = openCollapse === name; // Check if this collapse is open
        returnValue = children ? (
          <div key={key}>
            <Link
              className={`sidebar__parent-menu sidebar__link ${key === collapseName ? "sidebar__link-active" : ""}`}
              onClick={() => toggleCollapse(name)}
            >
              <SidenavCollapse name={name} icon={icon} />
              <FontAwesomeIcon
                icon={isOpen ? faCaretDown : faCaretRight}
                className="sidebar__icon-caret"
              />
            </Link>
            {isOpen && (
              <div>
                {children.map((child, index) => (
                  <Link to={child.route} key={index} className="sidebar__link">
                    <SidenavCollapse
                      name={child.name}
                      // active={child.key === collapseName}
                      noCollapse={child.noCollapse}
                      className="sidebar__child-menu"
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Link
            key={key}
            to={route}
            className={`sidebar__link ${key === collapseName ? "sidebar__link-active" : ""}`}
          >
            <SidenavCollapse
              name={name}
              icon={icon}
              // active={key === collapseName}
              noCollapse={noCollapse}
            />
          </Link>
        );
      } else if (type === "title") {
        returnValue = <Typography variant="p">{title}</Typography>;
      } else if (type === "divider") {
        returnValue = <hr />;
      }

      return returnValue;
    }
  );

  return (
    <sidebar className="sidebar">
      <div className="sidebar__list-container">
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
        <ul className="sidebar__unordered-list">{renderRoutes}</ul>
      </div>
    </sidebar>
  );
}

AdminSidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default AdminSidebar;
