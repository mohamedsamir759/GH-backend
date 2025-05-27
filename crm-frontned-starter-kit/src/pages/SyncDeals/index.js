import React, {
  useContext,
  useEffect, useReducer, useState
} from "react";
import {
  useDispatch, connect
} from "react-redux";

import {
  Row, Col, Card, CardBody, CardTitle, CardHeader, Button, ButtonGroup, Alert, InputGroup
} from "reactstrap";

import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { MetaTags } from "react-meta-tags";

import TableLoader from "components/Common/TableLoader";
import { AvField, AvForm } from "availity-reactstrap-validation";
import AvFieldSelect from "components/Common/AvFieldSelect";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { getTradingAccountsStateLess } from "apis/tradingAccounts";
import ReactSelect from "react-select";
import { getSyncDeals, syncMissingDeals } from "apis/sync";
import { showErrorNotification, showSuccessNotification } from "store/actions";
import SocketContext from "context/context";

function SyncDeal() {
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [ibLogins, setIbLogins] = useState([]);
  const [clientLogins, setClientLogins] = useState([]);
  const [payload, setPayload] = useState([]);
  const [formData, setFormData] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "syncType":
          return {
            ...state,
            syncType: action.value
          };
        case "dateFrom":
          return {
            ...state,
            dateFrom: action.value
          };
        case "dateTo":
          return {
            ...state,
            dateTo: action.value
          };
        case "ibLogins":
          return {
            ...state,
            ibLogins: action.value
          };
        case "clientLogins":
          return {
            ...state,
            clientLogins: action.value
          };
        case "isSyncAll":
          return {
            ...state,
            isSyncAll: action.value
          };
        default:
          return state;
      }
    },
    {
      syncType: "",
      // last 7 days
      dateFrom: moment().subtract(7, "days").format("YYYY-MM-DDTHH:mm"),
      dateTo: moment().format("YYYY-MM-DDTHH:mm"),
      ibLogins: [],
      clientLogins: [],
      isSyncAll: false
    });

  const {
    state,
    setState
  } = useContext(SocketContext);

  const {
    dealSync
  } = state;

  const {
    loading,
    showMessage, message,
    isFetchingDone,
    deals, isError
  } = dealSync;

  useEffect(() => {
    if (isFetchingDone) {
      dispatch(showSuccessNotification("Deals Fetched Successfully - " + dealSync.deals.length + " Deals Fetched"));
    }
  }, [isFetchingDone]);

  useEffect(() => {
    if (isError) {
      // dispatch(showErrorNotification(message));
      setState(state => {
        return {
          ...state,
          dealSync: {
            ...state.dealSync,
            isError: false
          }
        };
      });
    }
  }, [isError]);

  const {
    t
  } = useTranslation();
  const dispatch = useDispatch();

  const loadAccounts = async () => {
    const [ibAccs, clientAccs] = await Promise.all([
      getTradingAccountsStateLess({
        payload: {
          type: "IB",
          page: 1,
          limit: 10000
        }
      }),
      getTradingAccountsStateLess({
        payload: {
          type: "LIVE",
          page: 1,
          limit: 10000
        }
      })
    ]);
    const newIbLogins = ibAccs?.map((acc) => ({
      value: acc?.login,
      label: acc?.login
    }));
    const newClientLogins = clientAccs?.map((acc) => ({
      value: acc?.login,
      label: acc?.login
    }));
    setIbLogins(newIbLogins);
    setClientLogins(newClientLogins);
  };

  useEffect(() => {
    setAccountsLoading(true);
    loadAccounts().then(() => {
      setAccountsLoading(false);
    });
  }, []);

  const columns = [
    {
      dataField: "dealId",
      text: "Deal",
    },
    {
      dataField: "login",
      text: "Login",
    },
    {
      dataField: "time",
      text: "Trade Time",
      formatter: (cell) => moment(cell?.time * 1000).format("DD-MM-YYYY HH:mm:ss")
    },
    {
      dataField: "symbol",
      text: "Symbol",
    },
    {
      dataField: "status",
      text: "Deal Status",
      formatter: (cell) => {
        if (cell?.hasIb && cell?.isDealPresentInDb) {
          if (cell?.isIbDealProcessed) {
            return "Rebate/Commission Generated";
          } else {
            return "Rebate/Commission Deal Present in DB but not processed";
          }
        } else if (cell?.hasIb && !cell?.isDealPresentInDb) {
          return "Rebate/Commission Deal not Present in DB";
        } else if (!cell?.hasIb && cell?.isDealPresentInDb) {
          return "Deal Present in DB";
        } else {
          return "Deal not Present in DB";
        }
      }
    },
  ];

  const handleSubmit = async (payload) => {
    getSyncDeals(payload).then((res) => {
    }).catch((err) => {
      console.log(err);
      setPayload([]);
    }).finally(() => {
    });
  };

  const getDealsToSync = (deals) => {
    return deals.filter((deal) => {
      if (deal?.hasIb && deal?.isDealPresentInDb) {
        if (deal?.isIbDealProcessed) {
          return false;
        } else {
          return true;
        }
      } else if (deal?.hasIb && !deal?.isDealPresentInDb) {
        return true;
      } else if (!deal?.hasIb && deal?.isDealPresentInDb) {
        return false;
      } else {
        return false;
      }
    });
  };

  const handleSync = () => {
    const dealsToSync = getDealsToSync(payload);
    syncMissingDeals({
      deals: dealsToSync,
    }).then((res) => {
      
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
    });
  };

  const verify = () => {
    const basic = loading ||
    accountsLoading ||
    formData.syncType === "" ||
    formData.dateFrom === "" ||
    formData.dateTo === "";
    if (formData.isSyncAll) {
      return basic;
    } else {
      return basic || 
      (formData.ibLogins.length === 0 &&
      formData.clientLogins.length === 0);
    }
  };

  return (
    <React.Fragment>
      <MetaTags>
        <title>
          Sync Deals
        </title>
      </MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          <h2>Sync Deals</h2>
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex justify-content-between  align-items-center">
                  <CardTitle>
                    Sync Deals
                  </CardTitle>
                </CardHeader>
                <CardBody style={{
                  minHeight: "80vh"
                }}>
                  <div className="mb-2">
                    <div>
                      <AvForm
                        className='p-1'
                        onValidSubmit={(e, v) => {
                          const payload = {
                            ...formData,
                            ibLogins: formData.ibLogins.map((item) => item.value),
                            clientLogins: formData.clientLogins.map((item) => item.value),
                          };
                          handleSubmit(payload);
                        }}
                      >
                        <Row>
                          <Col className="col-4">
                            <label >Select Sync Type</label>
                            <AvFieldSelect
                              type="select"
                              name="syncType"
                              required
                              onChange={(e) => {
                                setFormData({
                                  type: "syncType",
                                  value: e
                                });
                              }}
                              value={formData.syncType}
                              options={[
                                {
                                  value: "db-sync",
                                  label: t("Sync Missing Deals")
                                },
                                // {
                                //   value: "db-resync",
                                //   label: t("Re-Sync Deals for Rebate/Commission")
                                // },
                              ]}
                              errorMessage={t("please select sync Type")}
                              validate={{ required: { value: true } }}
                            >
                            </AvFieldSelect>
                          </Col>
                          <Col className="col-4">
                            <AvField
                              name="dateFrom"
                              label={t("Date From")}
                              type="datetime-local"
                              errorMessage={t("Select date From")}
                              validate={{ required: { value: true } }}
                              value={formData.dateFrom}
                              onChange={(e) => {
                                setFormData({
                                  type: "dateFrom",
                                  value: e.target.value
                                });
                              }}
                            />
                          </Col>
                          <Col className="col-4">
                            <AvField
                              name="dateTo"
                              label={t("Date To")}
                              type="datetime-local"
                              errorMessage={t("Select date To")}
                              validate={{ required: { value: true } }}
                              value={formData.dateTo}
                              onChange={(e) => {
                                setFormData({
                                  type: "dateTo",
                                  value: e.target.value
                                });
                              }}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col className="col-6">
                            <label >Ib Logins</label>
                            <ReactSelect
                              type="select"
                              name="ibLogins"
                              required
                              onChange={(e) => {
                                setFormData({
                                  type: "ibLogins",
                                  value: e
                                });
                              }}
                              isMulti
                              value={formData.ibLogins}
                              options={ibLogins}
                              errorMessage={t("please select IB Logins")}
                              validate={{ required: { value: true } }}
                            >
                            </ReactSelect>
                          </Col>
                          <Col className="col-6">
                            <label >Client Logins</label>
                            <ReactSelect
                              type="select"
                              name="ibLogins"
                              required
                              onChange={(e) => {
                                setFormData({
                                  type: "clientLogins",
                                  value: e
                                });
                              }}
                              isMulti
                              value={formData.clientLogins}
                              options={clientLogins}
                              errorMessage={t("please select IB Logins")}
                              validate={{ required: { value: true } }}
                            >
                            </ReactSelect>
                          </Col>
                        </Row>
                        <Row>
                          <Col className="col-12">
                            <InputGroup
                              className="d-flex justify-content-center align-items-center my-2"
                            >
                              <div className="d-flex justify-content-center align-items-center">
                                <div className="mx-2">
                                  <div className="form-check form-switch">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id="flexSwitchCheckDefault"
                                      checked={formData.isSyncAll}
                                      onChange={(e) => {
                                        setFormData({
                                          type: "isSyncAll",
                                          value: !formData.isSyncAll
                                        });
                                      }}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="flexSwitchCheckDefault"
                                    >
                                      Sync All
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </InputGroup>
                          </Col>
                        </Row>
                        <Row className="my-2">
                          <div className="d-flex justify-content-center">
                            {
                              loading
                                ?
                                <>
                                  {showMessage ? <Alert
                                    color="info"
                                  >
                                    <div className="d-flex justify-content-center align-items-center">
                                      <TableLoader />
                                      <div className="mx-2">{message}</div>
                                    </div>
                                  </Alert> : <TableLoader />}
                                </>
                                :
                                <ButtonGroup>
                                  <Button type="submit" color="primary" className="" disabled={
                                    verify()
                                  }>
                                    {t("Search")}
                                  </Button>
                                  <Button type="button" color="primary" className="" disabled={
                                    loading ||
                                    deals.length === 0
                                  } onClick={() => handleSync()}
                                  >
                                    {t("Sync Deals")}
                                  </Button>
                                </ButtonGroup>
                            }
                          </div>
                        </Row>
                      </AvForm>
                    </div>
                  </div>         
                  <Table
                    id="tech-companies-1"
                    className="table  table-hover "
                  >
                    <Thead className="text-center table-light" >
                      <Tr>
                        {columns.map((column, index) =>
                          <Th data-priority={index} key={index}>{column.text}</Th>
                        )}
                      </Tr>
                    </Thead>
                    <Tbody className="text-center" style={{ fontSize: "13px" }}>
                      {!loading && deals.length === 0 && 
                          <>
                            <Tr style={{
                              height: "50vh"
                            }}>
                              <Td colSpan={"100%"} className="fw-bolder text-center" >
                                <h3 className="fw-bolder text-center">No records</h3>
                              </Td>
                            </Tr>
                          </>
                      }
                      {!loading && deals.map((row, rowIndex) =>
                        <Tr key={rowIndex}>
                          {columns.map((column, index) =>
                            <Td key={`${rowIndex}-${index}`}>
                              { column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
                            </Td>
                          )}
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
}

export default (SyncDeal);
