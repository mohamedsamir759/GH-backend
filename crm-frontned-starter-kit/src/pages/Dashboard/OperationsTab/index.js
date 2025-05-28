import React, { useEffect } from "react";
import { Row, Col } from "reactstrap";

import CountriesMap from "./CountriesMap";
import Reminders from "./Reminders";
import Requests from "./Requests";
import TotalUsers from "./TotalUsers";
import NewUser from "./NewUser";
import KYC from "./KYC";
import TransactionsStats from "./TransactionsStats/";
import IndexTabDashboard from "./IndexTabDashboard";
import ActiveUser from "./ActiveUser";
import CardsDetails from "./CardsDetails";
import { useDispatch } from "react-redux";
import { fetchOperationStagesStatsStart } from "store/actions";

const OperationsTab = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchOperationStagesStatsStart({}));
  }, []);
  
  return (
    <>
      <Row className="col-card-same-height">
        <Col xl={6} xs={12} className="col mb-4">
          <CountriesMap />
        </Col>
        <Col xl={6} xs={6} className="col mb-4">
          <Reminders />
        </Col>

      </Row>

      <Row className="col-card-same-height">
        <Col sm={12} xs={12} xl={12} className="col mb-4">
          <CardsDetails />
        </Col>
      </Row>
      <Row className="col-card-same-height">
        {/* <Col xl={6} xs={12} className="col mb-4">
          <Requests />
        </Col> */}
        <Col sm={12} xs={12} xl={12} className="col mb-4">
          <IndexTabDashboard />
        </Col>
        {/* <Col xl={3} xs={6} className="col mb-4">
          <Leads />
        </Col>
        <Col xl={3} xs={6} className="col mb-4">
          <Clients />
        </Col> */}
      </Row>
      {/* <Row className="col-card-same-height">
        <Col sm={6} xs={12} className="col mb-4">
          <Card className="card-animate">
            <CardBody>
              <CardTitle>
                <h5>{("Deposits, Withdrawals and Transfers ")}</h5>
                <div className="btn-group btn-group-sm mt-2" role="group" aria-label="Basic example">
                  <button type="button" className={"btn btn-info" }  >Week</button>
                  <button type="button" className={"btn btn-info" }  >Month</button>
                  <button type="button" className={"btn btn-primary"} >Year</button>
                </div>
              </CardTitle>
              <CardSubtitle className="mb-3">
              </CardSubtitle>
              <ReactApexChart
                options={
                  {
                    chart: {
                      height: 400,
                      type: "line",
                      dropShadow: {
                        enabled: false,
                        color: "#000",
                        top: 18,
                        left: 7,
                        blur: 10,
                        opacity: 0.2
                      },
                      toolbar: {
                        show: true
                      }
                    },
                    colors: ["#21C78F", "#B11233", "#0D86D5"],
                    dataLabels: {
                      enabled: true,
                    },
                    stroke: {
                      curve: "smooth"
                    },
                    markers: {
                      size: 1
                    },
                    xaxis: {
                      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
                      title: {
                        text: "Month"
                      }
                    },
                    yaxis: {
                      title: {
                        text: "Amount"
                      },
                      min: 5,
                      max: 40
                    },
                    legend: {
                      position: "top",
                      horizontalAlign: "right",
                      floating: true,
                      offsetY: -25,
                      offsetX: -5
                    }
                  }}
                series={[
                  {
                    name: "Deposits",
                    data: [2, 29, 33, 36, 32, 32, 33]
                  },
                  {
                    name: "Transfers",
                    data: [10, 15, 5, 15, 18, 25, 25]
                  },
                  {
                    name: "Withdrawals",
                    data: [12, 11, 14, 18, 17, 13, 13]
                  }]}
                type="line"
                height={400}
              />
            </CardBody>
          </Card>
        </Col>
        <Col sm={6} className="col mb-4">
          <Card className="card-animate">
            <CardBody>
              <CardTitle>
                <h5>{("IB Summary")}</h5>
                <div className="btn-group btn-group-sm mt-2" role="group" aria-label="Basic example">
                  <button type="button" className={"btn btn-info" }  >Week</button>
                  <button type="button" className={"btn btn-info" }  >Month</button>
                  <button type="button" className={"btn btn-primary"} >Year</button>
                </div>
              </CardTitle>
              <CardSubtitle className="mb-3">
              </CardSubtitle>
              <ReactApexChart
                options={
                  {
                    chart: {
                      height: 400,
                      type: "line",
                      dropShadow: {
                        enabled: false,
                        color: "#000",
                        top: 18,
                        left: 7,
                        blur: 10,
                        opacity: 0.2
                      },
                      toolbar: {
                        show: true
                      }
                    },
                    colors: ["#21C78F", "#B11233", "#0D86D5"],
                    dataLabels: {
                      enabled: true,
                    },
                    stroke: {
                      curve: "smooth"
                    },
                    markers: {
                      size: 1
                    },
                    xaxis: {
                      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
                      title: {
                        text: "Month"
                      }
                    },
                    legend: {
                      position: "top",
                      horizontalAlign: "right",
                      floating: true,
                      offsetY: -25,
                      offsetX: -5
                    }
                  }}
                series={[
                  {
                    name: "No. of IBs",
                    data: [1, 3, 8, 15, 32, 64, 128]
                  },
                  {
                    name: "Rebate",
                    data: [1, 20, 120, 200, 680, 2890, 9504]
                  },
                  {
                    name: "Commission",
                    data: [1, 15, 100, 250, 700, 3450, 8540]
                  }]}
                type="line"
                height={400}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row className="col-card-same-height">
        <Col sm={6} xs={12} className="col mb-4">
          <Card className="card-animate">
            <CardBody>
              <CardTitle>
                <h5>{("All Trades ")}</h5>
                <div className="btn-group btn-group-sm mt-2" role="group" aria-label="Basic example">
                  <button type="button" className={"btn btn-info" }  >Week</button>
                  <button type="button" className={"btn btn-info" }  >Month</button>
                  <button type="button" className={"btn btn-primary"} >Year</button>
                </div>
              </CardTitle>
              <CardSubtitle className="mb-3">
              </CardSubtitle>
              <ReactApexChart
                options={
                  {
                    chart: {
                      height: 400,
                      type: "area"
                    },
                    colors: ["#21C78F", "#B11233"],
                    dataLabels: {
                      enabled: true
                    },
                    stroke: {
                      curve:  "smooth"
                    },
                    xaxis: {
                      type: "datetime",
                      categories: ["2023-01-23T00:00:00.000Z", "2023-02-23T01:30:00.000Z", "2023-03-23T02:30:00.000Z", "2023-04-23T03:30:00.000Z", "2023-05-23T04:30:00.000Z", "2023-06-19T05:30:00.000Z", "2023-07-19T06:30:00.000Z"],
                    },
                    tooltip: {
                      x: {
                        format: "dd/MM/yy HH:mm"
                      },
                    },
                  }}
                series={[
                  {
                    name: "Open Trades",
                    data: [0, 2, 10, 15, 42, 109, 100]
                  }, {
                    name: "Closed Trades",
                    data: [0, 1, 4, 12, 34, 52, 41]
                  }]}
                type="area"
                height={400}
              />
            </CardBody>
          </Card>
        </Col>
        <Col sm={6} className="col mb-4">
          <Card className="card-animate">
            <CardBody>
              <CardTitle>
                <h5>{("Profits")}</h5>
                <div className="btn-group btn-group-sm mt-2" role="group" aria-label="Basic example">
                  <button type="button" className={"btn btn-info" }  >Week</button>
                  <button type="button" className={"btn btn-info" }  >Month</button>
                  <button type="button" className={"btn btn-primary"} >Year</button>
                </div>
              </CardTitle>
              <CardSubtitle className="mb-3">
              </CardSubtitle>
              <ReactApexChart
                options={
                  {
                    chart: {
                      height: 350,
                      type: "bar",
                    },
                    plotOptions: {
                      bar: {
                        borderRadius: 10,
                        dataLabels: {
                          position: "top", // top, center, bottom
                        },
                      }
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: function (val) {
                        return val + "%";
                      },
                      offsetY: -20,
                      style: {
                        fontSize: "12px",
                        colors: ["#304758"]
                      }
                    },
                    
                    xaxis: {
                      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                      position: "top",
                      axisBorder: {
                        show: false
                      },
                      axisTicks: {
                        show: false
                      },
                      crosshairs: {
                        fill: {
                          type: "gradient",
                          gradient: {
                            colorFrom: "#D8E3F0",
                            colorTo: "#BED1E6",
                            stops: [0, 100],
                            opacityFrom: 0.4,
                            opacityTo: 0.5,
                          }
                        }
                      },
                      tooltip: {
                        enabled: true,
                      }
                    },
                    yaxis: {
                      axisBorder: {
                        show: false
                      },
                      axisTicks: {
                        show: false,
                      },
                      labels: {
                        show: false,
                        formatter: function (val) {
                          return val + "%";
                        }
                      }
                    
                    }
                  }}
                series={[
                  {
                    name: "Profit",
                    data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
                  }]}
                type="bar"
                height={400}
              />
            </CardBody>
          </Card>
        </Col>
      </Row> */}
      <Row className="col-card-same-height">
        <Col xl={3} xs={6} className="col mb-4">
          <TotalUsers />
        </Col>
        <Col xl={3} xs={6} className="col mb-4">
          <NewUser />
        </Col>
        <Col xl={3} xs={6} className="col mb-4">
          <ActiveUser />
        </Col>
        <Col sm={3} xs={6} className="col mb-4">
          <KYC />
        </Col>
      </Row>
    </>
  );
};

export default OperationsTab;