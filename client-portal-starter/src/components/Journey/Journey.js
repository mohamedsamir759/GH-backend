import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import iconImage from "assets/images/icon-dash.png";
// import { fetchProfile } from "store/actions";
import SubmitIndvidualProfile from "./SubmitIndvidualProfile";
import UploadKycModal from "./UploadKycModal";
import StartTrading from "./StartTrading";
import FundNow from "./FundNow";
//i18n
import { withTranslation } from "react-i18next";
import {
  HIDE_JOU_KYC, HIDE_JOU_IND_PROFILE, HIDE_JOU_FUND, HIDE_JOU_TRADING
} from "common/data/jourenykeys";

const Journey = (props) => {
  const [showSubmitIndProfileModal, setShowSubmitIndProfileModal] = useState(false);
  const [showUploadKycModal, setShowUploadKycModal] = useState(false);
  const [showStartTradingModal, setShowStartTradingModal] = useState(false);
  const [stages, setStages] = useState({
    kycApproved: false,
    kycUpload: false,
    kycRejected: false,
    startTrading: false,
    individual: {
      submitProfile: false,
    },
    loaded: false,
  });
  useEffect(() => {
    if (props.stages && props.stages.kycUpload !== undefined) {
      setStages({
        ...stages,
        loaded: true,
        kycApproved: props.stages.kycApproved,
        kycUpload: props.stages.kycUpload,
        kycRejected: props.stages.kycRejected,
        startTrading: props.stages.startTrading,
        individual: {
          ...props.stages.individual,
          submitProfile: props.stages.individual && props.stages.individual.submitProfile,
        },
      });
    }
  }, [props.stages]);
  useEffect(() => {
    if (props.clientData && props.clientData.category === "LIVE") {
      if (props.stages && stages.loaded) {
        if (!stages.individual.submitProfile) {
          setShowSubmitIndProfileModal(true);
        }
        else if (!stages.kycUpload) {
          setShowSubmitIndProfileModal(false);
          setShowUploadKycModal(true);
        } else if (!stages.startTrading) {
          setShowSubmitIndProfileModal(false);
          setShowUploadKycModal(false);
          setShowStartTradingModal(true);
        }
      }
    } else {
      setShowStartTradingModal(true);
    }
    

  }, [stages, props.stages]);

  return (
    <div className='mb-5'>
      {props.clientData && props.clientData.category === "LIVE" && <React.Fragment>
        {/* {stages.kycApproved && stages.individual.submitProfile, stages.startTrading} */}
        <SubmitIndvidualProfile t={(str) => { return str }} show={showSubmitIndProfileModal} toggle={() => { setShowSubmitIndProfileModal(!showSubmitIndProfileModal); localStorage.setItem(HIDE_JOU_IND_PROFILE, true) }} />
        <UploadKycModal history={props.history} t={(str) => { return str }} show={showUploadKycModal} toggle={() => { setShowUploadKycModal(!showUploadKycModal); localStorage.setItem(HIDE_JOU_KYC, true) }} />
        <FundNow history={props.history} t={(str) => { return str }} show={showStartTradingModal} toggle={() => { setShowStartTradingModal(!showStartTradingModal); localStorage.setItem(HIDE_JOU_FUND, true) }} />
        <h1 className='mb-2'>{props.t("How it works")}</h1>
        <p className='text-muted'>{props.t("Get starded with 3 easy steps")}</p>
        <div className='steps mb-5'>
          <div className={stages.individual.submitProfile ? "steps-card steps-complete text-center" : "steps-card text-center"}>
            <div className='number'>1</div>
            <div className='steps-card-title-container mb-3'>
              <span className='steps-card-title'>
                {props.t("Sign up")}
                <span className='custom-border'></span>
              </span>
            </div>
            {/* <div className='steps-card-info'>
              {props.t("Nostrud sint laboris deserunt nisi. Sunt enim incididunt excepteur aliqua sint aliqua cillum. Nulla sint id sint sunt anim anim id. Veniam mollit veniam veniam fugiat esse.")}
            </div> */}
            {!stages.individual.submitProfile && <img onClick={() => { setShowSubmitIndProfileModal(true) }} src={iconImage} alt="icon" className='steps-card-icon'></img>}
          </div>
          <div className={stages.kycUpload ? "steps-card steps-complete text-center" : "steps-card text-center"}>
            <div className='number'>2</div>
            <div className='steps-card-title-container mb-3'>
              <span className='steps-card-title'>
                {props.t("Verify")}
                <span className='custom-border'></span>
              </span>
            </div>
            {/* <div className='steps-card-info'>
              {props.t("Nostrud sint laboris deserunt nisi. Sunt enim incididunt excepteur aliqua sint aliqua cillum. Nulla sint id sint sunt anim anim id. Veniam mollit veniam veniam fugiat esse.")}
            </div> */}
            {!stages.kycUpload && <img onClick={() => { setShowUploadKycModal(true) }} src={iconImage} alt="icon" className='steps-card-icon'></img>}
          </div>
          <div className={stages.startTrading ? "steps-card steps-complete text-center" : "steps-card text-center"}>
            <div className='number'>3</div>
            <div className='steps-card-title-container mb-3'>
              <span className='steps-card-title'>
                {props.t("Fund Now")}
                <span className='custom-border'></span>
              </span>
            </div>
            {/* <div className='steps-card-info'>
              {props.t("Nostrud sint laboris deserunt nisi. Sunt enim incididunt excepteur aliqua sint aliqua cillum. Nulla sint id sint sunt anim anim id. Veniam mollit veniam veniam fugiat esse.")}
            </div> */}
          </div>
        </div>
      </React.Fragment>}
      {props.clientData && props.clientData.category === "DEMO" && <React.Fragment>
        <StartTrading
          history={props.history}
          t={(str) => { return str }}
          show={showStartTradingModal}
          toggle={() => { setShowStartTradingModal(!showStartTradingModal); localStorage.setItem(HIDE_JOU_TRADING, true) }}
        />
      </React.Fragment>}
    </div>
  );
};

const mapStateToProps = (state) => ({
  stages: (state.Profile.clientData && state.Profile.clientData.stages) || {},
  clientData: state.Profile.clientData || {},
});
export default connect(mapStateToProps, null)(withTranslation()(Journey));