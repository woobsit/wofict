import React from "react";
import PropTypes from "prop-types";
import styles from "./Box.module.css";

const Box = ({ children, className, ...props }) => {
  return (
    <div className={`${styles.box} ${className}`} {...props}>
      {children}
    </div>
  );
};

Box.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Box.defaultProps = {
  className: "",
};

export default Box;
