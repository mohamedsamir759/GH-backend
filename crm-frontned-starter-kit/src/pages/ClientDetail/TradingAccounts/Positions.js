import React, { useEffect, useState } from "react";
import { 
  useDispatch, 
  connect,
} from "react-redux";
import { withTranslation } from "react-i18next";
import CustomPagination from "components/Common/CustomPagination";
import TableLoader from "components/Common/TableLoader";
import {
  Table, Thead, Tbody, Tr, Th, Td,
} from "react-super-responsive-table";
import { 
  TabContent, TabPane, Nav, NavItem, NavLink, Col, Row, Container 
} from "reactstrap";

import classnames from "classnames";
import formatDate from "helpers/formatDate";
import { getOpenPositionsStart, getClosePositionsStart } from "store/actions";

const Positions = ({ openPositions, closedPositions, loading, accountId, t }) => {
  const basePositionsColumns = [
    {
      dataField: "Symbol",
      text: t("Symbol"),
      formatter: (val) => (val?.Symbol || "-")
    },
    {
      dataField: "Position",
      text: t("Position"),
      formatter: (val) => (val?.Position || val?.PositionID ||  "-")
    },
    {
      dataField: "Action",
      text: t("Deal Type"),
      formatter: (val) => (val?.Action === "0" ? t("Buy") : t("Sell"))
    },
    {
      dataField: "Profit",
      text: t("Profit"),
      formatter: (val) => (val?.Profit || "-")
    },
  ];
  const openColumns = [
    ...basePositionsColumns,
    {
      dataField: "PriceOpen",
      text: t("Price"),
      formatter: (val) => (val?.PriceOpen || "-")
    },
    {
      dataField: "PriceSL",
      text: t("Price SL"),
      formatter: (val) => (val?.PriceSL || "-")
    },
    {
      dataField: "PriceTP",
      text: t("Price TP"),
      formatter: (val) => (val?.PriceTP || "-")
    },
    {
      dataField: "PriceCurrent",
      text: t("Price Position"),
      formatter: (val) => (val?.PriceCurrent || "-")
    },
    {
      dataField: "Volume",
      text: t("Volume"),
      formatter: (val) => (val ? parseFloat(val?.Volume / 10000) : "-")
    },
    {
      dataField: "TimeCreate",
      text: t("Time"),
      formatter: (val) => formatDate(val?.TimeCreate * 1000),
    },
  ];
  const closedColumns = [
    ...basePositionsColumns,
    {
      dataField: "Symbol",
      text: t("Deal"),
      formatter: (val) => (val?.Deal || val?.DealID || "-")
    },
    {
      dataField: "Price",
      text: t("Price"),
      formatter: (val) => (val?.Price || "-")
    },
    {
      dataField: "PriceSL",
      text: t("Price SL"),
      formatter: (val) => (val?.PriceSL || "-")
    },
    {
      dataField: "PriceTP",
      text: t("Price TP"),
      formatter: (val) => (val?.PriceTP || "-")
    },
    {
      dataField: "Volume",
      text: t("Volume"),
      formatter: (val) => (val ? parseFloat(val?.Volume / 10000) : "-")
    },    
    {
      dataField: "Time",
      text: t("Time"),
      formatter: (val) => formatDate(val?.Time * 1000),
    },
  ];
  
  const dispatch = useDispatch();

  const [sizePerPage, setSizePerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("openTab");

  const loadPositions = (page = 1, limit = 10, isOpenPosition = true) => {
    if (isOpenPosition) {
      accountId && dispatch(getOpenPositionsStart({
        _id: accountId,
        limit,
        page,
      }));
    }
    else if (!isOpenPosition) {
      accountId && dispatch(getClosePositionsStart({
        _id: accountId,
        limit,
        page,
      }));
    }
  };

  useEffect(() => {
    accountId && loadPositions(1, sizePerPage, activeTab === "openTab");
  }, [activeTab, accountId, sizePerPage, 1]);

  return (
    <>
      {
        accountId ? (
          <div className="container-fluid">
            <Nav tabs>
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({ active: activeTab === "openTab" })}
                  onClick={() => { setActiveTab("openTab") }}
                >
                  Open
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({ active: activeTab === "closedTab" })}
                  onClick={() => { setActiveTab("closedTab") }}
                >
                  Closed
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab} className="mt-2">
              <TabPane tabId="openTab">
                <div className="table-rep-plugin">
                  <div
                    className="table-responsive mb-0"
                    data-pattern="priority-columns"
                    style={{
                      overflow: "visible",
                      overflowX: "auto",
                    }}
                  >
                    <Table
                      id="tech-companies-1"
                      className="table table-hover table-clients"
                    >
                      <Thead className="text-center table-light" >
                        <Tr>
                          {openColumns.map((column, index) =>
                            <Th data-priority={index} key={index}><span className="color-primary">{column.text}</span></Th>
                          )}
                        </Tr>
                      </Thead>
                      
                      <Tbody className="text-center" style={{ fontSize: "13px" }}>
                        {loading && <TableLoader colSpan={4} />}
                        {openPositions?.docs?.length === 0
                          ? <tr><td colSpan="100%" className="my-2">{t("No open positions for this account.")}</td></tr>
                          : openPositions?.docs?.map((row, rowIndex) =>
                            <Tr key={rowIndex} >
                              {openColumns.map((column, index) =>
                                <Td key={`${rowIndex}-${index}`}>
                                  {column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
                                </Td>
                              )}
                            </Tr>
                          )}
                      </Tbody>
                    </Table>
                    <CustomPagination
                      {...openPositions}
                      setSizePerPage={setSizePerPage}
                      sizePerPage={sizePerPage}
                      onChange={(page, limit) => loadPositions(page, limit, true)}
                      docs={openPositions?.docs || []}
                    />
                  </div>
                </div>
              </TabPane>
              <TabPane tabId="closedTab">
                <div className="table-rep-plugin">
                  <div
                    className="table-responsive mb-0"
                    data-pattern="priority-columns"
                  >
                    <Table
                      id="tech-companies-1"
                      className="table table-hover table-clients"
                    >
                      <Thead className="text-center table-light" >
                        <Tr>
                          {closedColumns.map((column, index) =>
                            <Th data-priority={index} key={index}><span className="color-primary">{column.text}</span></Th>
                          )}
                        </Tr>
                      </Thead>
                      
                      <Tbody className="text-center" style={{ fontSize: "13px" }}>
                        {loading && <TableLoader colSpan={4} />}
                        {closedPositions?.docs?.length === 0
                          ? <tr><td colSpan="100%" className="my-2">{t("No closed positions for this account.")}</td></tr>
                          : closedPositions?.docs?.map((row, rowIndex) =>
                            <Tr key={rowIndex} >
                              {closedColumns.map((column, index) =>
                                <Td key={`${rowIndex}-${index}`}>
                                  {column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
                                </Td>
                              )}
                            </Tr>
                          )}
                      </Tbody>
                    </Table>
                    <CustomPagination
                      {...closedPositions}
                      setSizePerPage={setSizePerPage}
                      sizePerPage={sizePerPage}
                      onChange={(page, limit) => loadPositions(page, limit, false)}
                      docs={closedPositions?.docs || []}
                    />
                  </div>
                </div>
              </TabPane>
            </TabContent>
          </div>
        ) : (
          <Container>
            <Row>
              <Col className="text-center py-3" lg={12}>
                <h5>{t("Please click on the client login to view positions")}</h5>
              </Col>
            </Row>
          </Container>
        )
      }
    </>
  );

};

const mapStateToProps = (state) => ({
  openPositions: state.tradingAccountReducer.positions.open ?? [],
  closedPositions: state.tradingAccountReducer.positions.closed ?? [],
  loading: state.tradingAccountReducer.positions.loading ?? false,
});
export default connect(mapStateToProps, null)(withTranslation()(Positions));