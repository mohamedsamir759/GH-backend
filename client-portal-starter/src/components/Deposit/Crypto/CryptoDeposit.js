import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Col,
  Form,
} from "reactstrap";
import { fetchWallets, toggleCurrentModal } from "../../../store/actions";
import CustomModal from "../../Common/CustomModal"; 
import QRCode from "qrcode.react"; 
import WalletsListSelect from "components/Common/WalletsListSelect";

import { withTranslation } from "react-i18next";

function CryptoDeposit({ isOpen, toggleOpen, ...props }) {
  const wallets = useSelector((state) => state.wallets?.wallets);

  const [activeStep, setActiveStep] = useState(0);
  const [walletPuk, setWalletPuk] = useState("");

  const dispatch = useDispatch();
  function toggleTab(tab) {
    if (activeStep !== tab) {
      setActiveStep(tab);
    }
  }
  const loadWallets = () => {
    dispatch(fetchWallets({
      limit: 100,
      page: 1
    }));
  };

  useEffect(() => {
    loadWallets();
    // console.log(wallets);
  }, []);
  const steps = [
    {
      header: "Select Method",
      content: (
        <>
          <Button
            className="btn btn-success waves-effect waves-light btn-sm w-lg m-2 px-4"
            onClick={() => {
              dispatch(toggleCurrentModal("fiatDeposit"));
            }}
          >
            Deposit Fiat<i className="mdi mdi-arrow-right"></i>
          </Button>
          <Button
            className="btn btn-success waves-effect waves-light btn-sm w-lg m-2 px-4"
            onClick={() => {
              dispatch(toggleCurrentModal("cryptoDeposit"));
            }}
          >
            Deposit Crypto <i className="mdi mdi-arrow-right"></i>
          </Button>
          <div className="my-4">
            <Form>
              <div className="mb-4">
                <h6 className="mb-3">{props.t("Select Coin")}</h6>
                <Col className="ms-2">
                  {/* <Label className="form-label mb-3">{props.t("Select wallet")}</Label> */}
                  <WalletsListSelect
                    onChange={(e) => {
                      // console.log(e.value?._id);
                      setWalletPuk(e.value?.puk);
                    }}
                    wllates={wallets.filter(x => x.isCrypto)}
                  >
                  </WalletsListSelect>
                </Col>
              </div>
              <h6 className="mb-3">{props.t("Address")}</h6>
              <div className="mb-4 text-center">
                <p
                  className="fw-bold text-muted my-4"
                  style={{ wordWrap: "break-word" }}
                >
                  {walletPuk != "" ? walletPuk : props.t("Select wallet")}
                  <i
                    className="mdi mdi-file-document-multiple-outline ms-2"
                    onClick={() => {
                      navigator.clipboard.writeText(walletPuk);
                    }}
                  ></i>
                </p>
                <p className="my-4">
                  {props.t("Scan the code on the withdrawl page of the trading platform APP or wallet APP")}
                </p>
                { }
                <QRCode size={300} value={walletPuk} renderAs="canvas" />
              </div>
              <div className="ms-5">
                <p>{props.t("Send only BTC to this deposit address.")}</p>
                <p>{props.t("Ensure the network is Bitcoin.")}</p>
                <p>
                  {props.t("Do not send NFT to this address. Learn how to deposit NFTs")}
                </p>
              </div>
              <div className="text-center mt-4">
                <Button
                  className="btn btn-success waves-effect waves-light w-lg btn-sm"
                  onClick={() => toggleOpen()}
                >
                  {props.t("Continue")}
                </Button>
              </div>
            </Form>
          </div>
        </>
      ),
    },
  ];
  // { header: "Copy Address", content: <>No design</> }]
  return (
    <CustomModal
      steps={steps}
      isOpen={isOpen}
      toggleOpen={toggleOpen}
      activeStep={activeStep}
      toggleTab={toggleTab}
    ></CustomModal>
  );
}
export default withTranslation()(CryptoDeposit); 
