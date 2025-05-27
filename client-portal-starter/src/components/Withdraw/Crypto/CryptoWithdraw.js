import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button, 
  Input,
  InputGroup,
  InputGroupText,
  Label, 
} from "reactstrap";
import { toggleCurrentModal } from "../../../store/actions";
import CardWrapper from "../../Common/CardWrapper";
import CustomModal from "../../Common/CustomModal";
import { addWithdrawCrypto } from "../../../apis/withdraw"; 
import WalletsListSelect from "components/Common/WalletsListSelect";
import  BigNumber  from "bignumber.js";
//i18n
import { withTranslation } from "react-i18next";

function CryptoWithdraw({ isOpen, toggleOpen, ...props }) {
  const [activeStep, setActiveStep] = useState(0);
  // const [wallets, setWallets] = useState([]);
  const wallets = useSelector((state) => state.wallets?.wallets);
  const [asset, setAsset] = useState("");
  const transActionfee = useSelector(
    (state) => state.Profile?.clientData?.transactionFeeId
  );
  const [transactionFee, setTransactionFee] = useState("");

  const [walletId, setWalletId] = useState("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(""); 
  // const [note, setNote] = useState("");
  const [result, setResult] = useState(""); 
  const [selectCurrancyError, setSelectCurrancyError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);
      setWalletId(""); 
      setAmount("");
      setAddress("");  
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
    addWithdrawCrypto({
      to: address,
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
    if (address == "") {
      setAddressError(true);
      setTimeout(() => {
        setAddressError(false);
      }, 2000);
    } 
    if (walletId != "" && address != "") {
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
          <div className="mb-4">
            <Button
              className="btn btn-danger waves-effect waves-light w-lg m-2 px-4"
              onClick={() => {
                dispatch(toggleCurrentModal("fiatWithdraw"));
              }}
            >
              {props.t("Withdraw Fiat")} <i className="mdi mdi-arrow-right"></i>
            </Button>
            <Button
              className="btn btn-danger waves-effect waves-light w-lg m-2 px-4"
              onClick={() => {
                dispatch(toggleCurrentModal("cryptoWithdraw"));
              }}
            >
              {props.t("Withdraw Crypto")} <i className="mdi mdi-arrow-right"></i>
            </Button>
          </div>
          <div className="mb-3">
            <InputGroup>
              <InputGroupText className="custom-input-group-text">
                {props.t("Available Balance")}  
              </InputGroupText>
              <Input
                className="form-control border-start-0 text-end"
                type="text"
                placeholder="100.41564897465132 USDT"
                disabled
              />
            </InputGroup>
          </div>
          <div className="mb-3"> 
            <Label className="form-label mb-3">{props.t("Select wallet")}</Label>
            <WalletsListSelect
              onChange={(e) => {
                // console.log(e.value?._id);
                setWalletId(e.value?._id);
                setAsset(e.value?.asset);
              }}
              wllates={wallets.filter(x => x.isCrypto)}
            >
            </WalletsListSelect>
            {selectCurrancyError && (
              <p className="small text-danger "> {props.t("Please Select Currency")}</p>
            )}
          </div>
          <div className="mb-3">
            <Label>{props.t("Enter Adress")}</Label>

            <input
              className="form-control "
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              type="text"
              placeholder={props.t("Enter Adress")}
            ></input>
            {addressError && (
              <p className="small text-danger "> 
                {props.t("Please Enter Adress")} 
              </p>
            )}
          </div>
          <div className="text-center mt-4">
            <Button
              className="btn btn-danger waves-effect waves-light w-lg btn-sm"
              onClick={() => validateStep1()}
            >
              {props.t("Continue")}
            </Button>
          </div>
        </>
      ),
    },
    {
      header: "Enter Amount",
      content: (
        <>
          {/* <div className="mt-4 mb-3">
                <InputGroup>
                    <InputGroupText className="custom-input-group-text">
                        Available Balance
                    </InputGroupText>
                    <Input className="form-control border-start-0 text-end" type="text" placeholder="100.41564897465132 USDT" />
                </InputGroup>
            </div> */}
          {/* <div className="mb-3">
            <Label className="form-label mb-2">Address</Label>
            <Input
              className="form-control"
              type="text"
              placeholder="100.41564897465132 USDT"
            />
            <span className="text-muted" style={{ fontSize: "10px" }}>
              Do not send Tether USD unless you are certain the destination
              supports TRC-20 transactions. If it does not, you could
              permanently lose access to your coins
            </span>
          </div> */}
          <div className="mb-3">
            <Label className="form-label mb-2">{props.t("Transaction Fee")}</Label>
            <InputGroup className="">
              <InputGroupText className=" w-100">
                {transactionFee}{"   "}{asset}
              </InputGroupText>
              {/* <Input className="form-control border-start-0 text-end" type="text" placeholder="0.00 EUR" /> */}
            </InputGroup>
          </div>
          <div className="mb-3">
            <Label>{props.t("Select Network")}</Label>
            <select
              className="form-select"
              onChange={( ) => {
                // setNetworkId(e.target.value);
              }}
            >
              <option value="">{props.t("select")}</option>
              <option value="default">Default</option>
              {/* {network?.map((network) => {
                    return (
                      <option key={network._id} value={network._id}>
                        {network.Name}
                      </option>
                    );
                  })} */}
            </select>
            {/* {selectBankError && (
                <p className="small text-danger ">
                  {" "}
                  Please Select Bank Account{" "}
                </p>
              )} */}
          </div>
          <div className="mb-3">
            <Label className="form-label mb-2">{props.t("Total Amount")}</Label>
            <Input
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              className="form-control "
              type="number"
              placeholder="0.00 USDT"
            />
            {amountError && (
              <p className="small text-danger "> {props.t("Please Inter Amount")}</p>
            )}
          </div>
          <div className="text-center">
            <Button
              className="btn btn-secondary m-2 btn-sm w-lg"
              onClick={() => toggleTab(0)}
            >
              {props.t("Previous")}
            </Button>
            <Button
              className="btn btn-danger m-2 btn-sm w-lg"
              onClick={() => validateStep2()}
            >
              {props.t("Continue")}
            </Button>
          </div>
        </>
      ),
    },
    {
      header: "Withdraw status",
      content: (
        <>
          <>
            {result.status ? (
              <>
                <div className="text-center  mb-4">
                  <h1 className="fs-1 mb-5">
                    {props.t("Yay!")} <i className="bx bx-wink-smile"></i>
                  </h1>
                  <p>{props.t("Your Withdrawal Request Has Been Created")} </p>
                  <p>
                    <span className="positive">100.00 USD</span> {props.t("from Bitcloud")}
                  </p>
                </div>
                <CardWrapper className="mb-4">
                  <div className="d-flex align-items-center justify-content-between px-5">
                    <div>
                      <div className="text-muted">{props.t("Status")}</div>
                      <div className="positive">{props.t("Completed")}</div>
                    </div>
                    <div>
                      <div className="text-muted">{props.t("Transaction ID")}</div>
                      <div>0msdsdsds.....787r639</div>
                    </div>
                  </div>
                </CardWrapper>
                <CardWrapper className="mb-5">
                  <div className="px-5">
                    <div className="text-muted">{props.t("Address")}</div>
                    <div>0asdasdasdasd0sad012312312312....4879465asdasd</div>
                  </div>
                </CardWrapper>
              </>
            ) : (
              <>
                <div className="text-center  mb-4">
                  <h1 className="fs-1 mb-5">
                    {props.t("Oops!")} <i className="bx sad"></i>
                  </h1>
                  <p>{props.t("Your Withdrawal Request Not Successfully Created")}</p>
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
          </>
          <div className="text-center">
            <Button
              className="btn btn-danger m-2 btn-sm w-lg"
              onClick={toggleOpen}
            >
              {props.t("Continue")}
            </Button>
          </div>
          {/* <div className="text-center">
                <Button className="btn btn-danger m-2 btn-sm w-lg" onClick={handleSubmit}>View Wallet</Button>
            </div> */}
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
export default withTranslation()(CryptoWithdraw); 
