import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";
import React from "react";

import {
  Row, Col, Alert, Container, Spinner, Card
} from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";

import { withRouter, Link } from "react-router-dom";

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";

//Social Media Imports
// import TwitterLogin from "react-twitter-auth"

// actions
import { loginUser, toggleCurrentModal } from "../../store/actions";

// import images
import logo from "../../assets/images/logo-sm.svg";
import * as content from "content";

//Import config
import { withTranslation } from "react-i18next";
import TwoFactorAuth from "components/TwoFactorAuth";

const Login = props => {
  const dispatch = useDispatch();
  const {  currentModal, modalData } = useSelector((state) => ({
    currentModal: state.Layout.currentModal,
    modalData: state.Layout.modalData
  }));
  const { error, loading } = useSelector(state => ({
    loading: state.Login.loading,
    error: state.Login.error,
  }));

  // handleValidSubmit
  const handleValidSubmit = (event, values) => {
    dispatch(loginUser(values, props.history));
  };


  //handleGoogleLoginResponse

  //handleTwitterLoginResponse
  // const twitterResponse = e => {}

  //handleFacebookLoginResponse

  return (
    <React.Fragment>
      <MetaTags>
        <title>{props.t("Login")}</title>
      </MetaTags>
      <div className="auth-page">
        <Container fluid className="p-0">
          <Row className="g-0">
            <Col lg={4} md={5} className="mx-auto card-shadow" style={{ margin: "5rem auto" }}>
              <Card className="d-flex p-sm-5 p-4" style={{ marginBottom: "0px" }}>
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    <div className="mb-4 mb-md-1 text-center">
                      <Link to="/dashboard" className="d-block auth-logo">
                        <img src={content.mainLogo} alt="" height="28" /> <span className="logo-txt">{content.clientName}</span>
                      </Link>
                    </div>
                    <div className="auth-content my-auto">
                      <div className="text-center">
                        <h5 className="mb-0">{props.t("Sign in to continue")}  </h5>
                      </div>
                      <AvForm
                        className="custom-form mt-4 pt-2"
                        onValidSubmit={(e, v) => {
                          handleValidSubmit(e, v);
                        }}
                      >
                        <div className="mb-3">
                          <AvField
                            name="email"
                            label={props.t("Email")}
                            className="form-control"
                            placeholder={props.t("Enter email")}
                            type="email"
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <div className="d-flex align-items-start">
                            <div className="flex-grow-1">
                              <label className="form-label">{props.t("Password")}</label>
                            </div>
                            <div className="flex-shrink-0">
                              <div className="">
                                <Link to="/forgot-password" className="text-muted">{props.t("Forgot password?")}</Link>
                              </div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <AvField
                              name="password"
                              type="password"
                              className="form-control"
                              required
                              placeholder={props.t("Enter Password")}
                            />
                          </div>
                        </div>
                        <div className="row mb-4">
                          <div className="col">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" id="remember-check" />
                              <label className="form-check-label" htmlFor="remember-check">
                                {props.t("Remember me")}
                              </label>
                            </div>
                          </div>

                        </div>
                        <div className="mb-3">
                          {loading ? <div className="text-center"><Spinner className="ms-2" color="primary" /></div> : <button className="btn btn-primary w-100 waves-effect waves-light" type="submit">Log In</button>}
                        </div>
                        {error && error ? (
                          <Alert color="danger"> {props.t(error)}</Alert>
                        ) : null}
                      </AvForm>
                      {/* <div className="mt-4 text-center">
                        <h5 className="font-size-14 mb-3">Sign in with</h5>

                        <ul className="list-inline">
                          <li className="list-inline-item">
                            <FacebookLogin
                              appId={facebook.APP_ID}
                              autoLoad={false}
                              callback={facebookResponse}
                              render={renderProps => (
                                <Link
                                  to="#"
                                  className="social-list-item bg-primary text-white border-primary"
                                  onClick={renderProps.onClick}
                                >
                                  <i className="mdi mdi-facebook" />
                                </Link>
                              )}
                            />
                          </li>

                          <li className="list-inline-item">
                            <GoogleLogin
                              clientId={google.CLIENT_ID}
                              render={renderProps => (
                                <Link
                                  to="#"
                                  className="social-list-item bg-danger text-white border-danger"
                                  onClick={renderProps.onClick}
                                >
                                  <i className="mdi mdi-google" />
                                </Link>
                              )}
                              onSuccess={googleResponse}
                              onFailure={() => { }}
                            />
                          </li>
                        </ul>
                      </div> */}

                      <div className="mt-5 text-center">
                        <p className="text-muted mb-0">{props.t("Don't have an account ?")} <Link to="/register/live"
                          className="text-primary fw-semibold"> {props.t("Signup now")} </Link> </p>
                      </div>
                    </div>
                    {/* <div className="mt-4 mt-md-5 text-center">
                      <p className="mb-0">© {new Date().getFullYear()} Minia . Crafted with <i className="mdi mdi-heart text-danger"></i> by Themesbrand</p>
                    </div> */}
                  </div>
                </div>
              </Card>
            </Col>
            
          </Row>
        </Container>
        {modalData && currentModal === "TwoFactorAuth" &&
          <TwoFactorAuth
            isOpen={currentModal === "TwoFactorAuth"}
            email={modalData.email}
            type={modalData.type}
            history={props.history}
            toggleOpen={() => {
              dispatch(toggleCurrentModal(""));
            }}>
          </TwoFactorAuth>}
      </div>
    </React.Fragment>
  );
};
export default withRouter(withTranslation()(Login));

Login.propTypes = {
  history: PropTypes.object,
};
