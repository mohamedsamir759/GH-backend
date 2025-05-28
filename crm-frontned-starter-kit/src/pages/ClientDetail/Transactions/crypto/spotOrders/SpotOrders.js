import React, {
  useState, useEffect
} from "react";
import { 
  useDispatch, connect, useSelector
} from "react-redux";
import {
  Row, Col, Card, CardBody, CardHeader, CardTitle, Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";
import SearchBar from "components/Common/SearchBar";
import CustomPagination from "components/Common/CustomPagination";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import TableLoader from "components/Common/TableLoader";
import { Link, useParams } from "react-router-dom";
import Notification from "components/Common/Notification";
import logo from "../../../../../assets/images/logo-sm.svg";
import { withTranslation } from "react-i18next";
import { checkAllBoxes } from "common/utils/checkAllBoxes";
import AddSpotOrdersModal from "./AddSpotOrdersModal";
import { fetchConverts } from "store/converts/actions";
import { captilazeFirstLetter } from "common/utils/manipulateString";
import formatDate from "helpers/formatDate";
import { getOrders } from "apis/orders";
import { deleteOrder, fetchOrders } from "store/orders/actions";

function SpotOrders(props){
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [showNotication, setShowNotifaction] = useState(false);
  const [sizePerPage, setSizePerPage] = useState(10);
  // const [page, setPage] = useState(1);
  const [btnprimary1, setBtnprimary1] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const columns = [
    {
      dataField:"checkbox",
      text: <input type="checkbox" id = "check-all-deposits" onChange = {()=>checkAllBoxes("check-all-deposits", ".deposit-checkbox")}/>
    },
    {
      dataField: "createdAt",
      text: props.t("Date"),
      formatter: (val) => formatDate(val.createdAt)
    },
    {
      dataField: "type",
      text: props.t("Type"),
      formatter:(item) => (
        item?.side || ""
      )
    },
    {
      dataField:"customerId",
      text:props.t("Client"),
      formatter:(val)=>{
        return (
          <div>
            <Link 
              to ={{
                pathname : `/clients/${val?.customerId?._id}/profile`,
                state : { clientId : val.customerId }
              }}>
              <span className="no-italics" style={{ fontWeight: "bold" }}>{val.customerId ? `${val.customerId?.firstName && captilazeFirstLetter(val.customerId?.firstName)} ${val.customerId?.lastName && captilazeFirstLetter(val.customerId?.lastName)}` : ""}</span>
            </Link>
          </div>
        ); 
      }
    },
    {
      dataField: "fromAsset",
      text: props.t("From Asset"),
      formatter:(item) => (
        item?.side === "buy" ?
          item?.symbol?.replace("/", "-")?.split("-")?.[0] || ""
          :
          item?.symbol?.replace("/", "-")?.split("-")?.[1] || ""
      )
    },
    {
      dataField: "toAsset",
      text: props.t("To Asset"),
      formatter:(item) => (
        item?.side === "buy" ?
          item?.symbol?.replace("/", "-")?.split("-")?.[1] || ""
          :
          item?.symbol?.replace("/", "-")?.split("-")?.[0] || ""
      )
    },
    {
      dataField: "fromAmount",
      text: props.t("From Amount"),
      formatter: (item) => (
        `${parseFloat(item?.amount?.$numberDecimal)}` || `${parseFloat(item?.amount)}` || "-"
      )
    },
    {
      dataField: "toAmount",
      text: props.t("To Amount"), 
      formatter: (item) => (
        `${parseFloat(item?.amount?.$numberDecimal)}` || `${parseFloat(item?.amount)}` || "-"
      )
    },
    {
      dataField: "feeAmount",
      text: props.t("Fee Amount"),
      formatter: (item) => (
        `${parseFloat(item?.fee?.cost?.$numberDecimal)}` || "-"
      )
    },
    {
      dataField: "status",
      text: props.t("Status"),
      formatter:(item) => (
        item.status?.toLowerCase()
      )
    }
  ];
  
  const handleSearchInput = (e)=>{
    setSearchInput(e.target.value); 
  };
  
  const loadData = (page, limit)=>{
    setSizePerPage(limit);  
    setcurrentPage(page);  
  };
  
  const closeNotifaction = () => {
    setShowNotifaction(false);
  };
  
  // useEffect(()=>{
  //   loadData(1, sizePerPage);
  // }, [sizePerPage, 1, searchInput, selectedFilter]);
  
  const [deleteModal, setDeleteOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState();
  const { clientId } = useParams();

  // const {
  //   loading,
  //   docs,
  //   page,
  //   totalDocs,
  //   totalPages,
  //   hasNextPage,
  //   hasPrevPage,
  //   limit,
  //   nextPage,
  //   pagingCounter,
  //   prevPage,
  //   deleteLoading,
  //   deleteClearingCounter,
  //   // roles,
  //   clearingCounter,
  //   // editClearingCounter,
  // } = useSelector((state) => ({
  //   loading: state.ordersReducer.loading || false,
  //   docs: state.ordersReducer.docs || [],
  //   page: state.ordersReducer.page || 1,
  //   totalDocs: state.ordersReducer.totalDocs || 0,
  //   totalPages: state.ordersReducer.totalPages || 0,
  //   hasNextPage: state.ordersReducer.hasNextPage,
  //   hasPrevPage: state.ordersReducer.hasPrevPage,
  //   limit: state.ordersReducer.limit,
  //   nextPage: state.ordersReducer.nextPage,
  //   pagingCounter: state.ordersReducer.pagingCounter,
  //   prevPage: state.ordersReducer.prevPage,
  //   deleteLoading: state.ordersReducer.deleteLoading,
  //   deleteClearingCounter: state.ordersReducer.deleteClearingCounter,
  //   // roles: state.ordersReducer.rolesData,
  //   clearingCounter: state.ordersReducer.clearingCounter,
  //   // editClearingCounter: state.ordersReducer.editClearingCounter,
  // }));
  // const [sizePerPage, setSizePerPage] = useState(10);
  const [SearchInputValue, setSearchInputValue] = useState("");
  const [currentPage, setcurrentPage] = useState(1);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   loadOrders(currentPage, sizePerPage);
  // }, [sizePerPage, 1, clearingCounter]);

  // const loadOrders = (page, limit) => {
  //   setcurrentPage(page);
  //   if (SearchInputValue !== "") {
  //     dispatch(fetchOrders({
  //       page,
  //       limit,
  //       searchText: SearchInputValue,
  //       customerId: clientId
  //     }));
  //   } else {
  //     dispatch(fetchOrders({
  //       page,
  //       limit,
  //       customerId: clientId
  //     }));
  //   }
  // };
  // const numPageRows = (numOfRows) => {
  //   setSizePerPage(numOfRows);
  // };
  // const deleteOrderHandel = () => {
  //   dispatch(deleteOrder(selectedOrder._id));
  // };

  // const searchHandelEnterClik = (event) => {
  //   if (event.keyCode === 13) {
  //     loadOrders(1, sizePerPage);
  //   }
  // };
  // useEffect(() => {
  //   if (deleteClearingCounter > 0 && deleteModal) {
  //     setDeleteOrderModal(false);
  //   }
  // }, [deleteClearingCounter]);
  const [orders, setOrders] = useState({});
  const getData = async () => {
    try {
      const payload = {
        page : currentPage || 1,
        limit : sizePerPage || 10,
        customerId : clientId

      };
      const data = await getOrders({payload});
      setOrders(data);
      
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(()=>{
    getData();
  }, [currentPage, sizePerPage]);
  return (
    <React.Fragment>
      <Notification
        onClose={closeNotifaction}
        body={props.t("Spot Orders has been updated successfully")}
        show={showNotication}
        header={props.t("Spot Orders Update")}
        logo={logo}
      />
      <Row>
        <Col className="col-12">
          <Card>
            <CardHeader className="d-flex flex-column gap-3 ">
              <div className="d-flex justify-content-between align-items-center">
                    
                <CardTitle className="color-primary">{props.t(`Spot Orders (${orders?.totalDocs || 0})`)}</CardTitle>
                <AddSpotOrdersModal />
              </div>
                  
              {/* <div className="d-flex justify-content-between align-items-center">
                <SearchBar handleSearchInput={handleSearchInput} placeholder={props.t("Search For Spot Orders")}/>
                <div>
                  <Dropdown
                    isOpen={btnprimary1}
                    toggle={() => setBtnprimary1(!btnprimary1)}
                  >
                    <DropdownToggle tag="button" className="btn btn-primary">
                      {selectedFilter} <i className="mdi mdi-chevron-down" />
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem value="ALL" onClick={(e)=>{setSelectedFilter(e.target.value)}}>All</DropdownItem>
                      <DropdownItem value="APPROVED" onClick={(e)=>{setSelectedFilter(e.target.value)}}>Approved</DropdownItem>
                      <DropdownItem value="REJECTED" onClick={(e)=>{setSelectedFilter(e.target.value)}}>Rejected</DropdownItem>
                      <DropdownItem value="PENDING" onClick={(e)=>{setSelectedFilter(e.target.value)}}>Pending</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div> */}
                  
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
                          <Th data-priority={index} key={index}><span className="color-primary">{column.text}</span></Th>
                        )}
                      </Tr>
                    </Thead>   
                    {
                      orders?.totalDocs === 0
                        ?
                        <Tbody>
                          {orders?.loading && <TableLoader colSpan={4} />}                            
                          {!orders?.loading &&
                              <>
                                <Tr>
                                  <Td colSpan={"100%"} className="fw-bolder text-center" st>
                                    <h3 className="fw-bolder text-center">No records</h3>
                                  </Td>
                                </Tr>
                              </>
                          }
                        </Tbody>
                        :
                        <Tbody style = {{
                          fontSize: "12px",
                          textAlign: "center",
                          textTransform: "capitalize"
                        }}>
                          {orders?.loading && <TableLoader colSpan={4} />}
                          {!orders?.loading && orders?.docs?.map((row, rowIndex) =>
                            <Tr key={rowIndex}>
                              {columns.map((column, index) =>
                                <Td key={`${rowIndex}-${index}`} className= "pt-4">
                                  { column.dataField === "checkbox" ? <input className = "deposit-checkbox" type="checkbox"/> : ""}
                                  { column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
                                  {/* {column.dataField === "dropdown" ? <CustomDropdown  permission={props.depositsPermissions.actions ? true : false}
                                      id={row._id} status={row.status} approve={()=>{depositApprove(row)}} reject={()=>{depositReject(row)}} /> : ""} */}
                                </Td>
                              )}
                            </Tr>
                          )}
                        </Tbody>
                    }
                  </Table>
                  <CustomPagination
                    {...props}
                    {...orders}
                    setSizePerPage={setSizePerPage}
                    sizePerPage={sizePerPage}
                    page={currentPage}
                    setPage={setcurrentPage}
                    onChange={loadData}
                    docs={orders?.docs}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
}
    
const mapStateToProps = (state) => ({
  loading: state.convertReducer.fetchLoading || false,
  converts: state.convertReducer.converts || [],
  page: state.convertReducer.page || 1,
  totalDocs: state.convertReducer.convertsTotalDocs || 0,
  totalPages: state.convertReducer.totalPages || 0,
  hasNextPage: state.convertReducer.hasNextPage,
  hasPrevPage: state.convertReducer.hasPrevPage,
  limit: state.convertReducer.limit,
  nextPage: state.convertReducer.nextPage,
  pagingCounter: state.convertReducer.pagingCounter,
  prevPage: state.convertReducer.prevPage,
  fetchErrorMEssage:state.convertReducer.errorMessage,
  tradingAccounts: state.tradingAccountReducer.tradingAccounts,
  addConvertSuccess: state.convertReducer.addConvertSuccess
});
export default connect(mapStateToProps, null)(withTranslation()(SpotOrders));