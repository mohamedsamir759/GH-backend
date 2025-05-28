import React from "react";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { 
  Card, CardBody, Col, Row 
} from "reactstrap";
import SpotOrders from "./SpotOrders";

function SpotOrdersIndex() {
  return (
    <React.Fragment>
      <MetaTags>
        <title>Spot Orders</title>
      </MetaTags>
      <div className="container-fluid">
        {/* <h2>Spot Orders</h2> */}
        <Row>
          <Col className="col-12">
            <Card>
              <CardBody>
                <SpotOrders />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  loading: state.dictionaryReducer.loading || false,
  dictionary: state.dictionaryReducer.dictionary || [],
  error: state.dictionaryReducer.error,
});

export default connect(mapStateToProps, null)(SpotOrdersIndex);
