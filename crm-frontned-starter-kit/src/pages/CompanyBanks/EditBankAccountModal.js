// a modal to only edit title and action
import React, { useEffect } from "react";
import {
  useDispatch, connect
} from "react-redux";
import {
  Modal, Button,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
} from "reactstrap";
import {
  AvForm, AvField
} from "availity-reactstrap-validation";

// i18n
import { withTranslation } from "react-i18next";
import { editBankAccount } from "store/companyBankAccount/actions";

function BankAccountEditModal(props){
  const { open, selectedBankAccount = {}, onClose } = props;
  const dispatch = useDispatch();
  const handleEditSystemEmail = (e, values) => {
    dispatch(editBankAccount({
      id: selectedBankAccount.id,
      values
    }));
  };
  useEffect(()=>{
    if (props.bankAccountEditClearingCounter > 0 && open) {
      onClose();
    }
  }, [props.bankAccountEditClearingCounter]);

  return (
    <React.Fragment >
      <Modal isOpen={open} toggle={onClose} centered={true}>
        <ModalHeader toggle={onClose} tag="h4">
          {props.t("Edit bank account")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              handleEditSystemEmail(e, v);
              props.bankAccountUpdateHandler();
            }}
          >
            <div className="mb-3">
              <AvField
                name="bankName"
                label={props.t("Bank name")}
                placeholder={props.t("Enter Bank Name")}
                type="text"
                value={selectedBankAccount.bankName}
                errorMessage={props.t("Enter Bank Name")}
                validate={{ required: { value: true } }}
              />
            </div>

            <div className="mb-3">
              <AvField
                name="swiftCode"
                label={props.t("Swift Code/IFSC")}
                placeholder={props.t("Enter Swift Code/IFSC")}
                type="text"
                value={selectedBankAccount.swiftCode}
              />
            </div>

            <div className="mb-3">
              <AvField
                name="iban"
                label={props.t("IBAN")}
                placeholder={props.t("Enter IBAN")}
                type="text"
                value={selectedBankAccount.iban}
                errorMessage={props.t("Enter IBAN")}
              />
            </div>

            <div className="mb-3">
              <AvField
                name="accountNumber"
                label={props.t("Account number")}
                placeholder={props.t("Enter Account Number")}
                type="text"
                value={selectedBankAccount.accountNumber}
                errorMessage={props.t("Enter Account Number")}
                onKeyPress={(e) => {
                  if (!isNaN(e.key) && e.target.value.length > 0){
                    return true;
                  }
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            <div className="mb-3">
              <AvField
                name="currency"
                label={props.t("Currency")}
                placeholder={props.t("Enter Currency")}
                type="text"
                value={selectedBankAccount.currency}
                errorMessage={props.t("Enter Currency")}
                validate={{ required: { value: true } }}
              />
            </div>
            {/* submit button */}
            <div className='text-center pt-3 p-2'>
              <Button disabled={props.editResult} type="submit" color="primary">
                {props.t("Edit")}
              </Button>
            </div>
          </AvForm>
          {props.editError && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {/* TODO this needs to be handled in translation */}
            {props.t(JSON.stringify(props.editError))}
          </UncontrolledAlert>}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}


const mapStateToProps = (state) => ({
  editResult: state.bankAccountReducer.editResult,
  editError: state.bankAccountReducer.editError,
  bankAccountEditClearingCounter: state.bankAccountReducer.bankAccountEditClearingCounter
});

export default connect(mapStateToProps, null)(withTranslation()(BankAccountEditModal));