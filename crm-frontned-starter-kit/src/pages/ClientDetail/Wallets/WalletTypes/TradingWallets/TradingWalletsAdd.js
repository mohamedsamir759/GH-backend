import { connect } from "react-redux";
import {
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
} from "reactstrap";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
function TradingWalletsAdd(props){
  const [addModal, setAddModal] = useState(false);
  const toggleAddModal = ()=>{
    setAddModal(preValue => !preValue);
  };
  useEffect(()=>{
    if (!props.showAddSuccessMessage && addModal){
      setAddModal(false);
    }
  }, [props.showAddSuccessMessage]);
  return (
    <React.Fragment >
      <Link to="#" className="btn btn-primary "  onClick={toggleAddModal}><i className="bx bx-plus me-1"></i>{props.t("Add New Trading Wallets")}</Link>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Add New Trading Wallets")}
        </ModalHeader>
        <ModalBody >

          {props.error && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {props.t(props.editError)}
          </UncontrolledAlert>}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}
const mapStateToProps = (state)=>({
  loading: state.dictionaryReducer.loading || false,
  dictionary: state.dictionaryReducer.dictionary || [],
  error : state.dictionaryReducer.error,
  id :state.dictionaryReducer.id,
  showAddSuccessMessage:state.dictionaryReducer.showAddSuccessMessage,
  dictionariesPermissions :state.Profile.dictionariesPermissions || {},
  disableAddButton: state.dictionaryReducer.disableAddButton
});
export default connect(mapStateToProps, null)(withTranslation()(TradingWalletsAdd));