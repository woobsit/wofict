import React from "react";
import styles from "./Radio.module.css";
import PropTypes from "prop-types";

function Radio({ className, label, id, name, ...props }) {
  return (
    <div className={`${styles.radioContainer} ${className}`}>
      <input
        type="radio"
        className={styles.button}
        id={id}
        name={name}
        {...props}
      />
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

// Typechecking props for the Radio
Radio.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default Radio;
