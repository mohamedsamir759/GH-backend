import * as axiosHelper from "./api_helper";

export const getWallets = async () => {
  const data = await axiosHelper.get("/wallets");
  if (data.isError) {
    throw new Error(data.isError);
  }
  return data?.result;
};
export const addWithdraw = async (values) => {
  // const { id, values } = payload;
  const data = await axiosHelper.post("transactions/withdraw", values);
  // if (data.isError) {
  //   throw new Error(data.message);
  // }
  return data;
};
export const addWithdrawCrypto = async (values) => {
  // const { id, values } = payload;
  const data = await axiosHelper.post("transactions/withdraw/crypto", values);
  // if (data.isError) {
  //   throw new Error(data.message);
  // }
  return data;
};
// export const fetchwallets = async () => {
//     const data = await axiosHelper.get('wallets');
//     return data.result;
// }
