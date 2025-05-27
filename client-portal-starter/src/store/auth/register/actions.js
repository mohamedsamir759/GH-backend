import {
  REGISTER_LIVE_USER,
  REGISTER_LIVE_USER_SUCCESSFUL,
  REGISTER_LIVE_USER_FAILED,
  REGISTER_DEMO_USER,
  REGISTER_DEMO_USER_SUCCESSFUL,
  REGISTER_DEMO_USER_FAILED,
} from "./actionTypes";

export const registerLiveUser = user => {
  return {
    type: REGISTER_LIVE_USER,
    payload: { user },
  };
};

export const registerLiveUserSuccessful = user => {
  return {
    type: REGISTER_LIVE_USER_SUCCESSFUL,
    payload: user,
  };
};

export const registerLiveUserFailed = user => {
  return {
    type: REGISTER_LIVE_USER_FAILED,
    payload: user,
  };
};

export const registerDemoUser = user => {
  return {
    type: REGISTER_DEMO_USER,
    payload: { user },
  };
};

export const registerDemoUserSuccessful = user => {
  return {
    type: REGISTER_DEMO_USER_SUCCESSFUL,
    payload: user,
  };
};

export const registerDemoUserFailed = user => {
  return {
    type: REGISTER_DEMO_USER_FAILED,
    payload: user,
  };
};