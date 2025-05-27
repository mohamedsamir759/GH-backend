import React, { useState } from "react";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  Label,
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import Select from "react-select";

function AddLimit(props) {
  const [addModal, setAddMarkupModal] = useState(false);
  const { create } = props.markupsPermissions;
  const toggleAddModal = () => {
    setAddMarkupModal(!addModal);
  };

  return (
    <React.Fragment>
      <Link
        to="#"
        className={`btn btn-primary ${!create ? "d-none" : ""}`}
        onClick={toggleAddModal}
      >
        <i className="bx bx-plus me-1"></i>
        {props.t("Add New Limits")}
      </Link>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Add Limits")}
        </ModalHeader>
        <ModalBody>
          <AvForm className="p-4">
            <Row>
              <Row>
                <Col md="12">
                  <Label>{props.t("Type")}</Label>
                  <div>
                    <Select
                      classNamePrefix="select2-selection"
                      placeholder={props.t("Choose Type")}
                    />
                  </div>
                </Col>
              </Row>
              {/* </Row> */}
              <Col md="12" className="mt-3">
                <Label>{props.t("Currency")}</Label>
                <div>
                  <Select
                    isSearchable={true}
                    name="currency"
                    classNamePrefix="select2-selection"
                    placeholder={props.t("Choose A Currency")}
                  />
                  <AvField
                    name="currency"
                    type="text"
                    errorMessage={props.t("Choose A Currency")}
                    validate={{ required: { value: true } }}
                    style={{
                      opacity: 0,
                      height: 0,
                      width: 0,
                      margin: -10,
                    }}
                  />
                </div>
              </Col>
              <Col>
                <AvField
                  name="limit"
                  label={props.t("Limit")}
                  placeholder={props.t("Limit")}
                  type="number"
                  errorMessage={props.t("Enter valid fees limit")}
                  validate={{ required: { value: true } }}
                />
              </Col>
              <Col md="12">
                <Label>{props.t("Status")}</Label> 
                <div>
                  <Select 
                    // defaultValue={{
                    //   label:"Active",
                    //   value:"Inactive"
                    // }}
                    options={[{
                      label:"Active",
                      value:"Inactive"
                    },
                    {
                      label:"Active",
                      value:"Inactive"
                    }]}
                    classNamePrefix="select2-selection"
                    placeholder = {props.t("Choose Status")}
                  />
                </div>
              </Col>
            </Row>
            <br />
            <br />
            <div className="text-center pt-3 p-2">
              <Button
                disabled={props.addButtonDisabled}
                type="submit"
                color="primary"
                className=""
              >
                {props.t("Add Limits")}
              </Button>
            </div>
          </AvForm>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}
const mapStateToProps = (state) => ({
  error: state.markupsReducer.error,
  addMarkupSuccessMessage: state.markupsReducer.addMarkupSuccessMessage,
  markupsPermissions: state.Profile.markupsPermissions || {},
  markets: state.marketsReducer.markets || [],
});
export default connect(mapStateToProps, null)(withTranslation()(AddLimit));
