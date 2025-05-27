import {
  takeEvery, fork, put, all, call 
} from "redux-saga/effects";
import { REGISTER_DEMO_USER, REGISTER_LIVE_USER } from "./actionTypes";
import {
  registerLiveUserSuccessful, registerDemoUserSuccessful, registerLiveUserFailed, registerDemoUserFailed 
} from "./actions";
import { registerLiveAPI, registerDemoAPI } from "../../../apis/register";
import { setUser } from "../../../apis/api_helper";

function* registerLive({ payload }) {
  try {
    const { history } = payload.user;
    const result = yield call(registerLiveAPI, payload);
    if (result.message === "Data created  succesfull") {
      setUser(result.result);
      yield put(registerLiveUserSuccessful("User created successfully"));
      history.push("/dashboard");
    }
    if (result.isSuccess === false) {
      yield put(registerLiveUserFailed(result.message));
    }
  } catch (error) {
    yield put(registerLiveUserFailed(error));
  }
}

function* registerDemo({ payload }) {
  try {
    const { history } = payload.user;
    const result = yield call(registerDemoAPI, payload);
    if (result.message === "Data created  succesfull") {
      setUser(result.result);
      yield put(registerDemoUserSuccessful("User created successfully"));
      history.push("/dashboard");
    }
    if (result.isSuccess === false) {
      yield put(registerDemoUserFailed(result.message));
    }
  } catch (error) {
    yield put(registerDemoUserFailed(error));
  }
}
export function* watchUserRegister() {
  yield takeEvery(REGISTER_LIVE_USER, registerLive);
  yield takeEvery(REGISTER_DEMO_USER, registerDemo);
}

function* accountSaga() {
  yield all([fork(watchUserRegister)]);
}

export default accountSaga;
