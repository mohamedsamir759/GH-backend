import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, connect } from "react-redux";
import {
  Modal, Button, ModalHeader, ModalBody, UncontrolledAlert 
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";

import { addBankAccount } from "store/companyBankAccount/actions";
// i18n
import { withTranslation } from "react-i18next";

function AddBankAccountModal(props){
  const { buttonText, show, toggle } = props;
  const dispatch = useDispatch();
  const addBankAccountHandler = (e, values) => {
    dispatch(addBankAccount(values));
  };
  useEffect(() => {
    !props.addLoading && show && toggle();
  }, [props.addLoading]);
  return (
    <React.Fragment >
      <Link to="#" className="btn btn-primary" onClick={toggle}>
        <i className={`bx ${!buttonText ? "bx-plus" : ""} me-1`}></i> {props.t(`${buttonText ? buttonText : "Add New Bank Account"}`)} 
      </Link>
      <Modal isOpen={show} toggle={toggle} centered={true}>
        <ModalHeader toggle={toggle} tag="h4">
          {props.t("Add new bank account")} 
        </ModalHeader>
        <ModalBody >
          <AvForm
            className="p-4" 
            onValidSubmit={(e, v) => {
              addBankAccountHandler(e, v);
            }}
          >
            <div className="mb-3">
              <AvField
                name="accountHolderName"
                label={props.t("Account owner name")}
                placeholder={props.t("Enter Account Owner Name")}
                type="text"
                errorMessage={props.t("Enter Account Owner Name")}
              />
            </div>

            <div className="mb-3">
              <AvField
                name="bankName"
                label={props.t("Bank name")}
                placeholder={props.t("Enter Bank Name")}
                type="text"
                errorMessage={props.t("Enter Bank Name")}
                validate={{ required: { value: true } }}
              />
            </div>

            <div className="mb-3">
              <AvField
                name="accountNumber"
                label={props.t("Account number")}
                placeholder={props.t("Enter Account Number")}
                type="text"
                onKeyPress={(e) => {
                  if (!isNaN(e.key) && e.target.value.length > 0){
                    return true;
                  }
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                validate={
                  {
                    pattern: {
                      value: "^[0-9]+$",
                      errorMessage: "testing error message"
                    },
                  }
                }
              />
            </div>

            <div className="mb-3">
              <AvField
                name="swiftCode"
                label={props.t("Swift Code/IFSC")}
                placeholder={props.t("Enter Swift Code/IFSC")}
                type="text"
              />
            </div>

            <div className="mb-3">
              <AvField
                name="address"
                label={props.t("Address")}
                placeholder={props.t("Enter Address")}
                type="text"
                errorMessage={props.t("enter Address")}
              />
            </div>

            <div className="mb-3">
              <AvField
                name="iban"
                label={props.t("IBAN")}
                placeholder={props.t("Enter IBAN")}
                type="text"
              />
            </div>

            <div className="mb-3">
              <AvField
                name="currency"
                label={props.t("Currency")}
                placeholder={props.t("Enter Currency")}
                type="text"
                errorMessage={props.t("Enter Currency")}
                validate={{ required: { value: true } }}
              />
            </div>
            <div className="text-center pt-3 p-2">
              <Button disabled={props.addLoading} type="submit" color="primary">
                {props.t("Add")}
              </Button>
            </div>
          </AvForm>
          {props.addError && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {props.t(JSON.stringify(props.addErrorDetails))}
          </UncontrolledAlert>}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  addLoading: state.banks.addLoading,
  addErrorDetails: state.banks.addErrorDetails,
  addError: state.banks.addError,  
});

export default connect(mapStateToProps, null)(withTranslation()(AddBankAccountModal));