import PropTypes from "prop-types";
import React, { Suspense } from "react";

import { Switch, BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";

// import { SocketContext, socket } from "./socket";
import SocketProvider from "./context";
// Import Routes all
import { userRoutes, authRoutes } from "./routes/allRoutes"; // action


// Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware";

// layouts Format
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";

// Import scss
import "./assets/scss/preloader.scss";
import "./assets/scss/theme.scss";

const lang = localStorage.getItem("I18N_LANGUAGE");
if (lang === "ar") {
  import ("./assets/scss/theme-rtl.scss");
}

// Import Firebase Configuration file
// import { initFirebaseBackend } from "./helpers/firebase_helper"

// import fakeBackend from "./helpers/AuthType/fakeBackend";

// Activating fake backend
// fakeBackend()

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_APIKEY,
//   authDomain: process.env.REACT_APP_AUTHDOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASEURL,
//   projectId: process.env.REACT_APP_PROJECTID,
//   storageBucket: process.env.REACT_APP_STORAGEBUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
//   appId: process.env.REACT_APP_APPID,
//   measurementId: process.env.REACT_APP_MEASUREMENTID,
// }

// init firebase backend
// initFirebaseBackend(firebaseConfig)

const App = props => {

  function getLayout() {
    let layoutCls = VerticalLayout;
    switch (props.layout.layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout;
        break;
      default:
        layoutCls = VerticalLayout;
        break;
    }
    return layoutCls;
  }

  const Layout = getLayout();
  return (
    <SocketProvider>
      <React.Fragment>
        <Suspense fallback={<>loading</>}>
          <Router>
            <Switch>
              {userRoutes.map((route, idx) => (
                <Authmiddleware
                  path={route.path}
                  layout={Layout}
                  component={route.component}
                  key={idx}
                  isAuthProtected={true}
                  exact
                />
              ))}
              {authRoutes.map((route, idx) => (
                <Authmiddleware
                  path={route.path}
                  layout={NonAuthLayout}
                  component={route.component}
                  key={idx}
                  isAuthProtected={false}
                  exact
                />
              ))}
            </Switch>
          </Router>
        </Suspense>
      </React.Fragment>
    </SocketProvider>
  );
};

App.propTypes = {
  layout: PropTypes.any
};

const mapStateToProps = state => {
  return {
    layout: state.Layout,
  };
};

export default connect(mapStateToProps, null)(App);