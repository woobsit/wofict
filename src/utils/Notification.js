//type: error, success, info, warning, question
// src/components/Notification.js
import Swal from "sweetalert2";

const notify = (type, message, description) => {
  if (Array.isArray(description)) {
    description = description.join("\n");
  }

  const swalConfig = {
    icon: type,
    title: message,
    text: description,
  };

  Swal.fire(swalConfig);
};

export { notify };
