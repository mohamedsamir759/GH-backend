import { show } from "react-notification-system-redux";

const notificationTitles = {
  success: "Success!",
  error: "Error!"
};
const notification = ({ type = "success", message = "" }) => ({
  title: notificationTitles[type],
  message,
  position: "tr",
  autoDismiss: 5
});

// const showNotification = ({ message = "", type = "success" }) => (
//   dispatch
// ) => {
//   dispatch(show(notification({
//     message,
//     type
//   })));
// };

export const showErrorNotification = (message = "") => {
  //parameter message should be type string only 
  const type = "error";
  return show(notification({
    message,
    type
  }), type);
};

export const showSuccessNotification = (message = "") => {
  //parameter message should be type string only 
  const type = "success";
  return show(notification({
    message,
    type
  }), type);
};

export const NO_ACCESS_MESSAGE = "No permissions to access this resource";
