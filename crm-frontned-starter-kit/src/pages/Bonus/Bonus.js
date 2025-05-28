/* eslint-disable indent */
import React, { useEffect, useState } from "react";
import {  connect, useDispatch } from "react-redux";
// eslint-disable-next-line object-curly-newline
import { Row, Col, Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import AddBonusModal from "./AddBonusModal";
import SearchBar from "components/Common/SearchBar";
import CustomPagination from "components/Common/CustomPagination";
// eslint-disable-next-line object-curly-newline
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import TableLoader from "components/Common/TableLoader";
import Notification from "components/Common/Notification";
import logo from "../../assets/images/logo-sm.svg";
import { withTranslation } from "react-i18next";
import { checkAllBoxes } from "common/utils/checkAllBoxes";
import { Link, } from "react-router-dom";
import { captilazeFirstLetter } from "common/utils/manipulateString";
import CustomDropdown from "components/Common/CustomDropDown";
import Filter from "./BonusFilter";
import Badge from "components/Common/Badge";
import formatDate from "helpers/formatDate";
// import ReceiptModal from "../ReceiptModal";
import FeatherIcon from "feather-icons-react";
import ReceiptModal from "pages/Transactions/Forex/ReceiptModal";
import { MetaTags } from "react-meta-tags";
import { getForexBounses } from "apis/forexBouns";
import { fetchForexBounses } from "store/forexTransactions/bounses/actions";

function DepositForex(props) {
  // get query paramerters from url
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [sizePerPage, setSizePerPage] = useState(10);


  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");


  const columns = [
    {
      dataField: "checkbox",
      text: (
        <input
          type="checkbox"
          id="check-all-deposits"
          onChange={() =>
            checkAllBoxes("check-all-deposits", ".deposit-checkbox")
          }
        />
      ),
    },
    {
      dataField: "createdAt",
      text: props.t("Date"),
      formatter: (val) => formatDate(val.createdAt),
    },
    {
      dataField: "recordId",
      text: props.t("Transaction Id"),
    },
    {
      dataField: "customerId",
      text: props.t("Client"),
      formatter: (val) => {
        return (
          <div>
            <Link
              to={{
                pathname: `/clients/${val?.customerId?._id}/profile`,
                state: { clientId: val.customerId },
              }}
            >
              <span className="no-italics" style={{ fontWeight: "bold" }}>
                {val.customerId
                  ? `${captilazeFirstLetter(
                      val.customerId.firstName
                    )} ${captilazeFirstLetter(val.customerId.lastName)}`
                  : ""}
              </span>
            </Link>
          </div>
        );
      },
    },

    {
      dataField: "currency",
      text: props.t("Currency"),
    },  
    {
      dataField: "walletType",
      text: props.t("Wallet Type"),
    },
    {
      dataField: "note",
      text: props.t("Note"),
    },
    {
      dataField: "amount",
      text: props.t("Amount"),
    },
    {
      dataField: "status",
      text: props.t("Status"),
      formatter: (val) => <Badge status={val.status}></Badge>,
    },
    {
      dataField: "dropdown",
      isDummyField: true,
      editable: false,
      text: props.t("Actions"),
    },
  ];

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  // useEffect(async()=>{
  //   dispatch(
  //     fetchForexBounses({
  //       limit:100,
  //       page:1,
  //       // filteredValues,
  //       // searchText: searchInput,
  //     })
  //   );
    

  //   // try {
  //   //   let payload = {
  //   //     page:1,
  //   //     limit:100,
  //   //   };
  //   //   const data = await getForexBounses({payload});
  //   //   console.log("datadatadatadatadata", data);
  //   //   setTotalDocs(data?.result?.totalDocs);
  //   //   setDocs(data?.result?.docs);
  //   // } catch (error) {
  //   //   console.log(error);
  //   // }
  // }, []);
  const loadForexBounses = (page, limit) => {
    if (searchInput && searchInput.length > 3) {
      dispatch(
        fetchForexBounses({
          limit,
          page,
          // filteredValues,
          // searchText: searchInput,
        })
      );
    } else {
      dispatch(
        fetchForexBounses({
          limit,
          page,
          // filteredValues,
        })
      );
    }
  };

  useEffect(() => {
    loadForexBounses(1, sizePerPage);
  }, [sizePerPage]);
  return (
    <React.Fragment>

      <Notification
        body={props.t("The Bonus has been updated successfully")}
        header={props.t("Bonus Update")}
        logo={logo}
      />
      <div className="mt-5">
        <Row>
          <div className="container-fluid mt-5 ms-3">
            <h2>Bonus</h2>
          </div>
          <Col className="col-12">
            <Card>
              <CardHeader className="d-flex flex-column gap-3 ">
                <div className="d-flex justify-content-between align-items-center">
                  <CardTitle className="color-primary">
                    {props.t(`Bonus(${props.totalDocs})`)}
                    <FeatherIcon
                      icon="refresh-cw"
                      className="icon-lg ms-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        loadForexBounses(1, sizePerPage);
                      }}
                    />
                  </CardTitle>
                </div>
                <div className="d-flex flex-row align-items-center justify-content-between gap-2">
                  <div className="d-flex flex-row align-items-center">
                    <SearchBar
                      handleSearchInput={handleSearchInput}
                      placeholder={props.t("Search for Bonus")}
                    />
                    <Filter
                      // filterChangeHandler={filterChangeHandler}
                      // filteredValues={filteredValues}
                    />
                  </div>
                  <div className="d-flex flex-row align-items-center justify-content-between">
                    <AddBonusModal loadForexBounses={()=>loadForexBounses(1, sizePerPage)}/>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="table-rep-plugin">
                  <div
                    className="table-responsive mb-0"
                    data-pattern="priority-columns"
                  >
                    <Table id="tech-companies-1" className="table  table-hover ">
                      <Thead className="text-center table-light">
                        <Tr>
                          {columns.map((column, index) =>
                            <Th data-priority={index} key={index}><span className="color-primary">{column.text}</span></Th>
                          )}
                        </Tr>
                      </Thead>

                      {props?.totalDocs === 0 ? (
                        <Tbody
                          style={{
                            fontSize: "12px",
                            textAlign: "center",
                            textTransform: "capitalize",
                          }}
                        >
                          {props?.fetchLoading && <TableLoader colSpan={4} />}
                          {!props?.fetchLoading && (
                            <>
                              <Tr>
                                <Td
                                  colSpan={"100%"}
                                  className="fw-bolder text-center"
                                  st
                                >
                                  <h3 className="fw-bolder text-center">
                                    No records
                                  </h3>
                                </Td>
                              </Tr>
                            </>
                          )}
                        </Tbody>
                      ) : (
                        <Tbody
                          style={{
                            fontSize: "12px",
                            textAlign: "center",
                            textTransform: "capitalize",
                          }}
                        >
                          {props.fetchLoading && <TableLoader colSpan={4} />}
                          {!props.fetchLoading &&
                            props.forexBounses.map((row, rowIndex) => (
                              <Tr key={rowIndex}>
                                {columns.map((column, index) => (
                                  <Td
                                    key={`${rowIndex}-${index}`}
                                    className="pt-4"
                                  >
                                    {column.dataField === "checkbox" ? (
                                      <input
                                        className="deposit-checkbox"
                                        type="checkbox"
                                      />
                                    ) : (
                                      ""
                                    )}
                                    {column.formatter
                                      ? column.formatter(row, rowIndex)
                                      : row[column.dataField]}
                                    {column.dataField === "dropdown" && (
                                      <CustomDropdown
                                        permission={
                                          props.depositsPermissions.actions
                                        }
                                        status={row.status}

                                      />
                                    )}
                                  </Td>
                                ))}
                              </Tr>
                            ))}
                        </Tbody>
                      )}
                    </Table>
                    <CustomPagination
                      {...props}
                      setSizePerPage={setSizePerPage}
                      sizePerPage={sizePerPage}
                      onChange={loadForexBounses}
                      docs={props.forexBounses}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
      {
        <ReceiptModal
          content={selectedContent}
          open={detailsModal}
          onClose={() => setDetailsModal(false)}
        />
      }
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  fetchLoading: state.forexBounseReducer.fetchLoading || false,
  addLoading: state.forexBounseReducer.addLoading || false,
  forexBounses: state.forexBounseReducer.forexBounses || [],
  page: state.forexBounseReducer.page || 1,
  totalDocs: state.forexBounseReducer.forexTotalDocs || 0,
  totalPages: state.forexBounseReducer.totalPages || 0,
  hasNextPage: state.forexBounseReducer.hasNextPage,
  hasPrevPage: state.forexBounseReducer.hasPrevPage,
  limit: state.forexBounseReducer.limit,
  nextPage: state.forexBounseReducer.nextPage,
  pagingCounter: state.forexBounseReducer.pagingCounter,
  prevPage: state.forexBounseReducer.prevPage,
  depositsPermissions: state.Profile.depositsPermissions || {},
  depositResponseMessage: state.forexBounseReducer.depositResponseMessage,
  tradingAccounts: state.tradingAccountReducer.tradingAccounts,
});
export default connect(mapStateToProps, null)(withTranslation()(DepositForex));
