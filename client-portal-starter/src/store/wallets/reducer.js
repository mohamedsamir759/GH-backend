import {
  FETCH_WALLETS_FAILED, FETCH_WALLETS_START, FETCH_WALLETS_SUCCESS 
} from "./actionTypes";

const initialState = {
  loading: false,
  wallets: [],
};

const Wallets = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WALLETS_START:
      state = {
        ...state,
        loading: true 
      };
      break;
    case FETCH_WALLETS_FAILED:
      state = {
        ...state,
        loading: false,
        error: action.payload 
      };
      break;
        
    case FETCH_WALLETS_SUCCESS:

      state = {
        ...state,
        loading: false,
        error: "",
        wallets: action.payload 
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default Wallets;
