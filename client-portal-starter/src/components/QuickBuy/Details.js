import CardWrapper from "components/Common/CardWrapper";
import CustomModal from "components/Common/CustomModal";
import { getAssetImgSrc } from "helpers/assetImgSrc";
import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { 
  Button, Col, Row
} from "reactstrap";
function Details({ isOpen, toggleOpen, market, ...props }) {
  console.log(market);
  const [activeStep, setActiveStep] = useState(0);
  function toggleTab(tab) {
    if (activeStep !== tab) {
      setActiveStep(tab);
    }
  }
  const steps = [
    {
      header: "Quick status",
      content: (
        <>
          <>
            <div className="text-center  mb-4">
              <h1 className="fs-1 mb-5">
                {props.t("Success!")} <i className="bx sad"></i>
              </h1>
              <p>{props.t("Your Order Request Is Successfully Placed")}</p>
            </div>
            <CardWrapper className="mb-4">
              <Row className="align-items-center justify-content-end">
                <Col lg={6}>
                  <div className="wallets__total">
                    <div className="wallets__title h6">{props.t("From")}</div>
                    <div className="total-balance-container">
                      <div className="wallets__number ">{market.baseAmount}</div>
                      <img src={`images/logo/${market.baseAsset}.svg`} alt="bitcoinlogo"></img>
                    </div>
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="wallets__total">
                    <div className="wallets__title h6">{props.t("To")}</div>
                    <div className="total-balance-container">
                      <div className="wallets__number ">{market.quoteAmount}</div>
                      <img src={`images/logo/${market.quoteAsset}.svg`} alt="bitcoinlogo"></img>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardWrapper>
          </>
          <div className="text-center">
            <Button
              className="btn btn-success m-2 btn-sm w-lg"
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
    <CustomModal
      steps={steps}
      isOpen={isOpen}
      toggleOpen={toggleOpen}
      activeStep={activeStep}
      toggleTab={toggleTab}
    ></CustomModal>
  );
}


export default withTranslation()(Details); 
