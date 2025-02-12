import React from "react";
import Swal from "sweetalert2";

const AlertComponent = ({
  alertType = "info",
  title = "Alert",
  text = "This is an alert",
  buttonText = "Show Alert",
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  confirmCallback = () => {},
  showInput = false,
  inputPlaceholder = "Enter your input here...",
  minLength = 2,
  maxLength = 254,
  validationMessages = {
    emptyInput: "Input cannot be empty!",
    minLengthError: "Input is too short!",
    maxLengthError: "Input is too long!",
  },
}) => {
  const showAlert = () => {
    Swal.fire({
      title,
      text,
      icon: alertType,
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      input: showInput ? "text" : null,
      inputPlaceholder: showInput ? inputPlaceholder : null,
      inputValidator: (value) => {
        if (showInput) {
          if (!value) {
            return validationMessages.emptyInput;
          }
          if (value.length < minLength) {
            return validationMessages.minLengthError;
          }
          if (value.length > maxLength) {
            return validationMessages.maxLengthError;
          }
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const inputValue = result.value;
        if (typeof confirmCallback === "function") {
          confirmCallback(inputValue);
        }
      }
    });
  };

  return (
    <button onClick={showAlert} className="w-full h-full alert-button">
      {buttonText}
    </button>
  );
};

export default AlertComponent;
