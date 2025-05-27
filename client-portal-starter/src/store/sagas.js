import { all, fork } from "redux-saga/effects";

//public
import AccountSaga from "./auth/register/saga";
import AuthSaga from "./auth/login/saga";
import ForgetSaga from "./auth/forgetpwd/saga";
import ProfileSaga from "./auth/profile/saga";
import LayoutSaga from "./layout/saga";
import calendarSaga from "./calendar/saga";
import chatSaga from "./chat/saga";
import invoiceSaga from "./invoices/saga";
import contactsSaga from "./contacts/saga";
import marketsSaga from "./markets/saga";
import socketsSaga from "./sockets/saga";
import historySaga from "./history/saga";
import WalletsSaga from "./wallets/saga";
import orderBooksSaga from "./orderBooks/saga";
import ordersSaga from "./orders/saga";
import klineSaga from "./kline/saga";
import depositsSaga from "./deposit/saga";
import withdrawsSaga from "./withdraw/saga";
import bankAccountsSaga from "./bankAccount/saga";
import assetsSaga from "./assets/saga";
import documentsSaga from "./documents/saga";
import deposits from "./transactions/deposit/saga";
import withdrawals from "./transactions/withdrawal/saga";
import dictSaga from "./dictionary/saga";
import convertSaga from "./convert/saga";
import resetPasswordSaga from "./auth/resetPassword/saga";
import twoFactorAuthSaga from "./auth/twoFactorAuth/saga";
import logsSaga from "./logs/saga";
import checkEmailSaga from "./auth/checkEmail/saga";

export default function* rootSaga() {
  yield all([
    //public
    fork(AccountSaga),
    fork(AuthSaga),
    fork(ForgetSaga),
    fork(ProfileSaga),
    fork(LayoutSaga),
    fork(calendarSaga),
    fork(chatSaga),
    fork(invoiceSaga),
    fork(contactsSaga),
    fork(marketsSaga),
    fork(socketsSaga),
    fork(documentsSaga),
    fork(historySaga),
    fork(WalletsSaga),
    fork(orderBooksSaga),
    fork(ordersSaga),
    fork(klineSaga),
    fork(depositsSaga),
    fork(withdrawsSaga),
    fork(bankAccountsSaga),
    fork(deposits),
    fork(withdrawals),
    fork(assetsSaga),
    fork(dictSaga),
    fork(convertSaga),
    fork(resetPasswordSaga),
    fork(twoFactorAuthSaga),
    fork(logsSaga),
    fork(checkEmailSaga),
  ]);
}
