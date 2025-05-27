import {
  PROFILE_ERROR, 
  PROFILE_SUCCESS, 
  EDIT_PROFILE, 
  RESET_PROFILE_FLAG, 
  FETCH_PROFILE_START, 
  EDIT_PROFILE_SUCCESS, 
  SUBMIT_IND_PROFILE_START, 
  SUBMIT_IND_PROFILE_END,

  CONVERT_PROFILE_REQUESTED,
  CONVERT_PROFILE_SUCCESS,
  CONVERT_PROFILE_FAIL
} from "./actionTypes";

export const editProfile = user => {
  return {
    type: EDIT_PROFILE,
    payload: { user },
  };
};
export const editProfileSuccess = payload => {
  return {
    type: EDIT_PROFILE_SUCCESS,
    payload:  payload 
  };
};
export const profileSuccess = msg => {
  return {
    type: PROFILE_SUCCESS,
    payload: msg,
  };
};

export const profileError = error => {
  return {
    type: PROFILE_ERROR,
    payload: error,
  };
};

export const resetProfileFlag = () => {
  return {
    type: RESET_PROFILE_FLAG,
  };
};

export const fetchProfile = () => {
  return {
    type: FETCH_PROFILE_START
  };
};


export const submitIndProfile = (payload) => {
  return {
    type: SUBMIT_IND_PROFILE_START,
    payload
  };
};

export const submitIndProfileDone = (payload) => {
  return {
    type: SUBMIT_IND_PROFILE_END,
    payload
  };
};

// convert profile
export const convertProfile = () => {
  return {
    type: CONVERT_PROFILE_REQUESTED
  };
};
export const convertProfileSuccess = (data) => { 
  return {
    type: CONVERT_PROFILE_SUCCESS,
    payload: data
  };
};
export const convertProfileFail = (error) => {
  return {
    type: CONVERT_PROFILE_FAIL,
    payload: { error }
  };
};
