import {
  PROFILE_ERROR, 
  PROFILE_SUCCESS, 
  EDIT_PROFILE, 
  EDIT_PROFILE_SUCCESS, 
  RESET_PROFILE_FLAG, 
  FETCH_PROFILE_START, 
  SUBMIT_IND_PROFILE_START, 
  SUBMIT_IND_PROFILE_END, 

  CONVERT_PROFILE_REQUESTED,
  CONVERT_PROFILE_SUCCESS,
  CONVERT_PROFILE_FAIL
} from "./actionTypes";

const initialState = {
  error: "",
  success: "",
  clientData: {},
  loading: false,
  editLoading: false,
  editSuccess:"",
};

const profile = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROFILE_START:
      state = {
        ...state,
        loading: true 
      };
      break;
    case EDIT_PROFILE:
      state = {
        ...state,
        editLoading: true 
      };
      break;
    case EDIT_PROFILE_SUCCESS:
      state = {
        ...state,
        editLoading: false,
        editSuccess: action.payload 
      };
      break;
    case PROFILE_SUCCESS:
      state = {
        ...state,
        loading: false,
        clientData: action.payload 
      };
      break;
    case PROFILE_ERROR:
      state = {
        ...state,
        loading: false,
        editLoading: false,
        error: action.payload 
      };
      break;
    case RESET_PROFILE_FLAG:
      state = {
        ...state,
        success: null 
      };
      break;
    case SUBMIT_IND_PROFILE_START:
      state = {
        ...state,
        submittingProfile: true,
      };
      break;
    case SUBMIT_IND_PROFILE_END:
      state = {
        ...state,
        submittingProfile: false,
        submitProfileError: action.payload.error,
        clientData: {
          ...state.clientData,
          stages: {
            ...state.clientData.stages,
            ...action.payload.stages
          }
        }
      };
      break;

    // convert profile
    case CONVERT_PROFILE_REQUESTED:
      state = {
        ...state,
        profileConvertLoading: true
      };
      break;
    case CONVERT_PROFILE_SUCCESS:
      state = {
        ...state,
        profileConvertSuccess: true,
        profileConvertFail: false,
        profileConvertLoading: false,
        profileConvertResult: action.payload
      };
      break;
    case CONVERT_PROFILE_FAIL:
      state = {
        ...state,
        profileConvertFail: true,
        profileConvertSuccess: false,
        profileConvertLoading: false,
        profileConvertFailMessage: action.payload.error
      };
      break;

    default:
      state = { ...state };
      break;
  }
  return state;
};

export default profile;
