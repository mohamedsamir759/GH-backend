/* eslint-disable indent */
import React, { useEffect, useState } from "react";
import { useDispatch, connect } from "react-redux";

import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  Spinner,
} from "reactstrap";

// eslint-disable-next-line object-curly-newline
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

import { getSalesAgentsStart } from "store/users/actions";

import { MetaTags } from "react-meta-tags";

import ReportForm from "./ReportForm";
import TableLoader from "components/Common/TableLoader";
import formatDate from "helpers/formatDate";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import * as axiosHelper from "../../apis/api_helper";

function getColumns(reportType) {
  switch (reportType) {
    case "client-deposits":
    case "client-withdrawals":
      return [
        {
          dataField: "name",
          text: "Client Name",
          formatter: (val) =>
            val?.firstName
              ? (
                  <Link
                    to={`/clients/${val?._id}/profile`}
                  >{`${val?.firstName} ${val?.lastName}`}</Link>
                ) || "-"
              : "-",
        },
        {
          dataField: "agent",
          text: "Agent",
          formatter: (val) =>
            val?.agent ? `${val.agent.firstName} ${val.agent.lastName}` : "-",
        },
        {
          dataField: "fxSum",
          text: `Fx ${reportType === "client-deposits" ? "Deposit" : "Withdrawal"}`,
          formatter: (val) => val?.fxSum?.$numberDecimal ?? val?.fxSum ?? "-",
        },
        {
          dataField: "walletSum",
          text: `Wallet ${reportType === "client-deposits" ? "Deposit" : "Withdrawal"}`,
          formatter: (val) =>
            val?.walletSum?.$numberDecimal ?? val?.walletSum ?? "-",
        },
        {
          dataField: "currency",
          text: "Currency",
        },
        {
          dataField: "total",
          text: "Total",
          formatter: (val) => val?.total?.$numberDecimal ?? val?.total ?? "-",
        },
      ];
    case "daily-net-deposit":
      return [
        {
          dataField: "name",
          text: "Client Name",
          formatter: (val) =>
            val?.firstName
              ? (
                  <Link
                    to={`/clients/${val?._id}/profile`}
                  >{`${val?.firstName} ${val?.lastName}`}</Link>
                ) || "-"
              : "-",
        },
        {
          dataField: "agent",
          text: "Agent",
          formatter: (val) =>
            val?.agent ? `${val.agent.firstName} ${val.agent.lastName}` : "-",
        },
        {
          dataField: "fxSum",
          text: "Total Deposited",
          formatter: (val) => <span color="color-green">{val?.totalDeposits ?? "-"}</span>
        },
        {
          dataField: "walletSum",
          text: "Total Withdrawn",
          formatter: (val) => <span color="color-red">{val?.totalWithdrawals ?? "-"}</span>
        },
        {
          dataField: "total",
          text: "Net Profit",
          formatter: (val) => <span color={
            val?.netProfit > 0 ? "color-green" : "color-red"
          }>{val?.netProfit ?? "-"}</span>
        },
        {
          dataField: "currency",
          text: "Currency",
        },
      ];
    case "new-client-deposits":
      return [
        {
          dataField: "name",
          text: "Client Name",
          formatter: (val) =>
            val?.firstName
              ? (
                  <Link
                    to={`/clients/${val?._id}/profile`}
                  >{`${val?.firstName} ${val?.lastName}`}</Link>
                ) || "-"
              : "-",
        },
        {
          dataField: "agent",
          text: "Agent",
          formatter: (val) =>
            val?.agent ? `${val.agent.firstName} ${val.agent.lastName}` : "-",
        },
        {
          dataField: "fxSum",
          text: "First Transaction Date",
          formatter: (val) => formatDate(val?.firstTransaction?.createdAt),
        },
        {
          dataField: "createdAt",
          text: "Client Registration Date",
          formatter: (val) => formatDate(val.createdAt)
        },
      ];
    case "withdrawals":
    case "deposits":
      return [
        {
          dataField: "customerName",
          text: "Client Name",
          formatter: (val) =>
            val?.customer
              ? (
                  <Link
                    to={`/clients/${val?.customer?._id}/profile`}
                  >{`${val.customer.firstName} ${val.customer.lastName}`}</Link>
                ) || "-"
              : "-",
        },
        {
          dataField: "login",
          text: "Login",
        },
        {
          dataField: "amount",
          text: "Amount",
          formatter: (val) => parseFloat(val?.amount)?.toFixed(2) ?? "-",
        },
        {
          dataField: "currency",
          text: "Currency",
        },
        {
          dataField: "agent",
          text: "Agent",
          formatter: (val) =>
            val.agent ? `${val.agent.firstName} ${val.agent.lastName}` : "-",
        },
        {
          dataField: "createdAt",
          text: "Added in DB",
          formatter: (val) => formatDate(val.createdAt),
        },
      ];
    case "commission":
      return [
        {
          dataField: "customerName",
          text: "Client Name",
          formatter: (val) =>
            val?.customer
              ? (
                  <Link
                    to={`/clients/${val?.customer?._id}/profile`}
                  >{`${val.customer.firstName} ${val.customer.lastName}`}</Link>
                ) || "-"
              : "-",
        },
        {
          dataField: "login",
          text: "Login",
        },
        {
          dataField: "profit",
          text: "Amount",
        },
        {
          dataField: "action",
          text: "Action",
          formatter: (val) => (val.action === 10 ? "Rebate" : "Commission"),
        },
        {
          dataField: "clientDealId",
          text: "Client Deal",
        },
        {
          dataField: "clientLogin",
          text: "Client Login",
        },
        {
          dataField: "clientVolume",
          text: "Client Volume",
          formatter: (val) =>
            val.action === 10
              ? val.clientVolumeClosed / 10000
              : val.clientVolume / 10000,
        },
        {
          dataField: "agent",
          text: "Agent",
          formatter: (val) =>
            val.agent ? `${val.agent.firstName} ${val.agent.lastName}` : "-",
        },
        {
          dataField: "createdAt",
          text: "Added in DB",
          formatter: (val) => formatDate(val.createdAt),
        },
      ];
    case "summary":
      return [
        {
          dataField: "name",
          text: "Client Name",
          formatter: (val) =>
            val?.customer
              ? (
                  <Link
                    to={`/clients/${val?.customer?._id}/profile`}
                  >{`${val?.customer?.firstName} ${val?.customer?.lastName}`}</Link>
                ) || "-"
              : "-",
        },
        {
          dataField: "name",
          text: "IB Name",
          formatter: (val) =>
            val?.parent
              ? (
                  <Link
                    to={`/clients/${val?.parent?._id}/profile`}
                  >{`${val?.parent?.firstName} ${val?.parent?.lastName}`}</Link>
                ) || "-"
              : "-",
        },
        {
          dataField: "login",
          text: "Login",
        },
        {
          dataField: "dealId",
          text: "Deal Id",
        },
        {
          dataField: "positionId",
          text: "Position Id",
        },
        {
          dataField: "openPrice",
          text: "Price Open",
        },
        {
          dataField: "closePrice",
          text: "Price Close",
        },
        {
          dataField: "lots",
          text: "Volume",
          formatter: (val) => val.volume / 10000,
        },
        {
          dataField: "profit",
          text: "Amount",
        },
        {
          dataField: "agent",
          text: "Agent",
          formatter: (val) =>
            val.agent ? `${val.agent.firstName} ${val.agent.lastName}` : "-",
        },
        {
          dataField: "createdAt",
          text: "Traded Time",
          formatter: (val) => formatDate(val.time * 1000),
        },
      ];
    case "lead-converted":
      return [
        {
          dataField: "name",
          text: "Name",
          formatter: (val) => `${val.firstName} ${val.lastName}`,
        },
        {
          dataField: "agent",
          text: "Agent",
          formatter: (val) =>
            val.agent ? `${val.agent.firstName} ${val.agent.lastName}` : "",
        },
        {
          dataField: "convertTime",
          text: "Convert TIme",
          formatter: (val) => formatDate(val?.fx?.demoConvertTime),
        },
        {
          dataField: "createdAt",
          text: "Added in DB",
          formatter: (val) => formatDate(val.createdAt),
        },
      ];
    case "lead-call-status":
      return [
        {
          dataField: "name",
          text: "Name",
          formatter: (val) => `${val.firstName} ${val.lastName}`,
        },
        {
          dataField: "agent",
          text: "Agent",
          formatter: (val) =>
            val.agent ? `${val.agent.firstName} ${val.agent.lastName}` : "",
        },
        {
          dataField: "callStatus",
          text: "Call Status",
        },
        {
          dataField: "createdAt",
          text: "Added in DB",
          formatter: (val) => formatDate(val.createdAt),
        },
      ];
    case "last-login":
      return [
        {
          dataField: "name",
          text: "Name",
          formatter: (val) => `${val.firstName} ${val.lastName}`,
        },
        {
          dataField: "agent",
          text: "Agent",
          formatter: (val) =>
            val.agent ? `${val.agent.firstName} ${val.agent.lastName}` : "-",
        },
        {
          dataField: "lastLogin",
          text: "Last Login",
          formatter: (val) => formatDate(val.lastLogin),
        },
        {
          dataField: "createdAt",
          text: "Added in DB",
          formatter: (val) => formatDate(val.createdAt),
        },
      ];
    case "unfunded-accounts":
      return [
        {
          dataField: "login",
          text: "Login",
          formatter: (val) => <>{val?.login}</>,
        },
        {
          dataField: "clientName",
          text: "Client Name",
          formatter: (val) => (
            <Link to={`clients/${val?.customer?._id}/profile`}>
              {val?.customer
                ? `${val?.customer?.firstName} ${val?.customer?.lastName}`
                : ""}
            </Link>
          ),
        },
        {
          dataField: "currency",
          text: "Currency",
        },
        {
          dataField: "agent",
          text: "Agent",
          formatter: (val) =>
            val?.agent?.length
              ? `${val.agent?.[0]?.firstName} ${val.agent?.[0]?.lastName}`
              : "-",
        },
        {
          dataField: "createdAt",
          text: "Added in DB",
          formatter: (val) => formatDate(val.createdAt),
        },
      ];
    case "credit-in":
    case "credit-out":
      return [
        {
          dataField: "login",
          text: "Login",
          formatter: (val) => <>{val?.login ? val?.login : ""}</>,
        },
        {
          dataField: "clientName",
          text: "Client Name",
          formatter: (val) => (
            <Link to={`clients/${val?.customer?._id}/profile`}>
              {val?.customer
                ? `${val?.customer?.firstName} ${val?.customer?.lastName}`
                : ""}
            </Link>
          ),
        },
        {
          dataField: "amount",
          text: "Amount",
        },
        {
          dataField: "agent",
          text: "Agent",
          formatter: (val) =>
            val?.agent ? `${val.agent?.firstName} ${val.agent?.lastName}` : "-",
        },
        {
          dataField: "createdAt",
          text: "Added in DB",
          formatter: (val) => formatDate(val.createdAt),
        },
      ];
    case "ib-summary":
      return [
        {
          dataField: "client",
          text: "Client",
          formatter: (val) =>
            val?.customer ? (
              <Link to={`clients/${val?.customer?._id}/profile`}>
                {val?.customer
                  ? `${val?.customer?.firstName} ${val?.customer?.lastName}`
                  : "-"}
              </Link>
            ) : (
              "-"
            ),
        },
        {
          dataField: "lotsOpened",
          text: "Commission for Lots Opened",
          formatter: (val) => val?.lotsOpened / 10000,
        },
        {
          dataField: "commission",
          text: "Commission",
        },
        {
          dataField: "lotsClosed",
          text: "Rebate for Lots Closed",
          formatter: (val) => val?.lotsClosed / 10000,
        },
        {
          dataField: "rebate",
          text: "Rebate",
        },
        {
          dataField: "agent",
          text: "Agent",
          formatter: (val) =>
            val?.agent ? `${val.agent?.firstName} ${val.agent?.lastName}` : "-",
        },
      ];
    default:
      return [
        {
          dataField: "login",
          text: "Login",
        },
        {
          dataField: "profit",
          text: "Amount",
        },
        {
          dataField: "comment",
          text: "Comment",
        },
        {
          dataField: "createdAt",
          text: "Added in DB",
          formatter: (val) => formatDate(val.createdAt),
        },
      ];
  }
}

function ShowStats(props) {
  const { type, dateFrom, dateTo, agent } = props;
  if (!type) return <></>;
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});

  useEffect(() => {
    setLoading(true);
    if (type) {
      (async () => {
        axiosHelper
          .get(`/reports/stats/${type}`, {
            params: {
              dateFrom,
              dateTo,
              agent,
            },
          })
          .then((res) => {
            setStats(res?.result?.[0]);
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            // eslint-disable-next-line no-console
            console.log(err);
          });
      })();
    }
  }, [type, dateFrom, dateTo, agent]);
  
  if (!Object.keys(stats || {}).length) return <></>;

  if (loading) return <Spinner />;

  const formatData = (data) => {
    switch (type) {
      case "deposits":
        return `Total Deposit : ${parseFloat(
          data?.totalDeposit?.$numberDecimal || data?.totalDeposit || 0
        )?.toFixed(2)} ${data.currency}`;
      case "withdrawals":
        return `Total Withdrawal : ${parseFloat(
          data?.totalWithdrawal?.$numberDecimal || data?.totalWithdrawal || 0
        )?.toFixed(2)} ${data.currency}`;
      case "client-deposits":
        return `Total Deposit : ${parseFloat(
          data?.totalDeposit?.$numberDecimal || data?.totalDeposit || 0
        )?.toFixed(2)} ${data.currency}`;
      case "client-withdrawals":
        return `Total Withdrawal : ${parseFloat(
          data?.totalWithdrawal?.$numberDecimal || data?.totalWithdrawal || 0
        )?.toFixed(2)} ${data.currency}`;
      case "credit-in":
        return `Total Amount : ${data?.totalCreditAmount || 0}`;
      case "credit-out":
        return `Total Amount : ${data?.totalCreditAmount || 0}`;
      case "ib-summary":
        return `Total Commission : ${data?.totalCommission || 0} | Total Rebate : ${data?.totalRebate || 0} | Total Lots Opened : ${data?.totalLotsOpened || 0} | Total Lots Closed : ${data?.totalLotsClosed || 0}`;
      default:
        return "";
    }
  };

  return <>{formatData(stats)}</>;
}

function ReportsList(props) {
  const dispatch = useDispatch();
  const [columns, setColumns] = useState([]);
  const [payload, setPayload] = useState({});

  useEffect(() => {
    dispatch(
      getSalesAgentsStart({
        page: 1,
        limit: 1000,
      })
    );
  }, []);

  return (
    <React.Fragment>
      <MetaTags>
        <title>Reports</title>
      </MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          <h2>Reports</h2>
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex justify-content-between  align-items-center">
                  <CardTitle className="color-primary">Reports</CardTitle>
                </CardHeader>
                <CardBody>
                  <ReportForm
                    setReportColumns={(type) => {
                      setColumns(getColumns(type));
                    }}
                    setPayload={setPayload}
                  >
                    <Table
                      id="tech-companies-1"
                      className="table  table-hover "
                    >
                      <Thead className="text-center table-light">
                        <Tr>
                          {columns.map((column, index) => (
                            <Th data-priority={index} key={index}>
                              {column.text}
                            </Th>
                          ))}
                        </Tr>
                      </Thead>
                      <Tbody
                        className="text-center"
                        style={{ fontSize: "13px" }}
                      >
                        {props.loading && <TableLoader colSpan={4} />}
                        {!props.loading && props.docs.length === 0 && (
                          <>
                            <Tr
                              style={{
                                height: "50vh",
                              }}
                            >
                              <Td
                                colSpan={"100%"}
                                className="fw-bolder text-center"
                              >
                                <h3 className="fw-bolder text-center">
                                  No records
                                </h3>
                              </Td>
                            </Tr>
                          </>
                        )}
                        {!props.loading &&
                          props.docs.map((row, rowIndex) => (
                            <Tr key={rowIndex}>
                              {columns.map((column, index) => (
                                <Td key={`${rowIndex}-${index}`}>
                                  {column.formatter
                                    ? column.formatter(row, rowIndex)
                                    : row[column.dataField]}
                                </Td>
                              ))}
                            </Tr>
                          ))}
                        <Tr>
                          <Td colSpan={columns.length}>
                            <ShowStats
                              type={payload?.type}
                              dateFrom={payload?.dateFrom}
                              dateTo={payload?.dateTo}
                              agent={payload?.agent}
                            />
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </ReportForm>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  loading: state.reportsReducer.loading || false,
  docs: state.reportsReducer.docs || [],
  reportsReducer: state.reportsReducer || {},
});
export default connect(mapStateToProps, null)(ReportsList);
