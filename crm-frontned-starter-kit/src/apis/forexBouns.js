import * as axiosHelper from "./api_helper";
import qs from "qs";

// fetch forex withdrawals
export const getForexBounses = async ({ payload }) => {
  const result = await axiosHelper.get(`/fxtransactions/bounses?${qs.stringify(payload)}`);
  if (!result.status){
    throw new Error(result.message);
  }

  return result;
};

// add forex withdrawal
export const postForexWithdrawal = async ({ payload }) => {
  const result = await axiosHelper.post("/fxtransactions/withdrawals", payload);
  if (!result.status){
    throw new Error(result.message);
  }

  return result;
};

export const addBounsToCustomer = async ({ payload }) => {
  const result = await axiosHelper.post("/fxtransactions/add-bouns-to-customer", payload);
  if (!result.status){
    throw new Error(result.message);
  }

  return result;
};

export const rejectForexWithdrawal = async (id, customerId)=>{
  const result = await axiosHelper.patch(`/fxtransactions/withdraw/${id}/reject`, { customerId:customerId });
  if (!result.status){
    throw new Error(result.message);
  }

  return result;
};