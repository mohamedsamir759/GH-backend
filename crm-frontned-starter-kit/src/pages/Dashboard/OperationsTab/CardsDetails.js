import React, { useEffect, useState } from "react";
import { 
  Card, CardBody, Col, Row 
} from "reactstrap";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import img from "../../../assets/images/projecttt.PNG";
import ChartsState from "./ChartsState";
const CardDeatils = (props) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    console.log("props?.operations", props?.operationStats, props?.operationStats?.total_users, props?.operationStats?.total_users?.map(user=>user?.count));
    // setData(props.type === 0 ? props.todos : props.reminders);
  }, [props?.operationStats]);

  return (
    <React.Fragment>
      <Row>
        <Col md="3">
          <Card className="card-animate">
            <CardBody>
              <Row>
                <Col md="7">
                  <div className="mt-3">
                    <h6>Total Of No Users</h6>
                    <h4 className="mt-3">
                      <strong>{props?.operationStats?.total_users_count}</strong>
                    </h4>

                    <div className="d-flex mt-3">
                      {/* <strong>+$20.9k</strong> */}
                      <p className="ms-2">Since Last Week</p>
                    </div>
                  </div>
                </Col>
                <Col md="5">
                  <div >
                    <ChartsState seriesTitle="Users" seriesData={props?.operationStats?.total_users?.map(item=>item?.count)}/>
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
                    <h6>Total Of No Deposits</h6>
                    <h4 className="mt-3">
                      <strong>{props?.operationStats?.total_deposits_count}</strong>
                    </h4>

                    <div className="d-flex mt-3">
                      {/* <strong>+$20.9k</strong> */}
                      <p className="ms-2">Since Last Week</p>
                    </div>
                  </div>
                </Col>
                <Col md="5">
                  <div >
                    <ChartsState seriesTitle="Deposits" seriesData={props?.operationStats?.total_deposits?.map(item=>item?.count?.$numberDecimal)}/>
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
                    <h6>No Of Users With Open Positions</h6>
                    <h4 className="mt-3">
                      <strong>$800k</strong>
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
                    <h6>No Of users who deposited</h6>
                    <h4 className="mt-3">
                      <strong>{props?.operationStats?.total_deposits_count_first_time}</strong>
                    </h4>

                    <div className="d-flex mt-3">
                      {/* <strong>+$20.9k</strong> */}
                      <p className="ms-2">Since Last Week</p>
                    </div>
                  </div>
                </Col>
                <Col md="5">
                  <div >
                    <ChartsState seriesTitle="Deposits" seriesData={props?.operationStats?.total_deposits_first_time?.map(item=>item?.count)}/>
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
  operationStats: (state.dashboardReducer?.operationStats && state.dashboardReducer?.operationStats) || [],
  loading: state.todosReducer.loading || false,
});

export default connect(mapStateToProps, null)(withTranslation()(CardDeatils));
