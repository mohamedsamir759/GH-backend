import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Col,
  Form,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "reactstrap";
import { toggleCurrentModal } from "../../../store/actions";
import CustomModal from "../../Common/CustomModal";
import { addDeposit } from "../../../apis/deposit";
import CardWrapper from "../../Common/CardWrapper"; 
import  BigNumber  from "bignumber.js";
import WalletsListSelect from "components/Common/WalletsListSelect";
import { withTranslation } from "react-i18next";

function FiatDeposit({ isOpen, toggleOpen, ...props }) { 
  const wallets = useSelector((state) => state.wallets?.wallets);
  const transActionfee = useSelector(
    (state) => state.Profile?.clientData?.transactionFeeId
  );
  const [activeStep, setActiveStep] = useState(0);
  const [walletId, setWalletId] = useState("");
  const [amount, setAmount] = useState("");
  const [gateway, setGateway] = useState(""); 
  const CompanyBankAccountDetile = { 
    accountHolderName: "mostafa",
    bankName: "Ahly",
    accountNumber: "323233232",
    swiftCode: "ASW",
    address: "223, sohada 22",
    iban: "ssssssssssssssss",
    currency: "USD",
  };
  const [asset, setAsset] = useState("");
  const [transactionFee, setTransactionFee] = useState("");

  // const [note, setNote] = useState("");
  const [result, setResult] = useState("");
  const [currancy, setCurrancy] = useState("EUR");
  const [wireTransferFlag, setWireTransferFlag] = useState(false);
  const [selectCurrancyError, setSelectCurrancyError] = useState(false);
  const [selectGatwayError, setSelectGatwayError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);
      setWalletId("");
      setGateway("");
      setAmount("");  
    }
  }, [isOpen]); 
  const dispatch = useDispatch();
  function toggleTab(tab) {
    if (activeStep !== tab) {
      setActiveStep(tab);
    }
  }
  const handleSubmit = ( ) => {
    // event.preventDefault();
    addDeposit({
      gateway: gateway,
      walletId: walletId,
      amount: amount,
      note: "note",
    })
      .then((e) => {
        // console.log(e);
        setResult(e);
        toggleTab(2);
      })
      .catch((e) => {
        // console.log(e);
        setResult(e);
        toggleTab(2);
      });
    // toggleOpen()
  };

  const validateStep1 = () => {
    if (walletId == "") {
      setSelectCurrancyError(true);
      setTimeout(() => {
        setSelectCurrancyError(false);
      }, 2000);
    } 
    if (gateway == "") {
      setSelectGatwayError(true);
      setTimeout(() => {
        setSelectGatwayError(false);
      }, 2000);
    }
    if (walletId != "" && gateway != "") {
      toggleTab(1);
    }
  };
  const validateStep2 = () => {
    if (amount == "") {
      setAmountError(true);
      setTimeout(() => {
        setAmountError(false);
      }, 2000);
    } else {
      handleSubmit();
    }
  };
  useEffect(() => { 
    const data = getTransactionFeeForAssetFromData(transActionfee, asset);
    if (amount != 0 && amount != "") {
      const value = calculateTransactionFeeAmount(
        {
          value: data?.value?.$numberDecimal || data?.value,
          isPercentage: data?.isPercentage,
          minValue: data?.minValue,
          maxValue: data?.maxValue?.$numberDecimal || data?.maxValue
        },
        amount
      );
      setTransactionFee((value?.c) ? value?.c[0] : "0");
    } else if (amount == 0) {
      setTransactionFee("0");
    }

  }, [amount]);
  const getTransactionFeeForAssetFromData = (feeData = {}, asset = null) => {
    let data = feeData;
    if (!asset || !feeData || !feeData.assets || !feeData.assets[asset]) {
      data = {
        _id: (feeData && feeData._id) || null,
        value: (feeData && feeData.value) || 0,
        isPercentage: (feeData && feeData.isPercentage) || false,
        minValue: (feeData && feeData.minValue) || 0,
        maxValue: (feeData && feeData.maxValue) || 0,
      };
    } else {
      data = {
        _id: (feeData && feeData._id) || null,
        value:
          (feeData && feeData.assets[asset] && feeData.assets[asset].value) ||
          0,
        isPercentage: (feeData && feeData.isPercentage) || false,
        minValue:
          (feeData &&
            feeData.assets[asset] &&
            feeData.assets[asset].minValue) ||
          0,
        maxValue:
          (feeData &&
            feeData.assets[asset] &&
            feeData.assets[asset].maxValue) ||
          0,
      };
    }
    return data;
  };

  const calculateTransactionFeeAmount = (feeDetails, amount) => {
    let { value, isPercentage, minValue, maxValue } = feeDetails;
    let fee = new BigNumber(0);
    value = new BigNumber(value);
    minValue = new BigNumber(minValue);
    maxValue = new BigNumber(maxValue);
    amount = new BigNumber(amount);
    if (isPercentage) {
      fee = fee.plus(amount.multipliedBy(value.dividedBy(100)));
      if (fee.isLessThan(minValue)) {
        fee = minValue;
      } else if (fee.isGreaterThan(maxValue)) {
        fee = maxValue;
      }
    } else {
      fee = fee.plus(value);
    }
    return fee;
  };
  const steps = [
    {
      header: "Select Method",
      content: (
        <>
          <Button
            className="btn btn-success waves-effect waves-light w-lg m-2 btn-sm"
            onClick={() => {
              dispatch(toggleCurrentModal("fiatDeposit"));
            }}
          >
            {props.t("Deposit Fiat")} <i className="mdi mdi-arrow-right"></i>
          </Button>
          <Button
            className="btn btn-success waves-effect waves-light w-lg m-2 btn-sm"
            onClick={() => {
              dispatch(toggleCurrentModal("cryptoDeposit"));
            }}
          >
            {props.t("Deposit Crypto")} <i className="mdi mdi-arrow-right"></i>
          </Button>
          <div className="my-4">
            <Form>
              <div className="mb-4">
                {/* <h6 className="mb-3">Select Currency</h6> */}
                <Col className="">
                  <Label className="form-label mb-3">{props.t("Select Currency")}</Label>
                  <WalletsListSelect
                    onChange={(e) => {
                      // console.log(e.value?._id);
                      setWalletId(e.value?._id);
                      setCurrancy(e.value?.asset);
                      setAsset(e.value?.asset);
                    }}
                    wllates={wallets.filter(x => !x.isCrypto)}
                  >
                  </WalletsListSelect>
                  {selectCurrancyError && (
                    <p className="small text-danger "> 
                      {props.t("Please Select Currency")}
                    </p>
                  )}
                </Col>
              </div>
              <div className="mb-4">
                <h6 className="mb-3">
                  {props.t("Select Payment Method")}
                  {selectGatwayError && (
                    <p className="small text-danger ">
                      {props.t("Please Select Payment Method")}
                    </p>
                  )}
                </h6>
                <Row className="justify-content-center justify-content-lg-between payment-methods">
                  <Col xs={4} lg={2} className="my-2">
                    <button
                      type="button"
                      onClick={() => {
                        setGateway("VISA");
                        setWireTransferFlag(false);
                      }}
                      className="btn btn-light waves-effect waves-light w-sm py-4"
                    >
                      <img
                        src="img/payment-method/visa.png"
                        width="100%"
                        height="100%"
                        alt=""
                      ></img>
                    </button>
                  </Col>
                  <Col xs={4} lg={2} className="my-2">
                    <button
                      type="button"
                      onClick={() => {
                        setGateway("MASTERCARD");
                        setWireTransferFlag(false);
                      }}
                      className="btn btn-light waves-effect waves-light w-sm py-4"
                    >
                      <img
                        src="img/payment-method/mastercard-1.png"
                        width="100%"
                        height="100%"
                        alt=""
                      ></img>
                    </button>
                  </Col>
                  <Col xs={4} lg={2} className="my-2">
                    <button
                      type="button"
                      onClick={() => {
                        setGateway("NETELLER");
                        setWireTransferFlag(false);
                      }}
                      className="btn btn-light waves-effect waves-light w-sm py-4"
                    >
                      <img
                        src="img/payment-method/neteller.png"
                        width="100%"
                        height="100%"
                        alt=""
                      ></img>
                    </button>
                  </Col>
                  <Col xs={4} lg={2} className="my-2">
                    <button
                      type="button"
                      onClick={() => {
                        setGateway("SKRILL");
                        setWireTransferFlag(false);
                      }}
                      className="btn btn-light waves-effect waves-light w-sm py-4"
                    >
                      <img
                        src="img/payment-method/skrill.png"
                        width="100%"
                        height="100%"
                        alt=""
                      ></img>
                    </button>
                  </Col>
                  <Col xs={4} lg={2} className="my-2">
                    <button
                      type="button"
                      onClick={() => {
                        setGateway("WIRE_TRANSFER");
                        setWireTransferFlag(true);
                      }}
                      className="btn btn-light waves-effect waves-light w-sm py-4"
                    >
                      <img
                        src="img/payment-method/wire-transfer.png"
                        width="100%"
                        height="100%"
                        alt=""
                      ></img>
                    </button>
                  </Col>
                </Row>
              </div>
              {(wireTransferFlag && Object.keys(CompanyBankAccountDetile).length) ? (
                <>
                  <h5 className="mb-4">{props.t("Payment details")}</h5>
                  <Label className="mb-2">{props.t("Bank Account")}</Label>
                  <div className="mb-3">
                    <InputGroup>
                      <InputGroupText className="w-100">{CompanyBankAccountDetile?.accountHolderName}</InputGroupText>
                      {/* <Input className="form-control " type="text" placeholder="Andrew" /> */}
                    </InputGroup>
                  </div>
                  <div className="mb-3">
                    <InputGroup>
                      <InputGroupText className="w-100">{CompanyBankAccountDetile?.bankName}</InputGroupText>
                      {/* <Input className="form-control border-start-0 text-end" type="text" placeholder="Andrew" /> */}
                    </InputGroup>
                  </div>
                  <div className="mb-3">
                    <InputGroup>
                      <InputGroupText className="w-100">
                        {CompanyBankAccountDetile?.accountNumber}
                      </InputGroupText>
                      {/* <Input className="form-control border-start-0 text-end" type="text" placeholder="54842222222221" /> */}
                    </InputGroup>
                  </div>
                  <div className="mb-3">
                    <InputGroup>
                      <InputGroupText className="w-100">
                        {CompanyBankAccountDetile?.address}
                      </InputGroupText>
                      {/* <Input className="form-control border-start-0 text-end" type="text" placeholder="079 Dariana Knoll, CA" /> */}
                    </InputGroup>
                  </div>
                  <div className="mb-3">
                    <InputGroup>
                      <InputGroupText className="w-100">{CompanyBankAccountDetile?.swiftCode}</InputGroupText>
                      {/* <Input className="form-control border-start-0 text-end" type="text" placeholder="UI8" /> */}
                    </InputGroup>
                  </div>
                  <div className="mb-3">
                    <InputGroup>
                      <InputGroupText className="w-100">
                        {CompanyBankAccountDetile?.currency}
                      </InputGroupText>
                      {/* <Input className="form-control border-start-0 text-end" type="text" placeholder="55416 Powlowski Spring, CA" /> */}
                    </InputGroup>
                  </div>
                  <p className="mb-2">{props.t("Bank Account")}</p>
                  <p className="text-muted">
                    {props.t("You MUST include the Reference Code in your deposit in order to credit your account!")}
                  </p>
                </>
              ) : gateway == "SKRILL" ||
                gateway == "NETELLER" ||
                gateway == "MASTERCARD" ? (
                  <>
                    <p className="text-muted">{props.t("")}{props.t("Enter card information.")}</p>
                    <Row>
                      <Col xs={12}>
                        <div className="mb-3">
                          <Label
                            htmlFor="example-date-input"
                            className="form-label"
                          >
                            {props.t("Name")}
                          </Label>
                          <Input
                            className="form-control"
                            type="text"
                            id="example-date-input"
                          />
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="mb-3">
                          <Label
                            htmlFor="example-date-input"
                            className="form-label"
                          >
                            {props.t("Card Number")}
                          </Label>
                          <Input
                            className="form-control"
                            type="text"
                            id="example-date-input"
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label
                            htmlFor="example-date-input"
                            className="form-label"
                          >
                            {props.t("Expiry date")}
                          </Label>
                          <Input
                            className="form-control"
                            type="date"
                            id="example-date-input"
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label
                            htmlFor="example-date-input"
                            className="form-label"
                          >
                            {props.t("Security Code (CVV)")}
                          </Label>
                          <Input
                            className="form-control"
                            type="text"
                            id="example-date-input"
                          />
                        </div>
                      </Col>
                    </Row>
                  </>
                ) : (
                  ""
                )}
              <div className="text-center mt-4">
                <Button
                  className="btn btn-success waves-effect waves-light w-lg btn-sm"
                  onClick={() => validateStep1()}
                >
                  {props.t("Continue")}
                </Button>
              </div>
            </Form>
          </div>
        </>
      ),
    },
    {
      header: "Enter Amount",
      content: (
        <>
          <h6 className="mb-3">{props.t("Enter Amount")}</h6>
          <div className="d-flex justify-content-between mb-2">
            <div>
              <Label htmlFor="example-date-input" className="form-label">
                {props.t("Amount")}
              </Label>
            </div>
            <div>
              {props.t("Transaction requirements")}
              <i className="fas fa-info-circle ms-2"></i>
            </div>
          </div>
          <InputGroup>
            <Input
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              className="form-control border-end-0"
              type="number"
              placeholder="Enter 15-128341"
            />
            <InputGroupText className="custom-input-group-text">
              {currancy}
            </InputGroupText>
          </InputGroup>

          {amountError && (
            <p className="small text-danger "> {props.t("Please Inter Amount")}</p>
          )}
          <div className="text-center fw-bolder mt-4 received-amount">
            <span className="fs-5">{currancy}</span>
            <span className="fs-1">{amount}</span>
          </div>
          {/* <div className="text-center mb-4">You receive:</div> */}
          <div className="mb-3">
            <Label className="form-label mb-2">{props.t("Transaction Fee")}</Label>
            <InputGroup className="">
              <InputGroupText className=" w-100">
                {transactionFee}{"   "}{asset}
              </InputGroupText>
              {/* <Input className="form-control border-start-0 text-end" type="text" placeholder="0.00 EUR" /> */}
            </InputGroup>
          </div>
          <div className="my-4 text-center">
            <Button
              className="btn btn-secondary m-2 btn-sm w-lg"
              onClick={() => toggleTab(0)}
            >
              {props.t("Previous")}
            </Button>
            <Button
              className="btn btn-success m-2 btn-sm w-lg"
              onClick={() => validateStep2()}
            >
              {props.t("Continue")}
            </Button>
          </div>
        </>
      ),
    },
    {
      header: "Deposit status",
      content: (
        <>
          {result.status ? (
            <>
              <div className="text-center  mb-4">
                <h1 className="fs-1 mb-5">
                  {props.t("Yay!")} <i className="bx bx-wink-smile"></i>
                </h1>
                <p>{props.t("Pending Deposit Thank You")}</p>
                <p>
                  <span className="positive">
                    {result?.result?.amount["$numberDecimal"]}
                    {currancy}
                  </span>
                </p>
              </div>
              <CardWrapper className="mb-4">
                <div className="d-flex align-items-center justify-content-around px-4">
                  <div>
                    <div className="text-muted">{props.t("Status")}</div>
                    <div className="positive">{props.t("gateway")}</div>
                  </div>
                  <div>
                    <div className="text-muted">{result.result?.status}</div>
                    <div>{result.result?.gateway}</div>
                  </div>
                </div>
              </CardWrapper> 
            </>
          ) : (
            <>
              <div className="text-center  mb-4">
                <h1 className="fs-1 mb-5">
                  {props.t("Oops!")} <i className="bx sad"></i>
                </h1>
                <p>{props.t("Your Deposit Request Not Successfully Created")}</p>
              </div>
              <CardWrapper className="mb-4">
                <div className="d-flex align-items-center justify-content-between px-5">
                  <div>
                    <div className="positive">{result.message}</div>
                  </div>
                </div>
              </CardWrapper>
            </>
          )}
          <div className="text-center">
            <Button
              className="btn btn-danger m-2 btn-sm w-lg"
              onClick={toggleOpen}
            >
              {props.t("Continue")}
            </Button>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <CustomModal
        steps={steps}
        isOpen={isOpen}
        toggleOpen={toggleOpen}
        activeStep={activeStep}
        toggleTab={toggleTab}
      ></CustomModal> 
    </>

  );
}
export default withTranslation()(FiatDeposit); 
