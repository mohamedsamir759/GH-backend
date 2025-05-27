import {
  call, put, takeEvery
} from "redux-saga/effects";
// Login Redux States
import {
  KLINE_HIGH_FETCH,
} from "./actionTypes";
import {
  fetchHighKlinesSuccessful,
  fetchHighKlinesFailed,
} from "./actions";
// import { showErrorNotification, showSuccessNotification } from "store/notifications/actions";

//Include Both Helper File with needed methods
import * as klinesApi from "../../apis/klines";

function* fetchHighKlines(params) {
  try {
    const data = yield call(klinesApi.fetchHighKlines, params);
    yield put(fetchHighKlinesSuccessful(data));
  }
  catch (error) {
    yield put(fetchHighKlinesFailed(error));
  }
}

function* klinesSaga() {
  yield takeEvery(KLINE_HIGH_FETCH, fetchHighKlines);
}

export default klinesSaga;
