import React, { useEffect, useState } from "react";
import { 
  Card, CardBody, Col, Row 
} from "reactstrap";
import { connect, useSelector } from "react-redux";
import { withTranslation } from "react-i18next";
import img from "../../assets/images/projecttt.PNG";
import ChartsState from "pages/Dashboard/OperationsTab/ChartsState";
const ClientDeatilsCards = (props) => {
  const [data, setData] = useState([]);
  const {
    clientStatistics,
    clientProfileloading,
    clients,
  } = useSelector(state => state.clientReducer);
  useEffect(() => {
    console.log("clientStatisticsclientStatistics", clientStatistics);
  }, [clientStatistics]);
  return (
    <React.Fragment>
      <Row>
        <Col md="3">
          <Card className="card-animate">
            <CardBody>
              <Row>
                <Col md="7">
                  <div className="mt-3">
                    <h6>Total Balance</h6>
                    <h4 className="mt-3">
                      <strong>{clientStatistics?.total_transactions_count}</strong>
                      
                      {/* <strong>$500k</strong> */}
                    </h4>

                    <div className="d-flex mt-3">
                      {/* <strong>+$20.9k</strong> */}
                      <p className="ms-2">Since Last Week</p>
                    </div>
                  </div>
                </Col>
                <Col md="5">
                  <div >
                    <ChartsState seriesTitle="Balance" seriesData={clientStatistics?.total_transactions?.map(item=>item?.count?.$numberDecimal)}/>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col md="3">
          <Card className="card-animate">
            <CardBody>
              <Row>
                <Col md="7">
                  <div className="mt-3">
                    <h6>Total Profit</h6>
                    <h4 className="mt-3">
                      <strong>$400k</strong>
                    </h4>

                    <div className="d-flex mt-3">
                      <strong>+$20.9k</strong>
                      <p className="ms-2">Since Last Week</p>
                    </div>
                  </div>
                </Col>
                <Col md="5">
                  <div >
                    <ChartsState/>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col md="3">
          <Card className="card-animate">
            <CardBody>
              <Row>
                <Col md="7">
                  <div className="mt-3">
                    <h6>Total Bonus</h6>
                    <h4 className="mt-3">
                      <strong>{clientStatistics?.total_bounses_count}</strong>
                    </h4>

                    <div className="d-flex mt-3">
                      {/* <strong>+$20.9k</strong> */}
                      <p className="ms-2">Since Last Week</p>
                    </div>
                  </div>
                </Col>
                <Col md="5">
                  <div >
                    <ChartsState seriesTitle="Bouns" seriesData={clientStatistics?.total_bounses?.map(item=>item?.count)}/>
                    {/* <ChartsState/> */}
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col md="3">
          <Card className="card-animate">
            <CardBody>
              <Row>
                <Col md="7">
                  <div className="mt-3">
                    <h6>User PNL</h6>
                    <h4 className="mt-3">
                      <strong>$500k</strong>
                    </h4>

                    <div className="d-flex mt-3">
                      <strong>+$20.9k</strong>
                      <p className="ms-2">Since Last Week</p>
                    </div>
                  </div>
                </Col>
                <Col md="5">
                  <div >
                    <ChartsState/>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col md="3">
          <Card className="card-animate">
            <CardBody>
              <Row>
                <Col md="7">
                  <div className="mt-3">
                    <h6>Last Login</h6>

                    <div className="d-flex mt-3">
                      <strong>{clientStatistics?.last_login?.date}</strong>
                    </div>
                  </div>
                </Col>
                <Col md="5">
                  <div >
                    <ChartsState/>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col md="3">
          <Card className="card-animate">
            <CardBody>
              <Row>
                <Col md="7">
                  <div className="mt-3">
                    <h6>Open Orders</h6>
                    <h4 className="mt-3">
                      <strong>{clientStatistics?.total_open_orders_count}</strong>
                    </h4>

                    <div className="d-flex mt-3">
                      {/* <strong>+$20.9k</strong> */}
                      <p className="ms-2">Since Last Week</p>
                    </div>
                  </div>
                </Col>
                <Col md="5">
                  <div >
                    <ChartsState seriesTitle="Orders" seriesData={clientStatistics?.total_open_orders?.map(item=>item?.count)}/>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col md="3">
          <Card className="card-animate">
            <CardBody>
              <Row>
                <Col md="7">
                  <div className="mt-3">
                    <h6>Fees Collected</h6>
                    <h4 className="mt-3">
                      <strong>$600k</strong>
                    </h4>

                    <div className="d-flex mt-3">
                      <strong>+$20.9k</strong>
                      <p className="ms-2">Since Last Week</p>
                    </div>
                  </div>
                </Col>
                <Col md="5">
                  <div >
                    <ChartsState/>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col md="3">
          <Card className="card-animate">
            <CardBody>
              <Row>
                <Col md="7">
                  <div className="mt-3">
                    <h6>Total Deposited</h6>
                    <h4 className="mt-3">
                      <strong>{clientStatistics?.total_deposits_count}</strong>
                    </h4>

                    <div className="d-flex mt-3">
                      {/* <strong>+$20.9k</strong> */}
                      <p className="ms-2">Since Last Week</p>
                    </div>
                  </div>
                </Col>
                <Col md="5">
                  <div >
                    <ChartsState seriesTitle="Deposited" seriesData={clientStatistics?.total_deposits?.map(item=>item?.count?.$numberDecimal)}/>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col md="3">
          <Card className="card-animate">
            <CardBody>
              <Row>
                <Col md="7">
                  <div className="mt-3">
                    <h6>Total Withdrawn</h6>
                    <h4 className="mt-3">                      
                      <strong>{clientStatistics?.total_withdraws_count}</strong>
                      {/* <strong>$800k</strong> */}
                    </h4>

                    <div className="d-flex mt-3">
                      {/* <strong>+$20.9k</strong> */}
                      <p className="ms-2">Since Last Week</p>
                    </div>
                  </div>
                </Col>
                <Col md="5">
                  <div >
                    <ChartsState seriesTitle="Withdrawn" seriesData={clientStatistics?.total_withdraws?.map(item=>item?.count?.$numberDecimal)}/>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col md="3">
          <Card className="card-animate">
            <CardBody>
              <Row>
                <Col md="7">
                  <div className="mt-3">
                    <h6>Net Balance</h6>
                    <h4 className="mt-3">
                      <strong>{clientStatistics?.total_net_amount_count}</strong>
                      {/* <strong>$200k</strong> */}
                    </h4>

                    <div className="d-flex mt-3">
                      <p className="ms-2">Since Last Week</p>
                    </div>
                  </div>
                </Col>
                <Col md="5">
                  <div >
                    <ChartsState seriesTitle="Net" seriesData={clientStatistics?.total_net_amount?.map(item=>item?.count)}/>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

      </Row>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  reminders:
    (state.todosReducer.reminders && state.todosReducer.reminders.docs) || [],
  todos: (state.todosReducer.todos && state.todosReducer.todos.docs) || [],
  loading: state.todosReducer.loading || false,
});

export default connect(mapStateToProps, null)(withTranslation()(ClientDeatilsCards));