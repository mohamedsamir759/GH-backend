import React, { 
  useState, useEffect, useCallback 
} from "react";
import { useDispatch, connect } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
  Col,
  Row,
  Label,
} from "reactstrap";
import { debounce } from "lodash";
import { Link } from "react-router-dom";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { makeWithdrawalStart } from "store/transactions/withdrawal/action";
import { fetchGatewaysOfWithdrawalsStart } from "store/gateway/action";
import { 
  fetchWalletStart, clearWallets, fetchClientWallets 
} from "store/wallet/list/action";
import { fetchClientsStart } from "store/client/actions";
import { withTranslation } from "react-i18next";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import Loader from "components/Common/Loader";
import * as clientApi from "apis/client";

function WithdrawForm(props){
  const dispatch = useDispatch();
  const [open, setWithdrawalModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [gateway, setGateway] = useState("");
  const [type, setType] = useState("LIVE");
  const [gatewayError, setGatewayError] = useState(false);
  const { create } = props.withdrawalsPermissions;
  
  const handleWithdraw = (event, values) => {
    event.preventDefault();
    dispatch(makeWithdrawalStart({
      customerId:selectedClient,
      walletId: selectedWalletId,
      gateway,
      ...values
    }));
    setSearchInput("");
    dispatch(clearWallets());
    
  }; 

  useEffect(() => {
    selectedClient &&
    dispatch(fetchClientWallets({
      belongsTo: selectedClient
    }));
  }, [selectedClient]);

  const selectType = (type)=>{
    setType(type);
    if (selectedClient.length > 0)
      dispatch(fetchWalletStart({
        belongsTo:selectedClient,
        customerId:selectedClient,
      }));
  };
  const toggleAddModal = () => {
    setWithdrawalModal(!open);
    setGatewayError(false);
  };

  useEffect(()=>{
    dispatch(fetchClientsStart({
      page: 1,
      // type
    }));
    dispatch(fetchGatewaysOfWithdrawalsStart());
    if (searchInput.length >= 3){
      dispatch(fetchClientsStart({
        searchText:searchInput,
        limit:props.totalDocs,
        type
      }));
    }
  }, [searchInput, type, open]);

  useEffect(() => {
    if (props.withdrawalModalClear && open){
      setWithdrawalModal(false);
    }
  }, [props.withdrawalModalClear]);

  const debouncedChangeHandler = useCallback(
    debounce((inputValue, cb) => {
      clientApi.getClients({
        payload: {
          searchText: inputValue,
          type: "LIVE"
        }
      }).then((data) => {
        return cb(data?.result?.docs.map((item) => (
          {
            label : `${item.firstName} ${item.lastName}`,
            value : {
              name: `${item.firstName} ${item.lastName}`,
              id: `${item._id}`
            }
          }
        )));
      });
    }, 1000), []
  );

  // debounce function handlers
  const fetchClientWalletDebounceHandler = useCallback(
    debounce((id) => setSelectedWalletId(id), 1000), []
  );

  return (
    <React.Fragment >
      <Link to="#" className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={toggleAddModal}><i className="bx bx-plus me-1"></i> {props.t("Add New Withdraw")}</Link>
      <Modal isOpen={open} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Make Withdraw")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='px-4 py-2'
            onValidSubmit={(e, v) => {
              delete v.client;
              delete v.wallet;
              delete v.gateway;
              delete v.type;
              handleWithdraw(e, v);
            }}
          >
            <Row className="mb-3">
              <Col md="6">
                <div>
                  <Label>{props.t("Client")}</Label>
                  <div>
                    <AsyncSelect
                      isClearable
                      placeholder = {props.t("Choose A Client")}
                      defaultOptions={props.loading ? [] : props.clients.map((item) => (
                        {
                          label : `${item.firstName} ${item.lastName}`,
                          value : {
                            name: `${item.firstName} ${item.lastName}`,
                            id: `${item._id}`
                          }
                        }
                      ))}
                      classNamePrefix="select2-selection"
                      loadOptions={debouncedChangeHandler}
                      onChange={(e) => { 
                        if (e && e.value && e.value.id) {
                          setSelectedClient(e.value.id);
                        }
                      }}
                      isRequired={true}
                      isSearchable={true}
                      backspaceRemoves={true}
                      name="clientId"
                    />
                    <AvField
                      name="client"
                      type="text"
                      errorMessage={props.t("Choose A Client")}
                      validate={{ required: { value: true } }}
                      value={selectedClient}
                      style={{
                        opacity: 0,
                        height: 0,
                        width: 0,
                        margin: -10
                      }}
                    />
                  </div>
                </div>
              </Col>

              <Col md="6">
                <Label>{props.t("Type")}</Label>
                <div>
                  <Select 
                    defaultValue={{
                      label:"Live",
                      value:"LIVE" 
                    }}
                    onChange={(e) => {
                      selectType(e.value);   
                    }}
                    options={[{
                      label:"Live",
                      value:"LIVE" 
                    },
                    {
                      label:"Demo",
                      value:"DEMO"
                    }]}
                    classNamePrefix="select2-selection"
                    placeholder={props.t("Choose Withdrawal Type")}
                  />
                  <AvField
                    name="type"
                    type="text"
                    errorMessage={props.t("Choose Withdrawal Type")}
                    validate={{ required: { value: true } }}
                    value={selectType}
                    style={{
                      opacity: 0,
                      height: 0,
                      width: 0,
                      margin: -10
                    }}
                  />
                </div>
              </Col>
            </Row>  

            <Row className="mb-3">
              <Col md="12">
                <Label>{props.t("Wallet")}</Label>
                <div>
                  <Select 
                    onChange={(e) => {
                      fetchClientWalletDebounceHandler(e.value.id);
                    }}
                    isSearchable = {true}
                    options={props.wallets.map((wallet) => (
                      {
                        label : `${wallet.asset}-(Balance ${wallet.amount} ${wallet.asset})`,
                        value : {
                          id: `${wallet._id}`
                        }
                      }
                    ))}
                    classNamePrefix="select2-selection"
                    placeholder = {props.t("Choose A Wallet")}
                  />
                  <AvField
                    name="wallet"
                    type="text"
                    errorMessage={props.t("Choose A Wallet")}
                    validate={{ required: { value: true } }}
                    value={selectedWalletId}
                    style={{
                      opacity: 0,
                      height: 0,
                      width: 0,
                      margin: -10
                    }}
                  />
                </div>
              </Col>
            </Row>
    
            <div className="mb-3">
              <Label>{props.t("Gateway")}</Label>
              <div>
                <Select 
                  onChange={(e) => {
                    setGateway(e.value.gateway);
                  }}
                  isSearchable = {true}
                  options={Object.keys(props.gateways).map((key) => (
                    {
                      label : `${props.gateways[key]}`,
                      value : {
                        gateway: `${props.gateways[key]}`
                      }
                    }
                  ))}
                  classNamePrefix="select2-selection"
                  placeholder={props.t("Choose A Gateway")}
                />
                <AvField
                  name="gateway"
                  type="text"
                  errorMessage={props.t("Choose A Gateway")}
                  validate={{ required: { value: true } }}
                  value={gateway}
                  style={{
                    opacity: 0,
                    height: 0,
                    width: 0,
                    margin: -10
                  }}
                />
                {gatewayError && <small className="text-danger">{props.t("Choose Valid Gateway")}</small>}
              </div>
            </div>
            
            <div className="mb-3">
              <AvField
                name="amount"
                label={props.t("Amount")}
                placeholder={props.t("Enter An Amount")}
                type="number"
                min="1"
                errorMessage={props.t("Enter An Amount")}
                validate = {{
                  required :{ value:true }
                }}
              />
            </div>

            <div className="mb-3">
              <AvField
                name="note"
                label={props.t("Note")}
                placeholder={props.t("Enter Note")}
                type="text"
              />
            </div>
    
            <div className='text-center mt-3 p-2'>
              {
                props.addLoading 
                  ?
                  <Loader />
                  :
                  <Button 
                    disabled = {props.addLoading} 
                    type="submit" 
                    color="primary"
                  >
                    {props.t("Add")}
                  </Button>
              }
            </div>
          </AvForm>
          {props.error && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {props.t(props.addWithdrawalErrorDetails)}
          </UncontrolledAlert>}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}
const mapStateToProps = (state) => ({
  gateways:state.gatewayReducer.gateways || [],
  error: state.withdrawalReducer.addWithdrawalError,
  addWithdrawalErrorDetails: state.withdrawalReducer.addWithdrawalErrorDetails,
  withdrawResponseMessage:state.withdrawalReducer.withdrawResponseMessage,
  withdrawalModalClear:state.withdrawalReducer.withdrawalModalClear,
  clients:state.clientReducer.clients || [],
  wallets:state.walletReducer.wallet.docs || [],
  withdrawalsPermissions: state.Profile.withdrawalsPermissions || {}, 
  disableWithdrawalButton : state.withdrawalReducer.disableWithdrawalButton,
  totalDocs:state.clientReducer.totalDocs,
  loading:state.clientReducer.loading,
  addLoading: state.withdrawalReducer.addLoading
});
export default connect(mapStateToProps, null)(withTranslation()(WithdrawForm));