import { socket } from "./index";

const getDealSync = (type, data, prevData) => {
  console.log("getDealSync", type, data, prevData);
  switch (type.toUpperCase()) {
    case "GET_START":
      return {
        ...prevData,
        deals: [],
        loading: true,
        isFetchingDone: false,
        showMessage: true,
        isError: false,
        message: "Getting Deals for " + data.totalAccounts + " Accounts",
      };
    case "GET_DEALS_ACCOUNT_UNPROCESSED":
      return {
        ...prevData,
        message: "Total Deals Found for Account: " + data.login + " is " + data.totalDeals + " and still processing",
      };
    case "GET_DEALS_ACCOUNT_PROCESSED":
      return {
        ...prevData,
        message: "Finished processing deals for Account: " + data.login + " which are " + data.deals?.length + " is completed",
        deals: [...prevData.deals, ...data.deals],
      };
    case "GET_DEALS_ACCOUNT_ERROR":
      return {
        ...prevData,
        isError: true,
        message: "Unable to Fetch deals for " + data.login,
      };
    case "GET_DEALS_END":
      return {
        ...prevData,
        loading: false,
        isFetchingDone: true,
        showMessage: true,
        message: "Fetched Deals Completed",
      };
    case "PUSH_START":
      return {
        ...prevData,
        loading: true,
        isSyncDone: false,
        showMessage: true,
        isError: false,
        message: "Pushing Deals : " + data.totalDeals,
      };
    case "PUSH_DEAL":
      return {
        ...prevData,
        message: "Pushing Deal for Deal Id: " + data.dealId + ". Remaining to Push: " + data.left,
      };
    case "PUSH_EXISTS":
      return {
        ...prevData,
        message: "Deal Already Exists for Deal Id: " + data.dealId + ". Remaining to Push: " + data.left,
      };
    case "PUSH_END":
      return {
        ...prevData,
        loading: false,
        isSyncDone: true,
        showMessage: true,
        message: "Pushed Deals Completed",
      };
    case "ERROR":
      return {
      };
    default:
      return prevData;
  }
};

export const socketEvents = ({ state, setState }) => {
  socket.on("syncDeals", (msg) => {
    setState(state => {
      const message = JSON.parse(msg);
      const dealSync = getDealSync(message.type, message.data, state.dealSync);
      return {
        ...state,
        dealSync,
      };
    });
  });
};