//type: error, success, info, warning, question
// src/components/Notification.js
import Swal from "sweetalert2";

const notify = (type, message, description) => {
  if (Array.isArray(description)) {
    // Join the array with a new line character for the 'text' property
    description = description.join("\n");
  }

  const swalConfig = {
    icon: type,
    title: message,
    html: description.split("\n").join("<br>"), // Convert newlines to HTML line breaks
  };

  Swal.fire(swalConfig);
};

export { notify };
