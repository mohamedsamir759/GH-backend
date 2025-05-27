import qs from "qs";
import * as axiosHelper from "./api_helper";

export const fetchWalletsAPI = async ({ payload }) => {
  const result = await axiosHelper.get(`/wallets/?${qs.stringify(payload)}`);
  if (result.status)
    return result.result;
  else
    throw new Error(result.message);
};