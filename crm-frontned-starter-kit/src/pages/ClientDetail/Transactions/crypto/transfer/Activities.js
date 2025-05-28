import React, { useState, useEffect } from "react";
import { useDispatch, connect } from "react-redux";
import {
  Row, Col, Card, CardBody,
  CardTitle, CardHeader
} from "reactstrap";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

// i18n
import { withTranslation } from "react-i18next";
import CustomPagination from "components/Common/CustomPagination";
import TableLoader from "components/Common/TableLoader";
import { fetchLogs } from "store/actions";
import {
  LOG_LEVELS,
  LOG_TYPES,
} from "constants/logs";
import { getNoteType } from "common/utils/getNoteType";
import moment from "moment";

const formatDate = (date) => {
  if (!date) return "-";
  return moment(date).format("DD/MM/YYYY HH:mm A ZZ");
};

function Activities(props) {
  const [sizePerPage, setSizePerPage] = useState(10);
  
  const columns = [
    {
      dataField: "recordId",
      text: props.t("ID")
    },
    {
      dataField: "level",
      text: props.t("Asset"),
      formatter: (val) => (val?.content?.asset ? val?.content?.asset : "---"),
    },
    {
      dataField: "level",
      text: props.t("From Wallet"),
      formatter: (val) => (val?.content?.fromAssetType ? val?.content?.fromAssetType : "---"),
    },
    {
      dataField: "level",
      text: props.t("To Wallet"),
      formatter: (val) => (val?.content?.toAssetType ? val?.content?.toAssetType : "---"),
    },
    {
      dataField: "level",
      text: props.t("Amount"),
      formatter: (val) => (val?.content?.amount ? val?.content?.amount : "---"),
    },
    {
      dataField: "createdAt",
      text: props.t("Date Created"),
      formatter: (val) => formatDate(val.createdAt),
    },
  ];

  const dispatch = useDispatch();
  const fetchData = async (page) => {
    dispatch(fetchLogs({
      page: page || 1,
      limit: sizePerPage,
      customerId: props.clientId,
      types: "TRANSFER_WALLET"
    }));
  };

  useEffect(() => {
    fetchData(1);
  }, [sizePerPage, 1]);

  return (
    <React.Fragment>
      <div className="">
        <div className="container-fluid">
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex justify-content-between  align-items-center">
                  <CardTitle className="color-primary">
                    {props.t("Transfers")}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="table-rep-plugin">
                    <div
                      className="table-responsive mb-0"
                      data-pattern="priority-columns"
                    >
                      <Table
                        id="tech-companies-1"
                        className="table  table-hover "
                      >
                        <Thead className="text-center table-light" >
                          <Tr>
                            {columns.map((column, index) =>
                              <Th data-priority={index} key={index}>
                                <span className="color-primary">{column.text}</span>
                              </Th>
                            )}
                          </Tr>
                        </Thead>
                        <Tbody>
                          {props.loading && <TableLoader colSpan={4} />}
                          {!props.loading && props.todos.length === 0 &&
                            <>
                              <Tr>
                                <Td colSpan={"100%"} className="fw-bolder text-center" st="true">
                                  <h3 className="fw-bolder text-center">No records</h3>
                                </Td>
                              </Tr>
                            </>
                          }
                          {!props.loading && props.todos.map((row, rowIndex) =>
                            <Tr key={rowIndex}>
                              {columns.map((column, index) =>
                                <Td key={`${rowIndex}-${index}`} className="text-center">
                                  {column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
                                </Td>
                              )}
                            </Tr>
                          )}
                        </Tbody>

                      </Table>
                      <CustomPagination
                        {...props.pagination}
                        docs={props.todos}
                        setSizePerPage={setSizePerPage}
                        sizePerPage={sizePerPage}
                        onChange={fetchData}
                      />
                    </div>
                  </div>
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
  clientDetails: state.clientReducer.clientDetails || {},
  todos: state.logsReducer.logs && state.logsReducer.logs.docs || [],
  pagination: state.logsReducer.logs || {},
  loading: state.logsReducer.loading,
  selectedClient: state.clientReducer.clientDetails || {},
});

export default connect(mapStateToProps, null)(withTranslation()(Activities));
