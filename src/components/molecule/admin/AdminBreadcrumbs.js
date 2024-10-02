import React from "react";
//Custom component
import Typography from "./../../atom/typography/Typography";
//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

function AdminBreadcrumbs({ firstname }) {
  return (
    <div className="image-container">
      <div>
        <Typography variant="h3" className="credential-text">
          Dashboard
        </Typography>
        <Typography variant="span" className="credential-text">
          Welcome back, {firstname}
        </Typography>
      </div>
      <div>
        <FontAwesomeIcon icon={faHome} className="nav__menu-icon" />
        <Typography variant="span" className="credential-text">
          /dashboard
        </Typography>
      </div>
    </div>
  );
}

AdminBreadcrumbs.propTypes = {
  firstname: PropTypes.string.isRequired,
};

export default AdminBreadcrumbs;
