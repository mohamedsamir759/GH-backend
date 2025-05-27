import {
  FETCH_FOREX_BOUNSES_REQUESTED,
  FETCH_FOREX_BOUNSES_SUCCESS,
  FETCH_FOREX_BOUNSES_FAIL,

  ADD_FOREX_BOUNSE_REQUESTED,
  ADD_FOREX_BOUNSE_SUCCESS,
  ADD_FOREX_BOUNSE_FAIL,
  ADD_FOREX_BOUNSE_CLEAR,
  ADD_FOREX_BOUNSE_ERROR_CLEAR,
  APPROVE_FOREX_BOUNSE,
  APPROVE_FOREX_BOUNSE_SUCCESS,
  REJECT_FOREX_BOUNSE_SUCCESS
} from "./actionTypes";

const initalState = {
  forexBounses:[],
  fetchLoading:false,
  addLoading:false,
  error:"",
  modalClear:false,
  forexBounseResponseMessage:"",
  addForexBounsClearingCounter: 0
};

const forexDepositReducer = (state = initalState, action) => {
  switch (action.type){
    // fetch forex BOUNSES
    case FETCH_FOREX_BOUNSES_REQUESTED:
      state = {
        ...state,
        fetchLoading: true
      };
      break;
    case FETCH_FOREX_BOUNSES_SUCCESS:
      state = {
        ...state,
        forexBounses: [...action.payload.result.docs],
        forexTotalDocs: action.payload.result.totalDocs,
        hasNextPage: action.payload.result.hasNextPage,
        hasPrevPage: action.payload.result.hasPrevPage,
        limit: action.payload.result.limit,
        nextPage: action.payload.result.nextPage,
        page: action.payload.result.page,
        pagingCounter: action.payload.result.pagingCounter,
        prevPage: action.payload.result.prevPage,
        totalPages: action.payload.result.totalPages,
        fetchLoading: false,  
      };
      break;
    case FETCH_FOREX_BOUNSES_FAIL:
      state = {
        ...state,
        fetchLoading: false,
        forexBounsError: action.payload
      };
      break;

    // add forex deposit
    case ADD_FOREX_BOUNSE_REQUESTED:
      state = {
        ...state,
        addLoading: true,
        addForexBounsesuccess: false,
        addForexBounseFail: false,
        addForexBounseFailDetails: ""
      };
      break;
    case ADD_FOREX_BOUNSE_SUCCESS:
      state = {
        ...state,
        newForexDeposit: action.payload.result,
        addForexBounsesuccess: true,
        addForexBounseFail: false
      };
      break;
    case ADD_FOREX_BOUNSE_FAIL:
      state = {
        ...state,
        addForexBounsesuccess: false,
        addForexBounseFail: true,
        addLoading: false,
        addForexBounseFailDetails: action.payload.error
      };
      break;
    case ADD_FOREX_BOUNSE_CLEAR:
      state = {
        ...state,
        addLoading: false,
        addForexBounsClearingCounter: state.addForexBounsClearingCounter + 1,
        addForexBounseFail: false,
        addForexBounsesuccess: false,
        modalClear: true,
        addForexBounseFailDetails: ""
      };
      break;
    case ADD_FOREX_BOUNSE_ERROR_CLEAR:
      state = {
        ...state,
        addForexBounseFail: false,
        addForexBounsesuccess: false,
        addForexBounseFailDetails: null
      };
      break;
    case APPROVE_FOREX_BOUNSE:
      return {
        ...state,
      };
    case APPROVE_FOREX_BOUNSE_SUCCESS:
      return {
        ...state,
        forexBounses:state.forexBounses.map(d => {
          if (d._id === action.payload){
            d.status = "APPROVED";
          }
          return d;
        }),
      };
    case REJECT_FOREX_BOUNSE_SUCCESS:
      return {
        ...state,
        forexBounses:state.forexBounses.map(d => {
          if (d._id === action.payload){
            d.status = "REJECTED";
          }
          return d;
        }),
      };
    default:
      state = { ...state };
  }
  return state;
};

export default forexDepositReducer;