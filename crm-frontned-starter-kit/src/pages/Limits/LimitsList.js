import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { connect, useDispatch } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  UncontrolledAlert,
} from "reactstrap";
import { deleteMarkupStart } from "store/markups/actions";
import {
  Table, Thead, Tbody, Tr, Th
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import CustomPagination from "components/Common/CustomPagination";
import { Link } from "react-router-dom";
import MarkupEdit from "./LimitsEdit";
import DeleteModal from "components/Common/DeleteModal";
import AddLimits from "./AddLimits";
import { MetaTags } from "react-meta-tags";
import formatDate from "helpers/formatDate";


function LimitsList(props) {
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [selectedMarkup, setSelectedMarkup] = useState();
  const t = props.t;
  const { update, delete:deletePermission } = props.markupsPermissions;
  const dispatch = useDispatch();


  const columns = [
    {
      dataField: "id",
      text: props.t("ID"),
    },
    {
      dataField: "type",
      text: props.t("Type"),
    },  
    {
      dataField: "limit",
      text: props.t("Limit"),
    }, 
    {
      dataField: "whitelist",
      text: props.t("Whitelist"),
    },
    {
      dataField: "status",
      text: props.t("Status"),
    },
    {
      dataField: "createdAt",
      text: props.t("Create Time"),
    },
    {
      dataField: "updatedAt",
      text: props.t("Upadate Time"),
    },
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: props.t("Operation"),
      formatter: (item) => (
        <div className="d-flex gap-3">
          <Link className={`text-success ${!update ? "d-none" : ""}`} to="#">
            <i
              className="mdi mdi-pencil font-size-18"
              id="edittooltip"
              onClick={() => {
                setSelectedMarkup(item);
                setEditModal(true);
              }}
            ></i>
          </Link>
          <Link className={`text-danger ${!deletePermission ? "d-none" : ""}`} to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => {
                setSelectedMarkup(item);
                setDeleteModal(true);
              }}
            ></i>
          </Link>
        </div>
      ),
    },
  ];


  const deleteMarkup = () => {
    dispatch(deleteMarkupStart(selectedMarkup._id));
  };

  useEffect(() => {
    if (props.closeDeleteModal)
      setDeleteModal(false);
  }, [props.closeDeleteModal]);

  useEffect(() => {
    if (props.deleteModalClear && deleteModal) {
      setDeleteModal(false);
    }
  }, [props.deleteModalClear]);

  return (<>
    <React.Fragment>
      <MetaTags>
        <title>
          Limits
        </title>
      </MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          <h2>{t("Limits")}</h2>
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between  align-items-center">
                    <CardTitle className="color-primary">
                      {props.t("Limits List")} ({props.totalDocs})
                    </CardTitle>
                    <AddLimits/>
                  </div>
                </CardHeader>
                <CardBody>
                  {props.error ? <>
                    <UncontrolledAlert color="danger">
                      <i className="mdi mdi-block-helper me-2"></i>
                      {props.t(props.error)}
                    </UncontrolledAlert>
                  </> : <div className="table-rep-plugin">
                    <div
                      className="table-responsive mb-0"
                      data-pattern="priority-columns"
                    >
                      <Table
                        id="tech-companies-1"
                        className="table table-hover"
                      >
                        <Thead className="text-center table-light" >
                          <Tr>
                            {columns.map((column, index) => (
                              <Th data-priority={index} key={index}>
                                <span className="color-primary">{column.text}</span>
                              </Th>
                            ))}
                          </Tr>
                        </Thead>
                        <Tbody>
                          {/* Into Data in this part  */}
                        </Tbody>
                      </Table>
                      <CustomPagination
                        {...props}
                        setSizePerPage={setSizePerPage}
                        sizePerPage={sizePerPage}
                        docs={props.markups}
                      />
                    </div>
                  </div>}

                </CardBody>
              </Card>
            </Col>
          </Row>
          <MarkupEdit
            open={editModal}
            markup={selectedMarkup}
            onClose={() => setEditModal(false)}
          />
          <DeleteModal loading={props.deleteLoading} onDeleteClick={deleteMarkup} show={deleteModal} onCloseClick={() => setDeleteModal(false)} />
        </div>
      </div>
    </React.Fragment>
  </>);
}
const mapStateToProps = (state) => ({
  loading: state.markupsReducer.loading || false,
  markups: state.markupsReducer.markups || [],
  page: state.markupsReducer.page || 1,
  totalDocs: state.markupsReducer.totalDocs || 0,
  totalPages: state.markupsReducer.totalPages || 0,
  hasNextPage: state.markupsReducer.hasNextPage,
  hasPrevPage: state.markupsReducer.hasPrevPage,
  limit: state.markupsReducer.limit,
  nextPage: state.markupsReducer.nextPage,
  pagingCounter: state.markupsReducer.pagingCounter,
  prevPage: state.markupsReducer.prevPage,
  deleteLoading: state.markupsReducer.deleteLoading,
  deleteModalClear: state.markupsReducer.deleteModalClear,
  error: state.markupsReducer.error,
  addMarkupSuccess: state.markupsReducer.addMarkupSuccess,
  editR: state.markupsReducer.editR,
  markupsPermissions : state.Profile.markupsPermissions || {}
});

export default connect(mapStateToProps, null)(withTranslation()(LimitsList));