import React, { useEffect } from "react";
import MetaTags from "react-meta-tags";
import {
  Row, Col, Alert, Container, Form, FormGroup, Label, Button, Spinner, Card
} from "reactstrap";
import { withTranslation } from "react-i18next";

import {  apiError } from "../../store/actions";

//redux
import {
  useSelector, useDispatch,
} from "react-redux";

import { 
  Link, 
  useHistory, 
  useLocation, 
  withRouter,
} from "react-router-dom";

// import images
import * as content from "content";
import {
  Formik, Field as FormikField, Form as FormikForm 
} from "formik";
import { CustomInput } from "../../components/Common/CustomInput";
import * as Yup from "yup";
import { resetPasswordStart } from "store/auth/resetPassword/actions";

// eslint-disable-next-line no-useless-escape
const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z!@#$%^&*()_,.?":{}|<>\d]{8,20}$/;

const validationSchema = Yup.object().shape({
  password: Yup.string("")
    .min(8, "Password must contain atleast 8 characters")
    .max(20, "Password should not be more than 20 characters long")
    .matches(
      passwordRegExp,
      "Atleast one lower case, upper case and number required")
    .required("Enter your password"),
});

const ResetPassword = props => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const { showSuccessMessage, loading, error, success, message } = useSelector(state => ({
    showSuccessMessage: state.resetPasswordReducer.showSuccessMessage,
    loading: state.resetPasswordReducer.loading,
    error: state.resetPasswordReducer.error,
    message: state.resetPasswordReducer.message,
  }));
  const token = new URLSearchParams(location.search).get("token") || "";

  useEffect(() => {
    dispatch(apiError(""));
  }, [dispatch]);

  useEffect(() => {
    if (success) 
      history.push("/login");
  }, [success]);


  return (
    <React.Fragment>
    
      <MetaTags>
        <title>Register | IT Geeks</title>
      </MetaTags>
      <div className="auth-page">
        <Container fluid className="p-0">
          <Row className="g-0">
            <Col lg={3} md={5} className="mx-auto" style={{ margin: "5rem auto" }}>
              <Card className="d-flex  p-sm-5 p-4  card-shadow">
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    <div className="mb-4 mb-md-2 text-center">
                      <Link to="/dashboard" className="d-block auth-logo">
                        <img src={content.mainLogo} alt="" height="28" /> <span className="logo-txt">{content.clientName}</span>
                      </Link>
                    </div>
                    <div className="auth-content my-auto">
                      <div className="text-center mb-4 mb-md-3">
                        <h5 className="mb-0">Reset Password</h5>
                      </div>

                      <Formik
                        initialValues={{
                          password: "",
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values) => {
                          dispatch(resetPasswordStart({
                            ...values, 
                            token,
                          }));
                        }}>
                        {({ values, setFieldValue }) => (
                          <Form tag={FormikForm}>
                            <FormGroup row>
                              <Col xs={12}>
                                <div className="mb-3">
                                  <Label for="password">New Password</Label>
                                  <FormikField
                                    component={CustomInput}
                                    name="password"
                                    className={"mb-2"}
                                    type={"password"}
                                  >
                                  </FormikField>
                                </div>
                              </Col>
                              <div className="mb-4 text-center">
                                <p className="text-muted mb-0">{props.t("Remember your Password ?")}  <a href="login"
                                  className="text-primary fw-semibold"> {props.t("Sign In")} </a> </p>
                              </div>
                            </FormGroup>
                            {showSuccessMessage && showSuccessMessage ? (
                              <Alert color="success">
                                Password has been reset successfully
                              </Alert>
                            ) : null}

                            { error && error ? (
                              <Alert color="danger">{message}</Alert>
                            ) : null}
                            <Row>
                              {/* <Col xs={6}>
                                <span className="">
                                  <Button className="text-center" color="primary" onClick={() => history.push("/login")}>
                                    Login
                                  </Button>
                                </span>
                              </Col> */}
                              <Col xs={12} className="text-right">
                                <span className="">
                                  {loading ? <Spinner className="ms-2 text-center" color="primary" /> : <Button className="text-center" color="primary" type="submit">Reset Password</Button>}
                                </span>
                              </Col>
                            </Row>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(withTranslation()(ResetPassword));
