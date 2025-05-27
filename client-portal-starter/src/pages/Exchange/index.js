import React from "react";
import Chart from "./Chart";
import {
  Col, Container, Row 
} from "reactstrap";
import MetaTags from "react-meta-tags";
//i18n
import { withTranslation } from "react-i18next";

function Exchange(props) {
  return (
    <React.Fragment>
      <MetaTags>
        <title>{props.t("Exchange")}</title>
      </MetaTags>
      <Row>
        <Col xs={12} xl={3} className="left-col pb-5">
          <Container>
            <div className='pt-5'>
              <div>{props.t("Trade Widget")}</div>
              <div>{props.t("Wallet Data")}</div>
            </div>
          </Container>
        </Col>
        <Col xs={12} xl={6} className="left-col pb-5">
          <Container>
            <div className='pt-5'>
              <div>{props.t("Header")}</div>
              <div>{props.t("Order Book")}</div>
              <Chart />
              <div>{props.t("My Trade History Data")}</div>
            </div>
          </Container>
        </Col>
        <Col xs={12} xl={3} className="left-col pb-5">
          <Container>
            <div className='pt-5'>
              <div>{props.t("All Trade History Data")}</div>
            </div>
          </Container>
        </Col>
      </Row>
    </React.Fragment>
  );
}
export default withTranslation()(Exchange); 