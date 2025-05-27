import qs from "qs";
import * as axiosHelper from "./api_helper";

export const fetchHighKlines = async ({ payload }) => {
  const data = await axiosHelper.get(`/kline/all?${qs.stringify(payload)}`);
  if (data.isError) {
    return data;
  } 
  return data.result;
};