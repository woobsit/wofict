// src/components/Notification.js
import Swal from "sweetalert2";

const notify = (type, message, description) => {
  switch (type) {
    case "error":
      Swal.fire({
        icon: "error",
        title: message,
        text: description,
      });
      break;
    case "success":
      Swal.fire({
        icon: "success",
        title: message,
        text: description,
      });
      break;
    case "info":
      Swal.fire({
        icon: "info",
        title: message,
        text: description,
      });
      break;
    case "warning":
      Swal.fire({
        icon: "warning",
        title: message,
        text: description,
      });
      break;
    default:
      Swal.fire({
        icon: "question",
        title: message,
        text: description,
      });
      break;
  }
};

export { notify };
