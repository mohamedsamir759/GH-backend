import {
  call,
  put,
  takeEvery,
  delay
} from "redux-saga/effects";
import { 
  FETCH_FOREX_BOUNSES_REQUESTED,
  ADD_FOREX_DEPOSIT_REQUESTED,
  APPROVE_FOREX_DEPOSIT,
  APPROVE_FOREX_DEPOSIT_SUCCESS,
  REJECT_FOREX_DEPOSIT,
  REJECT_FOREX_DEPOSIT_SUCCESS,
  ADD_FOREX_BOUNSE_REQUESTED
} from "./actionTypes";
import {
  fetchForexDepositsSuccess,
  fetchForexDepositsFail,

  addForexDepositSuccess,
  addForexDepositFail,
  addForexDepositClear,
  fetchForexBounsesSuccess,
  fetchForexBounsesFail,
  addForexBounseSuccess,
  addForexBounseFail,
  addForexBounseErrorClear,
  addForexBounseClear
} from "./actions";
import * as forexBounsApis from "apis/forexBouns";
import {
  approveFxDepositAPI
} from "apis/deposit";
import { showErrorNotification, showSuccessNotification } from "store/notifications/actions";

function * fetchForexBounses(params){
  try {
    const data = yield call(forexBounsApis.getForexBounses, params);
    yield put(fetchForexBounsesSuccess(data));
  } catch (err){
    yield put(fetchForexBounsesFail(err.message));
  }
}

function * addForexBouns(params){
  try {
    const data = yield call(forexBounsApis.addBounsToCustomer, params);
    yield put(addForexBounseSuccess(data));
    yield put(showSuccessNotification("Bounse Added Successfully"));
    yield put(addForexBounseClear());
  } catch (err){
    yield put(addForexBounseFail(err.message));
    yield delay(5000);
    yield put(addForexBounseErrorClear());
  }
}
// function * approveFxDeposit({ payload:{ id, customerId } }) {
//   try {
//     const res = yield call(approveFxDepositAPI, id, customerId);
//     if (res.status){
//       yield put({
//         type: APPROVE_FOREX_DEPOSIT_SUCCESS,
//         payload: id 
//       });
//     }
//     yield put(showSuccessNotification("Forex Deposit approved successfully"));
//   } catch (error) {
//     yield put(showErrorNotification(error.message));
//   }
// }

// function * rejectFxDeposit({ payload:{ id, customerId } }) {
//   try {
//     const res = yield call(forexDepositApis.rejectFxDeposit, id, customerId);
//     if (res.status){
//       yield put({
//         type: REJECT_FOREX_DEPOSIT_SUCCESS,
//         payload: id 
//       });
//     }
//     yield put(showSuccessNotification("Forex Deposit rejected successfully"));
//   } catch (error) {
//     yield put(showErrorNotification(error.message));
//   }
// }

function * forexBounsaga(){
  yield takeEvery(FETCH_FOREX_BOUNSES_REQUESTED, fetchForexBounses);
  yield takeEvery(ADD_FOREX_BOUNSE_REQUESTED, addForexBouns);
  // yield takeEvery(APPROVE_FOREX_DEPOSIT, approveFxDeposit);
  // yield takeEvery(REJECT_FOREX_DEPOSIT, rejectFxDeposit);
}
export default forexBounsaga;