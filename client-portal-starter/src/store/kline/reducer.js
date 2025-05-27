
import {
  KLINE_HIGH_FETCH,
  KLINE_HIGH_FETCH_SUCCESSFUL,
  KLINE_HIGH_FETCH_FAILED,
} from "./actionTypes";

const initialState = {
  loading: false,
  error: "",
  highKlines: [{
    name: "",
    data: [] 
  }],
  marketNames: [],
};

const klineReducer = (state = initialState, action) => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case KLINE_HIGH_FETCH:
      state = {
        ...state,
        loading: true,
      };
      break;
    case KLINE_HIGH_FETCH_SUCCESSFUL: 
      state = {
        ...state,
        loading: false,
        highKlines: action.payload,
      };
      break;
    case KLINE_HIGH_FETCH_FAILED: 
      state = {
        ...state,
        loading: false,
        error: action.payload.error
      };
      break;
    default:
      state = { ...state };
  }
  return state;
};

export default klineReducer;
