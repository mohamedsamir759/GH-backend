import {
  FETCH_WALLETS_FAILED, FETCH_WALLETS_START, FETCH_WALLETS_SUCCESS 
} from "./actionTypes";

export const fetchWallets = (params = {}) => {
  return {
    type: FETCH_WALLETS_START,
    payload: params
  };
};
export const fetchWalletsFailed = (error) => {
  return {
    type: FETCH_WALLETS_FAILED,
    payload: error
  };
};
export const fetchWalletsSuccess = (params) => {
  return {
    type: FETCH_WALLETS_SUCCESS,
    payload: params
  };
};