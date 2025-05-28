
import {
  FETCH_CUSTOMERS_COUNTRIES_START,
  FETCH_CUSTOMERS_COUNTRIES_END,
  FETCH_CUSTOMERS_STATS_START,
  FETCH_CUSTOMERS_STATS_END,
  FETCH_LEAD_STAGES_STATS_START,
  FETCH_LEAD_STAGES_STATS_SUCCESS,
  FETCH_LEAD_STAGES_STATS_FAILED,
  FETCH_OPERATION_STAGES_STATS_START,
  FETCH_OPERATION_STAGES_STATS_SUCCESS,
  FETCH_OPERATION_STAGES_STATS_FAILED
} from "./actionTypes";

const initialState = {
  loading: false,
  leadStatsLoading: false,
  leadStats: {},
  operationStatsLoading: false,
  operationStats: {},
};
const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CUSTOMERS_COUNTRIES_START:
      state = {
        ...state,
        loading: true,
      };
      break;
    case FETCH_CUSTOMERS_COUNTRIES_END:
      state = {
        ...state,
        loading: false,
        ...action.payload,
      };
      break;
    case FETCH_CUSTOMERS_STATS_START:
      state = {
        ...state,
        statsLoading: true,
      };
      break;
    case FETCH_CUSTOMERS_STATS_END:
      state = {
        ...state,
        statsLoading: false,
        ...action.payload,
      };
      break;
    case FETCH_LEAD_STAGES_STATS_START:
      state = {
        ...state,
        leadStatsLoading: true,
      };
      break;
    case FETCH_LEAD_STAGES_STATS_SUCCESS:
      if (action.payload.data["_id"] === null || action.payload.data["_id"] === undefined) {
        delete action.payload.data["_id"];
      }
      state = {
        ...state,
        leadStatsLoading: false,
        leadStats: action.payload.data || {},
        leadStatsTotal: action.payload.total || {},
      };
      break;
    case FETCH_LEAD_STAGES_STATS_FAILED:
      state = {
        ...state,
        leadStatsLoading: false,
        leadStats: {},
      };
      break;
    case FETCH_OPERATION_STAGES_STATS_START:
      state = {
        ...state,
        operationStatsLoading: true,
      };
      break;
    case FETCH_OPERATION_STAGES_STATS_SUCCESS:
      state = {
        ...state,
        operationStatsLoading: false,
        operationStats: action.payload || {},
        // operationStatsTotal: action.payload.total || {},
      };
      break;
    case FETCH_OPERATION_STAGES_STATS_FAILED:
      state = {
        ...state,
        operationStatsLoading: false,
        operationStats: {},
      };
      break;
    default:
      state = { ...state };

  }
  return state;
};
export default dashboardReducer;