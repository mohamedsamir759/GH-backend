import { 
  LOG_TYPES,
} from "common/constants";

export const getLogMessage = (data = {}, t = (m) => m) => {
  const {
    type,
    content = {},
    details = {}
  } = data;
  const { ip, error } = details;
  let message = "";
  if (error) {
    message = error;
    return message;
  }
  const { 
    amount,
    currency,
    status,
    symbol,
    mPrice,
    fromAsset,
    toAsset,
  } = content;
  switch (type) {
    case LOG_TYPES.REGISTER:
      message = `${t("You have registered from IP")}: ${ip}`;  
      break;
    case LOG_TYPES.LOGIN: 
      message = `${t("You have logged in from IP")}: ${ip}`;
      break;
    case LOG_TYPES.UPDATE_PROFILE:
      message = `${t("You have updated your profile")}`;
      break;
    case LOG_TYPES.RESET_PASSWORD:
      message = `${t("You have changed your password from IP")}: ${ip}`;
      break;
    case LOG_TYPES.DEPOSIT:
      message = `${t("You have made a deposit of")} ${amount.$numberDecimal || amount} ${currency} ${t("and it is")} ${status}`;
      break;
    case LOG_TYPES.WITHDRAW:
      message = `${t("You have made a withdrawal of")} ${amount.$numberDecimal || amount} ${currency} ${t("and it is")} ${status}`;
      break;
    case LOG_TYPES.ORDER:
      message = `${t("You have placed an order of")} ${amount} ${symbol} ${t("for price")} ${mPrice} ${t("and it is")} ${status}`;
      break;
    case LOG_TYPES.CONVERT:
      message = `${t("You have converted")} ${amount} ${fromAsset} ${t("to")} ${toAsset}`;
      break;
  }
  return message;
};

export const getHeaderStatusMessage = (data, t = (m) => m) => {
  const {
    type,
    customerId,
    content = {},
    details = {}
  } = data;
  const { ip, error, to, } = details;
  const { firstName, lastName } = customerId;
  let message = "";
  let header = "";
  let status = "";
  if (error) {
    message = error;
    return message;
  }
  const name = `${firstName} ${lastName}`;
  const { 
    amount,
    currency,
    status: contentStatus,
    symbol,
    mPrice,
    fromAsset,
    toAsset,
    asset,
    gateway,
    type: orderType,
    side,
  } = content;
  switch (type) {
    case LOG_TYPES.REGISTER:
      header = `${t("From IP")}: ${ip}`;
      status = t("Complete");
      message = `${t("You have registered on our portal")}`;  
      break;
    case LOG_TYPES.LOGIN: 
      header = `${t("Login from IP")}: ${ip}`;
      status = t("Complete");
      message = `${t("You have logged into portal")}`;
      break;
    case LOG_TYPES.UPDATE_PROFILE:
      message = `${name} ${t("has updated their profile")}`;
      break;
    case LOG_TYPES.CONVERT_CUSTOMER:
      header = `${t("Login from IP")}: ${ip}`;
      status = t("Complete");
      message = `${t("You have logged into portal")}`;
      message = `${name} ${t("has been converted to")} ${t(to)}`;
      break;
    case LOG_TYPES.RESET_PASSWORD:
      header = `${t("Password has been changed from")}: ${ip}`;
      status = t("Complete");
      message = `${name} ${t("has changed password from IP")} ${ip}`;
      break;
    case LOG_TYPES.DEPOSIT:
    case LOG_TYPES.WITHDRAW:
      header = t(gateway);
      status = t(contentStatus || "PENDING");
      message = `${amount.$numberDecimal || amount} ${currency}`;
      break;
    case LOG_TYPES.ORDER:
      header = t(`${orderType} ${side}`);
      status = t(contentStatus || "Completed");
      message = `${amount.$numberDecimal || amount} ${symbol}`;
      break;
    case LOG_TYPES.CONVERT:
      header = t(`From ${fromAsset} to ${toAsset}`);
      status = t(contentStatus || "Completed");
      message = `${amount.$numberDecimal || amount} ${fromAsset}`;
      break;
  }
  return {
    message,
    status,
    header,
  };
};