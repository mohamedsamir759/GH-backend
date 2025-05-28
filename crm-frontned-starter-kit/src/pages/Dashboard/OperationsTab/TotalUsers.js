import React from "react";
// eslint-disable-next-line object-curly-newline
import { Card, CardBody, CardTitle, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import moment from "moment";

const TotalUsers = (props) => {
  return (
    <React.Fragment>
      <Card className="card-animate">
        <CardBody>
          <CardTitle className="color-primary">
            <h5 className="color-primary">{props.t("Total Users")}</h5>
          </CardTitle>
          <Row className="col-card-same-height mt-5">
            <Col
              xs={12}
              className="col"
            >
              <Row>
                <Link>
                  <Col sm={12} className="d-flex align-items-center">
                    <div className="circle-stat">
                      0
                    </div>
                    {props.t("All")}
                  </Col>
                </Link>
              </Row>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};
const mapStateToProps = (state) => ({
  leadsStats: state.dashboardReducer.leadsStats || {},
  newDays: state.Profile.newDays || 7,
});

export default connect(mapStateToProps, null)(withTranslation()(TotalUsers));
