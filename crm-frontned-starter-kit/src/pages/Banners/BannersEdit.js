import React, {  useState } from "react";
import {
  connect
} from "react-redux";
import {
  Modal, Button,
  ModalHeader,
  ModalBody,
  Label,
  UncontrolledAlert,
  Col,
  Row,
} from "reactstrap";
import {
  AvForm, AvField, 
} from "availity-reactstrap-validation";
import { withTranslation } from "react-i18next";
import Select from "react-select";


function BannersEdit (props) {
  const [file, setFile] = useState();
  const { open, symbol = {}, onClose } = props;

  const { image } = symbol;


  return (
    <React.Fragment >
      <Modal isOpen={open} toggle={onClose} centered={true} size="lg">
        <ModalHeader toggle={onClose} tag="h4">
          {props.t("Edit Banner")}
        </ModalHeader>
        <ModalBody >
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
          {props.error && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {props.t(props.error)}
          </UncontrolledAlert>}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}


const mapStateToProps = (state) => ({
  editClear: state.assetReducer.editClear,  
  error:state.assetReducer.error,
  disableEditButton: state.assetReducer.disableEditButton
});
export default connect(mapStateToProps, null)(withTranslation()(BannersEdit));
