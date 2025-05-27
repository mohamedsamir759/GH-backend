import {
  RESET_PASSWORD_START,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
} from "./actionsType";
const initialState = {
  error:"",
  loading:"",
  success: false,
};
const resetPasswordReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET_PASSWORD_START:
      return state = {
        ...state,
        showSuccessMessage:false,
        loading:true
      };
    case RESET_PASSWORD_SUCCESS:
      return  state = {
        ...state,
        showSuccessMessage:true,
        loading:false,
        // success: true,
      };
    case RESET_PASSWORD_ERROR:
      return  state = {
        ...state,
        error: true,
        showErrorMessage: true,
        loading: false,
        success: false,
        message: action?.payload?.message || "Error resetting the password",
      };

      
    default:
      return { ...state };
  }
};
export default resetPasswordReducer;