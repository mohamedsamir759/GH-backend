import {
  FETCH_FOREX_BOUNSES_REQUESTED,
  FETCH_FOREX_BOUNSES_SUCCESS,
  FETCH_FOREX_BOUNSES_FAIL,

  ADD_FOREX_BOUNSE_REQUESTED,
  ADD_FOREX_BOUNSE_SUCCESS,
  ADD_FOREX_BOUNSE_FAIL,
  ADD_FOREX_BOUNSES_CLEAR,
  ADD_FOREX_BOUNSES_ERROR_CLEAR,
  APPROVE_FOREX_BOUNSES,
  REJECT_FOREX_BOUNSES,
  ADD_FOREX_BOUNSE_ERROR_CLEAR,
  ADD_FOREX_BOUNSE_CLEAR
} from "./actionTypes";


// fetch forex BOUNSESs
export const fetchForexBounses = (params = {}) => {
  return {
    type: FETCH_FOREX_BOUNSES_REQUESTED,
    payload: params
  };
};
export const fetchForexBounsesSuccess = (data) => {
  return {
    type: FETCH_FOREX_BOUNSES_SUCCESS,
    payload: data
  };
};
export const fetchForexBounsesFail = (error) => {
  return {
    type: FETCH_FOREX_BOUNSES_FAIL,
    payload: { error }
  };
};

export const addForexBounse = (params = {}) => {
  return {
    type: ADD_FOREX_BOUNSE_REQUESTED,
    payload: params
  };
};
export const addForexBounseSuccess = (data) => {
  return {
    type: ADD_FOREX_BOUNSE_SUCCESS,
    payload: data
  };
};
export const addForexBounseFail = (error) => {
  return {
    type: ADD_FOREX_BOUNSE_FAIL,
    payload: { error }
  };
};

export const addForexBounseClear = (data) => {
  return {
    type: ADD_FOREX_BOUNSE_CLEAR,
    payload: data
  };
};
export const addForexBounseErrorClear = () => {
  return {
    type: ADD_FOREX_BOUNSE_ERROR_CLEAR
  };
};
// export const approveFxBOUNSES = (payload)=>{
//   return {
//     type: APPROVE_FOREX_BOUNSES,
//     payload
//   };
// };
// export const rejectFxBOUNSES = (payload) =>{
//   return {
//     type: REJECT_FOREX_BOUNSES,
//     payload
//   };
// };