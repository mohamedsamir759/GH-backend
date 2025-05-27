import React from "react";
import { Redirect } from "react-router-dom";

//Dashboard
import Dashboard from "../pages/Dashboard/index";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import Wallet from "../pages/Wallet";
import QuickBuy from "../pages/QuickBuy";
import Documents from "../pages/Documents";
import Referral from "../pages/Referral";
import History from "../pages/History";
import ProfileSetting from "../pages/Setting/ProfileSetting";
import TwoFA from "../pages/Authentication/2FA";
import Test from "../pages/test";
import BankAccounts from "pages/BankAccounts/BankAccounts";
import ResetPassword from "pages/Authentication/ResetPassword";
import RegisterDemo from "../pages/Authentication/RegisterDemo";
import RegisterLive from "pages/Authentication/RegisterLive";
import Activities from "pages/Activities";
// import Exchange from "../pages/Exchange";
import Page404 from "../pages/Authentication/Page404";


const userRoutes = [
  //dashboard
  {
    path: "/dashboard",
    component: Dashboard 
  },
  //profile
  {
    path: "/documents",
    component: Documents 
  },
  {
    path: "/wallet",
    component: Wallet 
  },
  {
    path: "/quick-buy",
    component: QuickBuy 
  },
  {
    path: "/referral",
    component: Referral 
  },
  {
    path: "/history",
    component: History 
  },
  {
    path: "/profile",
    component: ProfileSetting 
  },
  {
    path: "/two-fa",
    component: TwoFA 
  },
  {
    path: "/bank-account",
    component: BankAccounts 
  },
  {
    path: "/test",
    component: Test 
  },
  {
    path: "/activities",
    component: Activities 
  },
  // { path: "/exchange", component: Exchange },
  // this route should be at the end of all other routes
  {
    path: "/",
    exact: true,
    component: () => <Redirect to="/dashboard" /> 
  },
];

const authRoutes = [
  //authencation page
  {
    path: "/logout",
    component: Logout 
  },
  {
    path: "/login",
    component: Login 
  },
  {
    path: "/forgot-password",
    component: ForgetPwd 
  },
  {
    path: "/register/live",
    component: RegisterLive 
  },
  {
    path: "/register/demo",
    component: RegisterDemo 
  },
  {
    path:"/reset-password",
    component:ResetPassword
  },
  {
    path: "*",
    exact: true,
    component: Page404,
  },
];

export { userRoutes, authRoutes };
