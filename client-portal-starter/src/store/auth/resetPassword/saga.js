import {
  takeEvery, call, put, all, fork,
} from "redux-saga/effects";
import { resetpassword } from "apis/resetPassword";
import { showErrorNotification, showSuccessNotification } from "store/notifications/actions";
import { RESET_PASSWORD_START } from "./actionsType";
import { resetPasswordError, resetPasswordSuccess } from "./actions";

function * resetClientPassword ({ payload }){
  try {
    const data = yield call(resetpassword, payload);
    const { status, message  } = data;
    if (status){
      yield put(resetPasswordSuccess());
      yield call(showSuccessNotification("Password Changed Successfully"));
    } else {
      yield put(resetPasswordError({
        message,
      }));
      // yield call(showErrorNotification(message));
    }
  } catch (error){
    yield call(showErrorNotification("Error happened while reseting password"));
  }
}
function * WatchResetPassword(){
  yield takeEvery(RESET_PASSWORD_START, resetClientPassword);
}

function* resetPasswordSaga() {
  yield all([fork(WatchResetPassword)]);
}


export default resetPasswordSaga;