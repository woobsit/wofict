import React from "react";
import PropTypes from "prop-types";
import styles from "./Divider.module.css"; // Import your CSS module

const Divider = ({ color, thickness, margin, orientation, text }) => {
  const dividerStyle = {
    borderColor: color,
    borderWidth: thickness,
    margin,
  };

  return (
    <div className={`${styles.divider} ${styles[orientation]}`}>
      <hr style={dividerStyle} />
      {text && <span className={styles.dividerText}>{text}</span>}
    </div>
  );
};

Divider.propTypes = {
  color: PropTypes.string,
  thickness: PropTypes.string,
  margin: PropTypes.string,
  orientation: PropTypes.oneOf(["horizontal", "vertical"]),
  text: PropTypes.string,
};

Divider.defaultProps = {
  color: "#000",
  thickness: "1px",
  margin: "10px 0",
  orientation: "horizontal",
  text: null,
};

export default Divider;
