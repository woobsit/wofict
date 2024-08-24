import React from "react";
//Atom component
import Typography from "./../../../atom/typography/Typography";
// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

function SidenavCollapse({ name, icon, active, ...rest }) {
  return (
    <li {...rest}>
      <span>{icon}</span>
      <Typography variant="span" className={active ? "active" : ""}>
        {name}
      </Typography>
    </li>
  );
}

SidenavCollapse.defaultProps = {
  active: false,
};

SidenavCollapse.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
};

export default SidenavCollapse;
