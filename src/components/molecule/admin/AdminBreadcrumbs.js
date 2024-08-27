import React from "react";
//Custom component
import Typography from "./../../atom/typography/Typography";
//Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//utils
import { faHome } from "@fortawesome/free-solid-svg-icons";
// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

function AdminBreadcrumbs({ firstname }) {
  return (
    <div className="image-container">
      <div>
        <Typography variant="h3">Dashboard</Typography>
        <Typography variant="span">Welcome back, {firstname} </Typography>
      </div>
      <div>
        <FontAwesomeIcon icon={faHome} className="nav__menu-icon" /> /
        <Typography variant="span"> dashboard</Typography>
      </div>
    </div>
  );
}

AdminBreadcrumbs.propTypes = {
  firstname: PropTypes.string.isRequired,
};

export default AdminBreadcrumbs;
