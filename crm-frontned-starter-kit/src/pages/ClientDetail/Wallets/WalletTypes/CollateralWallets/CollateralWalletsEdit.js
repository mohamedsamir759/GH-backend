import {  connect } from "react-redux";
import {
  Modal,
  ModalHeader,
} from "reactstrap";
import { withTranslation } from "react-i18next";
import React from "react";
function CollateralWalletsEdit(props){
  const { open, onClose } = props;
  return (
    <React.Fragment >
      
      <Modal isOpen={open} toggle={onClose} centered={true}>
        <ModalHeader toggle={onClose} tag="h4">
          {props.t("Edit Collateral Wallets")}
        </ModalHeader>

      </Modal>
    </React.Fragment>
  );
}
const mapStateToProps = (state)=>({
  loading: state.dictionaryReducer.loading || false,
  dictionary: state.dictionaryReducer.dictionary || [],
  error : state.dictionaryReducer.error,
  id :state.dictionaryReducer.id,
  editSuccess:state.dictionaryReducer.editSuccess,
  disableEditButton : state.dictionaryReducer.disableEditButton
});
export default connect(mapStateToProps, null)(withTranslation()(CollateralWalletsEdit));