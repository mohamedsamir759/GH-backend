import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

// Authentication
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import Profile from "./auth/profile/reducer";

//Calendar
import calendar from "./calendar/reducer";

//chat
import chat from "./chat/reducer";

//invoices
import invoices from "./invoices/reducer";

//contacts
import contacts from "./contacts/reducer";
import markets from "./markets/reducer";
import historyReducer from "./history/reducer";
import wallets from "./wallets/reducer";
import orderBooks from "./orderBooks/reducer";
import orders from "./orders/reducer";
import depositReducer from "./deposit/reducer";
import klines from "./kline/reducer";
import withdrawReducer from "./withdraw/reducer";
import bankAccounts from "./bankAccount/reducer";
import assets  from "./assets/reducer";
import documents from "./documents/reducer";
import depositsReducer from "./transactions/deposit/reducer";
import withdrawalsReducer from "./transactions/withdrawal/reducer";
import dictionary from "./dictionary/reducer";
import convert from "./convert/reducer";
import logs from "./logs/reducer";
import resetPasswordReducer from "./auth/resetPassword/reducer";
import twoFactorAuthReducer from "./auth/twoFactorAuth/reducer";
import { reducer as notifications } from "react-notification-system-redux";
import checkUser from "./auth/checkEmail/reducer";


const rootReducer = combineReducers({
  // public
  Layout,
  Login,
  Account,
  ForgetPassword,
  Profile,
  calendar,
  chat,
  invoices,
  contacts,
  markets,
  documents,
  historyReducer,
  orderBooks,
  wallets,
  orders,
  klines,
  depositReducer,
  withdrawReducer,
  bankAccounts, 
  assets,
  notifications,
  depositsReducer,
  withdrawalsReducer,
  dictionary,
  convert,
  resetPasswordReducer,
  twoFactorAuthReducer,
  logs,
  checkUser
});

export default rootReducer;
