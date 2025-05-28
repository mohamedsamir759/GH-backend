import React, { useEffect, useState } from "react";
import { 
  useDispatch, connect 
} from "react-redux";
import { Link } from "react-router-dom";
import {
  Row, Col, Card, CardBody, CardTitle, CardHeader 
} from "reactstrap";
import {
  Table, Thead, Tbody, Tr, Th
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import CustomPagination from "components/Common/CustomPagination";
import {  deleteSymbolStart } from "store/assests/actions";
import BannersAdd from "./BannersAdd";
import BannersEdit from "./BannersEdit";
import DeleteModal from "components/Common/DeleteModal";
import { withTranslation } from "react-i18next";
import { checkAllBoxes } from "common/utils/checkAllBoxes";
import { MetaTags } from "react-meta-tags";
function BannersList(props){
  const [selectedBanners, setSelectedBanner] = useState();
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  //  ===^^^^^ please add replace symbolsPermissions to bannersPermissions
  const columns = [
    {
      dataField:"language",
      text:props.t("Language"),
    },
    {
      dataField:"type",
      text:props.t("Type"),
    },
    {
      dataField:"title",
      text:props.t("Title"),
    },
    {
      dataField:"description",
      text:props.t("Description"),
    },
    {
      dataField:"imageUrl",
      text:props.t("Image Url")
    },
    {
      dataField: "redirectUrl",
      text: props.t("Redirect Url"),
    
    },
    {
      dataField:"platform",
      text:props.t("Language"),
    },
    {
      dataField:"createdAt",
      text:props.t("Created At "),
    },
    {
      dataField:"updatedAt",
      text:props.t("Updated At "),
    },
    {
      dataField:"status",
      text:props.t("Status "),
    },
    {
      dataField:"createdBy",
      text:props.t(" Created by "),
    },
  ];
 
  const [sizePerPage, setSizePerPage] = useState(10);
  
  const dispatch = useDispatch();
   
  
  const deleteSymbol = ()=>{
  
    dispatch(deleteSymbolStart(setSelectedBanner._id));
  };
  useEffect(()=>{
    
    if (props.deleteModalClear && deleteModal) {
      setDeleteModal(false);
    }
  }, [props.deleteModalClear]);
  return (
    <React.Fragment>
      <MetaTags>
        <title>
          Banners
        </title>
      </MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          <h2>{props.t("Banners")}</h2>
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between  align-items-center">
                    <CardTitle className="color-primary">{props.t("Banners List")} ({props.totalDocs})</CardTitle>
                    <BannersAdd/>
                  </div>
                  
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
                        <Tbody style={{
                          fontSize: "12px",
                          textAlign: "center",
                          textTransform: "capitalize"
                        }}>
                          {/* Into Data  */}
                        </Tbody>
                      </Table>
                      <CustomPagination
                        {...props}
                        setSizePerPage={setSizePerPage}
                        sizePerPage={sizePerPage}
                        docs={props.assets}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {<BannersEdit open={editModal} onClose={()=>setEditModal(false)}/>}
          {<DeleteModal loading={props.deleteLoading} onDeleteClick = {deleteSymbol} show={deleteModal}  onCloseClick={()=>setDeleteModal(false)}/>}
        </div>
      </div>
    </React.Fragment>
  );
  
}

const mapStateToProps = (state) => ({
  loading: state.assetReducer.loading || false,
  assets: state.assetReducer.assets || [],
  page: state.assetReducer.page || 1,
  totalDocs: state.assetReducer.totalDocs || 0,
  totalPages: state.assetReducer.totalPages || 0,
  hasNextPage: state.assetReducer.hasNextPage,
  hasPrevPage: state.assetReducer.hasPrevPage,
  limit: state.assetReducer.limit,
  nextPage: state.assetReducer.nextPage,
  pagingCounter: state.assetReducer.pagingCounter,
  prevPage: state.assetReducer.prevPage,
  deleteLoading:state.assetReducer.deleteLoading,
  deleteModalClear:state.assetReducer.deleteModalClear,
  symbolsPermissions : state.Profile.symbolsPermissions || {}
});
export default connect(mapStateToProps, null)(withTranslation()(BannersList));
