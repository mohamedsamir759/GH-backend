import React from "react";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { 
  Card, CardBody, Col, Row 
} from "reactstrap";
import FuturesOrders from "./FuturesOrders";

function FuturesOrdersIndex() {
  return (
    <React.Fragment>
      <MetaTags>
        <title>
        Futures Orders
        </title>
      </MetaTags>
      <div className="container-fluid">
        {/* <h2>Futures Orders</h2> */}
        <Row>
          <Col className="col-12">
            <Card>
              <CardBody>
                <FuturesOrders />
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

export default connect(mapStateToProps, null)(FuturesOrdersIndex);
