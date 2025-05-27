import React from "react";
import { connect } from "react-redux";
import {
  CardBody, CardHeader, CardTitle, Modal, Button, Card
} from "reactstrap";
//i18n
import { withTranslation } from "react-i18next";

const SubmitProfile = (props) => {

  return (<React.Fragment>
    <Modal
      isOpen={props.show}
      toggle={() => props.toggle()}
      centered={true}
      //   size="lg"
      className='custom-modal'
    >
      <Card>
        <CardHeader className="d-flex flex-column gap-3">
          <div className="text-center">
            <CardTitle className="mb-0">{props.t("Upload Your KYC")}</CardTitle>
          </div>
        </CardHeader>
        <CardBody>
          <h4 className="m-5 text-center">{props.t("Upload your documents")}</h4>
          <div className="text-center">
            <Button onClick={props.toggle} color="danger" className="w-lg waves-effect waves-light m-2">
              {props.t("Skip")}
            </Button>
            <Button onClick={() => { props.history.push("/documents") }} color="success" className="w-lg waves-effect waves-light m-2">
              {props.t("Continue")}
            </Button>
          </div>
        </CardBody>
      </Card> 
    </Modal>
  </React.Fragment>);
};

const mapStateToProps = (state) => ({
  profile: state.Profile && state.Profile.clientData || {},
});
export default connect(mapStateToProps, null)(withTranslation()(SubmitProfile)); 