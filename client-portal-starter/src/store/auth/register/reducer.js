import {
  REGISTER_LIVE_USER,
  REGISTER_LIVE_USER_SUCCESSFUL,
  REGISTER_LIVE_USER_FAILED,
  REGISTER_DEMO_USER,
  REGISTER_DEMO_USER_SUCCESSFUL,
  REGISTER_DEMO_USER_FAILED,
} from "./actionTypes";

const initialState = {
  registrationError: null,
  message: null,
  loading: false,
  user: null,
};

const account = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_LIVE_USER:
      state = {
        ...state,
        loading: true,
        registrationError: null,
      };
      break;
    case REGISTER_LIVE_USER_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        user: action.payload,
        registrationError: null,
      };
      break;
    case REGISTER_LIVE_USER_FAILED:
      state = {
        ...state,
        user: null,
        loading: false,
        registrationError: action.payload,
      };
      break;
    case REGISTER_DEMO_USER:
      state = {
        ...state,
        loading: true,
        registrationError: null,
      };
      break;
    case REGISTER_DEMO_USER_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        user: action.payload,
        registrationError: null,
      };
      break;
    case REGISTER_DEMO_USER_FAILED:
      state = {
        ...state,
        user: null,
        loading: false,
        registrationError: action.payload,
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default account;
