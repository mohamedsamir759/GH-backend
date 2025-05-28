import { connect } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
  Label,
  Col,
  Row,
} from "reactstrap";
import React, { useState, useEffect } from "react";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { withTranslation } from "react-i18next";
import Select from "react-select";

function BannersAdd(props) {
  const [addModal, setAddUserModal] = useState(false);
  const { create } = props.symbolsPermissions;

  const toggleAddModal = () => {
    setAddUserModal(!addModal);
  };

  useEffect(() => {
    if (props.clearModal && addModal) {
      setAddUserModal(false);
    }
  }, [props.clearModal]);

  return (
    <React.Fragment>
      <Button
        color="primary"
        className={`btn btn-primary ${!create ? "d-none" : ""}`}
        onClick={toggleAddModal}
      >
        <i className="bx bx-plus me-1"></i>
        {props.t("Add New Banner")}
      </Button>
      <Modal
        isOpen={addModal}
        toggle={toggleAddModal}
        centered={true}
        size="lg"
      >
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Add New Banner")}
        </ModalHeader>
        <ModalBody>
          <AvForm className="p-4" id="form">
            <Row>
              <Col md="6">
                <Label>{props.t("Language")}</Label>
                <div>
                  <Select
                    classNamePrefix="select2-selection"
                    placeholder={props.t("Choose Language")}
                  />
                </div>
              </Col>
              <Col md="6">
                <Label>{props.t("Type")}</Label>
                <div>
                  <Select
                    classNamePrefix="select2-selection"
                    placeholder={props.t("Choose Type")}
                  />
                </div>
              </Col>

              <Col md="6">
                <div className="mt-3">
                  <AvField
                    name="title"
                    label={props.t("Title")}
                    placeholder={props.t("Title")}
                    type="text"
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>
              <Col md="6">
                <div className="mt-3">
                  <AvField
                    name="description"
                    label={props.t("Description")}
                    placeholder={props.t("Description")}
                    type="text"
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>
              {/* </Row> */}
              <Col>
                <div className="mb-3">
                  <Label>Image url </Label>
                  <AvField
                    name="image"
                    type="file"
                    errorMessage={props.t(
                      "Please upload an image for the banners"
                    )}
                    validate={{
                      required: { value: true },
                    }}
                  />
                </div>
              </Col>

              <Col>
                <AvField
                  name="redirectURL"
                  label={props.t("Redirect URL")}
                  placeholder={props.t("Redirect URL")}
                  type="text"
                  validate={{ required: { value: true } }}
                />
              </Col>

              <Col md="12" className="mt-3">
                <Label>{props.t("Platform")}</Label>
                <div>
                  <Select
                    isSearchable={true}
                    name="platform"
                    classNamePrefix="select2-selection"
                    placeholder={props.t("Choose A Patform")}
                  />
                  <AvField
                    name="platform"
                    type="text"
                    errorMessage={props.t("Choose A Platform")}
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
            </Row>

            <div className="text-center pt-3 p-2">
              <Button
                disabled={props.disableAddButton}
                type="submit"
                color="primary"
                className=""
              >
                {props.t("Add")}
              </Button>
            </div>
          </AvForm>
          {props.error && (
            <UncontrolledAlert color="danger">
              <i className="mdi mdi-block-helper me-2"></i>
              {props.t(props.error)}
            </UncontrolledAlert>
          )}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}
const mapStateToProps = (state) => ({
  error: state.assetReducer.error,
  symbolsPermissions: state.Profile.symbolsPermissions || {},
  disableAddButton: state.assetReducer.disableAddButton,
  clearModal: state.assetReducer.clearModal,
});
export default connect(mapStateToProps, null)(withTranslation()(BannersAdd));
