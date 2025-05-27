import React, { useEffect } from "react";
import {
  connect, useDispatch
} from "react-redux";
import {
  // Button,
  // Input,
  Col,
  Container,
  Form as ReactStrapForm,
  Label,
  Row,
  Spinner,
  Alert
} from "reactstrap";
import {
  Formik, Field as FormikField, Form as FormikForm
} from "formik";
import * as Yup from "yup";
import MetaTags from "react-meta-tags";

//i18n
import { withTranslation } from "react-i18next";
import CardWrapper from "../../components/Common/CardWrapper";
import { 
  editProfile, 
  fetchProfile, 
  convertProfile,
  logoutUser 
} from "../../store/actions";
import { COUNTRIES } from "../../helpers/countries";
import { NATIONALITIES } from "../../helpers/nationalitites";
import { CustomInput } from "../../components/Common/CustomInput";

const phoneRegExp = /(\+|00)(297|93|244|1264|358|355|376|971|54|374|1684|1268|61|43|994|257|32|229|226|880|359|973|1242|387|590|375|501|1441|591|55|1246|673|975|267|236|1|61|41|56|86|225|237|243|242|682|57|269|238|506|53|5999|61|1345|357|420|49|253|1767|45|1809|1829|1849|213|593|20|291|212|34|372|251|358|679|500|33|298|691|241|44|995|44|233|350|224|590|220|245|240|30|1473|299|502|594|1671|592|852|504|385|509|36|62|44|91|246|353|98|964|354|972|39|1876|44|962|81|76|77|254|996|855|686|1869|82|383|965|856|961|231|218|1758|423|94|266|370|352|371|853|590|212|377|373|261|960|52|692|389|223|356|95|382|976|1670|258|222|1664|596|230|265|60|262|264|687|227|672|234|505|683|31|47|977|674|64|968|92|507|64|51|63|680|675|48|1787|1939|850|351|595|970|689|974|262|40|7|250|966|249|221|65|500|4779|677|232|503|378|252|508|381|211|239|597|421|386|46|268|1721|248|963|1649|235|228|66|992|690|993|670|676|1868|216|90|688|886|255|256|380|598|1|998|3906698|379|1784|58|1284|1340|84|678|681|685|967|27|260|263)(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{4,20}$/im;

function ProfileSetting(props) {
  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, props.t("Too Short!"))
      .max(15, props.t("Too Long!"))
      .required(props.t("Required")),
    lastName: Yup.string()
      .min(2, props.t("Too Short!"))
      .max(15, props.t("Too Long!"))
      .required(props.t("Required")),
    phone: Yup.string(props.t("Enter your Phone")).matches(phoneRegExp, props.t("Phone is not valid")).required(props.t("Phone is required")),
    city: Yup.string(props.t("Enter City")).required(props.t("City is required")),
    gender: Yup.string(props.t("Enter gender")).required(props.t("gender is required")),
    dob: Yup.date().max(new Date(Date.now() - 567648000000), props.t("You must be at least 18 years")).required(props.t("Required")),
    country: Yup.string(props.t("Select your country of residence")).required(props.t("Country of residence is required")),
    nationality: Yup.string(props.t("Select your nationality")).required(props.t("nationality is required")),
  
  });
  const dispatch = useDispatch();
  const { clientData, loading, editLoading, editSuccess, error } = props.Profile;

  const convertClickHandler = () => {
    dispatch(convertProfile());
    dispatch(logoutUser(props.history));
  };

  useEffect(() => {
    dispatch(fetchProfile());

  }, []);

  return (<>
    <div className="page-content">
      <MetaTags>
        <title>{props.t("Profile")}</title>
      </MetaTags>
      <Container>
        <h1 className="mb-4 mt-5">
          {props.t("Your Avatar")}
        </h1>
        <CardWrapper className="mb-5">
          <div className="p-3 d-flex align-items-center">
            {clientData.firstName && clientData.firstName ? 
              <button type="button" className="btn btn-light position-relative p-0 avatar-lg rounded-circle">
                <span className="avatar-title bg-transparent text-reset fs-2">
                  {clientData.firstName[0]}{clientData.lastName[0]}
                </span>
              </button>
              : <Spinner></Spinner>}
            {/* <img src="img/ava-header.png" alt="" height={80} /> */}
            <div className="mx-4">
              {
                clientData && clientData.category === "DEMO" &&
                <button
                  className="btn btn-outline-primary waves-effect waves-light w-md m-2"
                  onClick={convertClickHandler}
                >
                  {props.t("Convert to live")}
                </button>
              }
            </div>
          </div>
        </CardWrapper>
        {loading ? <Spinner animation="border" /> :
          <>
            {Object.keys(clientData).length > 0 && <>
              <h1 className="mb-4">
                {props.t("Your Details")}
              </h1>
              <CardWrapper>
                <Formik
                  initialValues={{
                    firstName: clientData.firstName,
                    lastName: clientData.lastName,
                    country: clientData.country,
                    nationality: clientData.nationality,
                    city: clientData.city,
                    phone: clientData.phone,
                    dob: clientData.dob,
                    gender: clientData.gender,
                    email:clientData.email
                  }}
                  validationSchema={validationSchema}
                  onSubmit={(values) => {
                    dispatch(editProfile(values));
                  }}>
                  {({ values, setFieldValue }) => (
                    <ReactStrapForm tag={FormikForm}>
                      <Row>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="firstName">{props.t("First Name")}</Label>
                            <FormikField
                              component={CustomInput}
                              name="firstName"
                              id="firstName"
                              type={"text"}
                              value={values.firstName}
                              disabled={true}
                            >
                            </FormikField>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="lastName">{props.t("Last Name")}</Label>
                            <FormikField
                              component={CustomInput}
                              name="lastName"
                              id="lastName"
                              type={"text"}
                              value={values.lastName}
                              disabled={true}
                            >
                            </FormikField>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="email">{props.t("Email")}</Label>
                            <FormikField
                              component={CustomInput}
                              name="email"
                              id="email"
                              type={"text"}
                              value={values.email}
                              disabled={true}
                            >
                            </FormikField>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label for="country">{props.t("Country")}</Label>
                            <FormikField
                              component={CustomInput}
                              name="country"
                              className={"mb-2 form-select"}
                              type={"select"}
                              value={values.country}
                              disabled={true}
                              onChange={(e) => {
                                const value = JSON.parse(e.target.value);
                                setFieldValue("country", value.countryEn);
                              }}
                            >
                              {COUNTRIES.map((c, key) => {
                                return <option key={key} value={JSON.stringify(c)}>{c.countryEn}</option>;
                              }
                              )}
                            </FormikField>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label for="nationality">{props.t("Nationality")}</Label>
                            <FormikField
                              component={CustomInput}
                              name="nationality"
                              className={"form-select"}
                              type={"select"}
                              value={values.nationality}
                              disabled={true}
                            >
                              {NATIONALITIES.map((n, key) => {
                                return <option key={key} value={n.Nationality}>{n.Nationality}</option>;
                              }
                              )}
                            </FormikField>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label for="phone">{props.t("Phone")}</Label>
                            <FormikField
                              component={CustomInput}
                              name="phone"
                              className={"form-control"}
                              value={values.phone}
                              disabled={true}
                            >
                            </FormikField>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label for="dob">{props.t("Date Of birth")}</Label>
                            <FormikField
                              component={CustomInput}
                              name="dob"
                              className={"mb-2"}
                              type={"date"}
                              value={values.dob}
                              disabled={true}
                            >
                            </FormikField>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label for="gender">{props.t("Gender")}</Label>
                            <FormikField
                              component={CustomInput}
                              name="gender"
                              className={"form-select"}
                              type={"select"}
                              disabled={true}
                            >
                              {["Male", "Female"].map((n, key) => {
                                return <option key={key} value={n}>{n}</option>;
                              }
                              )}
                            </FormikField>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="city">{props.t("City")}</Label>
                            <FormikField
                              component={CustomInput}
                              name="city"
                              id="city"
                              type={"text"}
                              value={values.city}
                              disabled={true}
                            >
                            </FormikField>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="phone">{props.t("Phone")}</Label>
                            <FormikField
                              component={CustomInput}
                              name="phone"
                              id="phone"
                              type={"text"}
                              value={values.phone}
                              disabled={true}
                            >
                            </FormikField>
                          </div>
                        </Col>
                        {/* <Col md={6}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">Deposit Assets</Label>
                                                        <select className="form-select">
                                                            <option>Select</option>
                                                            <option>Large select</option>
                                                            <option>Small select</option>
                                                        </select>
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">Withdraw Assets</Label>
                                                        <select className="form-select">
                                                            <option>Select</option>
                                                            <option>Large select</option>
                                                            <option>Small select</option>
                                                        </select>
                                                    </div>
                                                </Col> */}
                      </Row>
                      {/* <h6 className="mb-3">{props.t("Notifications")}</h6>
                      <div className="form-group ms-3">
                        <div className="form-check mb-3">
                          <Input type="checkbox" className="form-check-input custom-form-check-input" id="formrow-customCheck" disabled={true}/>
                          <Label className="form-check-label" htmlFor="formrow-customCheck">{props.t("Notifications")}</Label>
                        </div>
                        <div className="form-check mb-3">
                          <Input type="checkbox" className="form-check-input custom-form-check-input" id="formrow-customCheck" disabled={true}/>
                          <Label className="form-check-label" htmlFor="formrow-customCheck">{props.t("Exchange")}</Label>
                        </div>
                        <div className="form-check mb-3">
                          <Input type="checkbox" className="form-check-input custom-form-check-input" id="formrow-customCheck" disabled={true}/>
                          <Label className="form-check-label" htmlFor="formrow-customCheck">{props.t("Withdrawls")}</Label>
                        </div>
                      </div> */}
                      {editLoading && <Spinner animation="border" />}
                      {/* {!editLoading && <div className="mt-4">
                        <Button type="submit" className="btn w-lg blue-gradient-color">{props.t("Update Profile")}</Button>
                      </div>} */}
                      {editSuccess && <Alert color="success my-2">{props.t(editSuccess)}</Alert>}
                      {!editLoading && error.length > 0 && <Alert color="danger my-2">{props.t(error)}</Alert>}
                    </ReactStrapForm>)}
                </Formik>
              </CardWrapper>
            </>}
          </>
        }
      </Container>
    </div>
  </>);
}
const mapStateToProps = (state) => {
  return {
    Profile: state.Profile
  };
};
export default connect(mapStateToProps, null)(withTranslation()(ProfileSetting)); 