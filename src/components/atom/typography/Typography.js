import React from "react";
import PropTypes from "prop-types";
import styles from "./Typography.module.css";

const Typography = ({ variant, children, className, ...props }) => {
  const Tag = variant;
  return (
    <Tag
      className={`${styles.typography} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
};

Typography.propTypes = {
  variant: PropTypes.oneOf(["h1", "h2", "h3", "h4", "h5", "h6", "p", "span"])
    .isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Typography.defaultProps = {
  className: "",
};

export default Typography;
