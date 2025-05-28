import React, { useEffect, useState } from "react";
import { 
  Card, CardBody 
} from "reactstrap";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { Pie } from "react-chartjs-2";

import Loader from "components/Common/Loader";

const RemindersStats = (props) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(props.type === 0 ? props.todos : props.reminders);
  }, [props.todos, props.reminders]);

  const dataChart = {
    labels: ["Total Profit", "Fee Collected", "Markup Collected "],
    datasets: [
      {
        data: [50, 30, 20], // Values for each segment
        backgroundColor: ["#3F67A9", "#496798", "#6E86AF"],
      },
    ],
  };

  const options = {
    title: {
      display: true,
      // text: "My Pie Chart",
      fontSize: 16,
    },
  };


  return (
    <React.Fragment>
      <Card className="card-animate">
        <CardBody className="d-flex">
          <div className="mt-5 me-5 w-75">
            <div className="mt-5">
              <Pie data={dataChart} options={options} />
            </div>
          </div>

          <div className="mt-5 w-25 me-5">
            <div className="mt-5">
              <div>
                <h5>Total Profit</h5>
                <p className="ms-2">
                  <strong>0.1345 BTC = </strong> $ 4027
                </p>
              </div>

              <div className="mt-5">
                <h5>Fee Collected</h5>
                <p className="ms-2">
                  <strong>0.1345 BTC = </strong> $ 4027
                </p>
              </div>

              <div className="mt-5">
                <h5>Markup Collected </h5>
                <p className="ms-2">
                  <strong>0.1345 BTC = </strong> $ 4027
                </p>
              </div>

            </div>
          </div>

          {/* <Table className="table table-borderless mb-0">
            <tbody className="text-center">
              <tr>
                <th className="text-start" scope="row">
                  <Link to="dashboard">{props.t("Total Profit")}</Link>
                </th>
                <td>0</td>
              </tr>
              <tr>
                <th className="text-start" scope="row">
                  <Link to="dashboard">{props.t("Fee Collected")}</Link>
                </th>
                <td>0</td>
              </tr>

              <tr>
                <th className="text-start" scope="row">
                  <Link to="dashboard">{props.t("Markup Collected")}</Link>
                </th>
                <td>0</td>
              </tr>

              <tr>
                <th className="text-start" scope="row">
                  <Link to="dashboard">{props.t("Total No of Users")}</Link>
                </th>
                <td>0</td>
              </tr>

              <tr>
                <th className="text-start" scope="row">
                  <Link to="dashboard">{props.t("Total No of Deposits")}</Link>
                </th>
                <td>0</td>
              </tr>

              <tr>
                <th className="text-start" scope="row">
                  <Link to="dashboard">{props.t("No of users with open positions")}</Link>
                </th>
                <td>0</td>
              </tr>

              <tr>
                <th className="text-start" scope="row">
                  <Link to="dashboard">No of users who deposited first time</Link>
                </th>
                <td>0</td>
              </tr>

              <tr>
                <th className="text-start" scope="row">
                  <Link to="dashboard">{props.t("Giveaway/Bonus Given")}</Link>
                </th>
                <td>0</td>
              </tr>

              <tr>
                <th className="text-start" scope="row">
                  <Link to="dashboard">{props.t("Total Withdrawal")}</Link>
                </th>
                <td>0</td>
              </tr>

              
              <tr>
                <th className="text-start" scope="row">
                  <Link to="dashboard">{props.t("Total Deposit")}</Link>
                </th>
                <td>0</td>
              </tr>

              
              <tr>
                <th className="text-start" scope="row">
                  <Link to="dashboard">{props.t("Total Net Deposit")}</Link>
                </th>
                <td>0</td>
              </tr>
              
            </tbody>
          </Table> */}
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  reminders:
    (state.todosReducer.reminders && state.todosReducer.reminders.docs) || [],
  todos: (state.todosReducer.todos && state.todosReducer.todos.docs) || [],
  loading: state.todosReducer.loading || false,
});

export default connect(
  mapStateToProps,
  null
)(withTranslation()(RemindersStats));
