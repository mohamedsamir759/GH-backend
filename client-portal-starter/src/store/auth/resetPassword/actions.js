import { 
  RESET_PASSWORD_START, 
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
} from "./actionsType";

export const resetPasswordStart = (payload)=>{
  return {
    type:RESET_PASSWORD_START,
    payload,
  };
};
export const resetPasswordSuccess = ()=>{
  return {
    type:RESET_PASSWORD_SUCCESS
  };
};

export const resetPasswordError = (payload) => {
  return {
    type: RESET_PASSWORD_ERROR,
    payload,
  };
};