import {
  call, put, takeEvery, takeLatest 
} from "redux-saga/effects";

// Login Redux States
import {
  LOGIN_USER, LOGOUT_USER, SOCIAL_LOGIN 
} from "./actionTypes";
import {
  apiError, loginSuccess, logoutUserSuccess 
} from "./actions";
import { loginUserAPI } from "../../../apis/auth";
//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import { postSocialLogin, } from "../../../helpers/fakebackend_helper";
import {
  HIDE_JOU_KYC, HIDE_JOU_IND_PROFILE, HIDE_JOU_FUND, HIDE_JOU_TRADING
} from "common/data/jourenykeys";
import { toggleCurrentModal } from "store/actions";
const fireBaseBackend = getFirebaseBackend();

function* loginUser({ payload: { user, history } }) {
  try {
    const data = yield call(loginUserAPI, user);
    const { message, result, status } = data;
    if (status){
      if (!result.token){
        yield put(toggleCurrentModal("TwoFactorAuth", {
          email: user.email,
          type: "login",
        }));
        yield put(loginSuccess(result));
      }
      if (result.token) {
        localStorage.setItem("authUser", JSON.stringify(result));
        yield put(loginSuccess(result));
        history.push("/dashboard");
      }
    } else {
      yield put(apiError("Invalid Credentials"));
    }
  }
  catch (error) {
    yield put(apiError(error));
  }
}


function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser");
    localStorage.removeItem(HIDE_JOU_KYC);
    localStorage.removeItem(HIDE_JOU_IND_PROFILE);
    localStorage.removeItem(HIDE_JOU_FUND);
    localStorage.removeItem(HIDE_JOU_TRADING);
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.logout);
      yield put(logoutUserSuccess(response));
    }
    history.push("/login");
  } catch (error) {
    yield put(apiError(error));
  }
}


function* socialLogin({ payload: { data, history, type } }) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend();
      const response = yield call(
        fireBaseBackend.socialLoginUser,
        data,
        type,
      );
      localStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginSuccess(response));
    } else {
      const response = yield call(postSocialLogin, data);
      localStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginSuccess(response));
    }
    history.push("/dashboard");
  } catch (error) {
    yield put(apiError(error));
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeLatest(SOCIAL_LOGIN, socialLogin);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
