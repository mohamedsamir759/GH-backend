import {
  KLINE_HIGH_FETCH,
  KLINE_HIGH_FETCH_SUCCESSFUL,
  KLINE_HIGH_FETCH_FAILED,
} from "./actionTypes";

export const fetchHighKlines = (timespan = "24h") => {
  return {
    type: KLINE_HIGH_FETCH,
    payload: { timespan },
  };
};

export const fetchHighKlinesSuccessful = hKlines => {
  return {
    type: KLINE_HIGH_FETCH_SUCCESSFUL,
    payload: hKlines,
  };
};

export const fetchHighKlinesFailed = prices => {
  return {
    type: KLINE_HIGH_FETCH_FAILED,
    payload: prices,
  };
};
