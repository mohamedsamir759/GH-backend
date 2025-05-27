import React, { useState, useEffect } from "react";
import { useDispatch, connect } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
  Label,
  Row,
  Col,
} from "reactstrap";
import { Link } from "react-router-dom";
import { AvForm, AvField } from "availity-reactstrap-validation";
// import "../SearchableInputStyles.scss";
import { withTranslation } from "react-i18next";
import { fetchForexDepositsGatewaysStart } from "store/forexGateway/actions";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { fetchClientWallets } from "store/wallet/actions";
import { getClientWalletDetails, getClientWalletDetailsListed } from "apis/wallet";
import { fetchClientsStart } from "store/client/actions";
import Loader from "components/Common/Loader";
import { addBounsToCustomer } from "apis/forexBouns";
import { addForexBounse } from "store/forexTransactions/bounses/actions";


const TypeOfWalletsoptions = [
  { 
    value: "trading", 
    label: "Trading Wallets" 
  },
  { 
    value: "margin", 
    label: "Margin" 
  },
  { 
    value: "futures", 
    label: "Futures" 
  },
];

function AddBonusModal(props) {
  const {clientId, loadForexBounses} = props;
  const dispatch = useDispatch();
  const { create } = props.depositsPermissions;
  const [walletsOptions, setWalletsOptions] = useState([
    { 
      value: "trading", 
      label: "Trading Wallets" 
    },
    { 
      value: "margin", 
      label: "Margin" 
    },
    { 
      value: "futures", 
      label: "Futures" 
    },
  ]);
  const [typeOfWallet, setTypeOfWallet] = useState({});
  const [wallet, setWallet] = useState({});
  const [addModal, setBounseModal] = useState(false);
  const [client, setClient] = useState([]);
  const [allClientWallets, setAllClientWallets] = useState({});
  const [type, setType] = useState("LIVE");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  
  useEffect(()=>{
    dispatch(fetchClientsStart({
      page:1,
      limit:10000000,
      type
    }));
  
  }, []);

  useEffect(() => {
    setBounseModal(!addModal);
  }, [props.show]);

  useEffect(() => {
    if (props.customerId) {
      dispatch(fetchForexDepositsGatewaysStart());
    }
  }, []);

  const toggleAddModal = () => {
    setBounseModal(!addModal);
  };

  useEffect(() => {
    if (!props.disableAddButton && open) {
      setBounseModal(false);
    }
  }, [props.modalClear]);


  const loadClientWalletDetails = async (clientId) => {
    try {
      const payload = {
        belongsTo: clientId,
        page: 1,
        limit: 100000,
      };
      const userWallets = await getClientWalletDetailsListed({payload});
      setAllClientWallets(userWallets?.result);
    } catch (error) {
      console.log("errorr", error);
    }
  };

  useEffect(async() => {
    if (clientId) {
      await loadClientWalletDetails(clientId);
    } else if (client?.value?.id) {
      await loadClientWalletDetails(client?.value?.id);

    }
  }, [client, clientId]);

  useEffect(() => {
    let walletsOptionsData = [];
    if (typeOfWallet?.value && allClientWallets?.[typeOfWallet?.value]){
      walletsOptionsData = allClientWallets?.[typeOfWallet?.value]?.map(wallet=>{
        return {
          value: wallet?.asset,
          label: wallet?.asset
        };
      });
    }
    setWalletsOptions(walletsOptionsData);
  }, [typeOfWallet, allClientWallets]);


  const handleAddBouns = async (event, values) => {
    event.preventDefault();
    dispatch(addForexBounse({
      customerId: clientId ? clientId : client?.value?.id,
      currency: wallet?.value,
      walletType: `${typeOfWallet?.value}`?.toUpperCase(),
      amount,
      note,
    }));
    // setSearchInput("");
    setTypeOfWallet({});
    setWallet({});
    setClient({});
    setAmount({});
    setAllClientWallets({});
    if (loadForexBounses) {
      loadForexBounses();
    }
    toggleAddModal();
    // dispatch(clearWallets());
  };

  return (
    <React.Fragment>
      <Link
        to="#"
        className={`btn btn-primary ${!create ? "d-none" : ""}`}
        onClick={toggleAddModal}
      >
        {
          !clientId &&
            <i className="bx bx-plus me-1"></i> 
        }
        {props.t("Add New Bonus")}
      </Link>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Add New Bonus")}
        </ModalHeader>
        <ModalBody>
          <AvForm className="p-4" id="form"
            onValidSubmit={(e, v) => {
              delete v.client;
              delete v.clientId;
              delete v.wallet;
              delete v.gateway;
              handleAddBouns(e, v);
            }}
          >
            <Row>
              {
                !clientId &&
                  <Col md="12">                      
                    <Label>{props.t("Client Name")}</Label>
                    <div>
                      <AsyncSelect
                        isClearable
                        placeholder = {props.t("Choose A Client Name")}
                        defaultOptions={props.loading ? [] : props.clients?.map((item) => (
                          {
                            label : `${item.firstName} ${item.lastName}`,
                            value : {
                              name: `${item.firstName} ${item.lastName}`,
                              id: `${item._id}`
                            }
                          }
                        ))}
                        value={client}
                        onChange={setClient}
                        classNamePrefix="select2-selection"
                        isRequired={true}
                        isSearchable={true}
                        backspaceRemoves={true}
                        name="clientId"
                      />
                      <AvField
                        name="clientId"
                        type="text"
                        errorMessage={props.t("Choose A Client Name")}
                        validate={{ required: { value: true } }}
                        style={{
                          opacity: 0,
                          height: 0,
                          width: 0,
                          margin: -10
                        }}
                      />
                    </div>
                  </Col>
              }
              <Col md="12">
                <Label>{props.t(" Type of Wallet")}</Label>
                <div>
                  <Select
                    classNamePrefix="select2-selection"
                    placeholder={props.t("Select Type of Wallet")}
                    value={typeOfWallet}
                    onChange={setTypeOfWallet}
                    options={TypeOfWalletsoptions}
                  />
                </div>
              </Col>

              <Col md="12">
                <div className="mt-3">
                  <Label>{props.t(" Select Wallet")}</Label>
                </div>
                <div>
                  <Select
                    classNamePrefix="select2-selection"
                    placeholder={props.t("Select Wallet")}

                    value={wallet}
                    onChange={setWallet}
                    options={walletsOptions}
                  />
                </div>
              </Col>

              <Col md="12">
                <div className="mt-3">
                  <AvField
                    name="amount"
                    label={props.t("Amount")}
                    placeholder={props.t("Amount")}
                    type="number"
                    validate={{ required: { value: true } }}
                    value={amount}
                    onChange={(e)=>setAmount(e.target.value)}
                  />
                </div>
              </Col>
              <Col md="12">
                <div>
                  <AvField
                    name="note"
                    label={props.t("Note")}
                    placeholder={props.t("Note")}
                    type="text"
                    validate={{ required: { value: false } }}
                    value={note}
                    onChange={(e)=>setNote(e.target.value)}
                  />
                </div>
              </Col>
            </Row>

            
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
                    onClick={handleAddBouns}
                  >
                    {props.t("Add")}
                  </Button>
              }
            </div>
          </AvForm>
          {props.addForexBounseFailDetails && (
            <UncontrolledAlert color="danger">
              <i className="mdi mdi-block-helper me-2" />
              {props.t(props.addForexBounseFailDetails)}
            </UncontrolledAlert>
          )}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}
const mapStateToProps = (state) => ({
  clients:state.clientReducer.clients || [],

  forexDepositsGateways: state.forexGatewayReducer.forexDepositsGateways || [],
  depositsGatewaysLoading:
    state.forexGatewayReducer.depositsGatewaysLoading || [],
  modalClear: state.forexBounseReducer.modalClear,
  depositsPermissions: state.Profile.depositsPermissions || {},
  disableAddButton: state.forexBounseReducer.disableAddButton,
  addLoading: state.forexBounseReducer.addLoading,
  addForexDepositFailDetails:
    state.forexBounseReducer.addForexDepositFailDetails,
  tradingAccounts: state.tradingAccountReducer.tradingAccounts,
  accounts: state.tradingAccountReducer.loginTradingAccounts,
  quickActionAccs: state.tradingAccountReducer.accounts.docs,
  customerTradingAccounts: state.tradingAccountReducer.customerTradingAccounts,
  fetchTradingAccountsFail:
    state.tradingAccountReducer.fetchTradingAccountsFail,
  fetchTradingAccountsByLoginLoading:
    state.tradingAccountReducer.fetchTradingAccountsByLoginLoading,
  fetchTradingAccountsByLoginSuccess:
    state.tradingAccountReducer.fetchTradingAccountsByLoginSuccess,
  fetchTradingAccountsByLoginFail:
    state.tradingAccountReducer.fetchTradingAccountsByLoginFail,
  fetchTradingAccountsByLoginFailDetails:
    state.tradingAccountReducer.fetchTradingAccountsByLoginFailDetails,
});
export default connect(mapStateToProps, null)(withTranslation()(AddBonusModal));
