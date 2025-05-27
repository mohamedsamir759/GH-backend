import {
  takeEvery, fork, put, all, call 
} from "redux-saga/effects";
import { FETCH_WALLETS_START } from "./actionTypes";
import { fetchWalletsAPI } from "../../apis/wallets";
import { fetchWalletsFailed, fetchWalletsSuccess } from "./actions";

function* fetchWallets(params) {
  try {
    const result = yield call(fetchWalletsAPI, params);
    yield put(fetchWalletsSuccess(result));
  } catch (error) {
    yield put(fetchWalletsFailed(error));
  }
}

function* WatchWallets() {
  yield takeEvery(FETCH_WALLETS_START, fetchWallets);
}

function* WalletsSaga() {
  yield all([fork(WatchWallets)]);
}

export default WalletsSaga;