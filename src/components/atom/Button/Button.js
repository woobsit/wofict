import React from "react";
import styles from "./Button.module.css";
import PropTypes from "prop-types";

const Button = ({ children, className, ...props }) => {
  return (
    <button className={`${styles.button} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Typechecking props for the Button
Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Button;
