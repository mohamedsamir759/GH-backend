import {
  takeEvery, fork, put, all, call 
} from "redux-saga/effects";
import {
  fetchProfileAPI, 
  editProfileAPI, 
  submitProfileAPI,
  convertProfileAPI
} from "../../../apis/profile";
// Login Redux States
import {
  EDIT_PROFILE, 
  FETCH_PROFILE_START, 
  SUBMIT_IND_PROFILE_START,

  CONVERT_PROFILE_REQUESTED
} from "./actionTypes";
import {
  profileSuccess, 
  profileError, 
  editProfileSuccess, 
  submitIndProfileDone,

  convertProfileSuccess,
  convertProfileFail
} from "./actions";
import { showErrorNotification, showSuccessNotification } from "../../notifications/actions";


function* editProfile({ payload: { user } }) {
  try {
    const result = yield call(editProfileAPI, user);
    yield put(editProfileSuccess(result));
  } catch (error) {
    yield put(profileError(error.message));
  }
}

function* fetchProfile() {
  try {
    const data = yield call(fetchProfileAPI);
    yield put(profileSuccess(data));
  }
  catch (error) {
    yield put(profileError(error.message));
  }
}

function* submmitIndProfile({ payload }) {
  try {
    
    const data = yield call(submitProfileAPI, payload);
    yield put(submitIndProfileDone({ stages: data }));
  }
  catch (error) {
    yield put(submitIndProfileDone({
      error: error.message
    }));
  }
}

function * convertProfile(){
  try {
    const data = yield call(convertProfileAPI);
    yield put(convertProfileSuccess(data));
    yield put(showSuccessNotification("Profile converted successfully, Please log in again"));
  } catch (error) {
    yield put(convertProfileFail({ error: error.message }));
    yield put(showErrorNotification(error.message));
  }
}

export function* watchProfile() {
  yield takeEvery(EDIT_PROFILE, editProfile);
  yield takeEvery(FETCH_PROFILE_START, fetchProfile);
  yield takeEvery(SUBMIT_IND_PROFILE_START, submmitIndProfile);
  yield takeEvery(CONVERT_PROFILE_REQUESTED, convertProfile);
}

function* ProfileSaga() {
  yield all([fork(watchProfile)]);
}

export default ProfileSaga;
