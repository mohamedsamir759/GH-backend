import React, {  useEffect } from "react";
import {
  connect
} from "react-redux";
import {
  Row, Col,
  Modal, Button,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
  Label,
} from "reactstrap";
import {
  AvForm, AvField,
} from "availity-reactstrap-validation";
import { withTranslation } from "react-i18next";
import Select from "react-select";

function MarkupEdit(props) {
  const { open, onClose } = props;


  useEffect(() => {
    if (props.editClear) {
      onClose();
    }
  }, [props.editClear]);

  return (
    <React.Fragment >
      <Modal  isOpen={open} toggle={onClose} centered={true}>
        <ModalHeader toggle={onClose} tag="h4">
          {props.t("Edit Limits")}
        </ModalHeader>
        <ModalBody >
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
          </AvForm>          {props.error && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {props.t(props.error)}
          </UncontrolledAlert>}
          {props.editDone && <UncontrolledAlert color="success">
            <i className="mdi mdi-check-all me-2"></i>
            {props.t("Limits Updated successfully !!!")}
          </UncontrolledAlert>}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}


const mapStateToProps = (state) => ({
  editLoading: state.markupsReducer.editLoading,
  editDone: state.markupsReducer.editDone,
  editClear: state.markupsReducer.editClear,
  error: state.markupsReducer.error
});
export default connect(mapStateToProps, null)(withTranslation()(MarkupEdit));
