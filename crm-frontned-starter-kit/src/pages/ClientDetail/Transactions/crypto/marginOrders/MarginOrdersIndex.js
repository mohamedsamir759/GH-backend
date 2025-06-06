import React from "react";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { 
  Card, CardBody, Col, Row 
} from "reactstrap";
import MarginOrders from "./MarginOrders";

function MarginOrdersIndex() {
  return (
    <React.Fragment>
      <MetaTags>
        <title>Margin Orders</title>
      </MetaTags>
      <div className="container-fluid">
        <Row>
          <Col className="col-12">
            <Card>
              <CardBody>
                <MarginOrders />
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

export default connect(mapStateToProps, null)(MarginOrdersIndex);
