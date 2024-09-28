import React from "react";
//Atom component
import Typography from "./../../../atom/typography/Typography";
// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

function SidenavCollapse({ name, icon, ...rest }) {
  return (
    <li {...rest}>
      <span className="sidebar__list-span-icon">{icon}</span>
      <Typography variant="span" className="sidebar__list-span-text">
        {name}
      </Typography>
    </li>
  );
}

SidenavCollapse.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
};

export default SidenavCollapse;
