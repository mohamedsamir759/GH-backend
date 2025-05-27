import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Container, Spinner } from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";
import CustomTable from "../../components/Common/CustomTable";
import * as content from "content";

function DocumentList(props) {
  const imagesUrl = content.imagesUrl;

  const docs = props.documents?.map(obj => {
    let arr = [obj.file1];
    if (obj.file2) {
      arr.push({ originalname: " " });
      arr.push(obj.file2);
    }
    obj.files = arr;

    return obj;
  });

  const [deleteModal, setDeleteModal] = React.useState({
    show: false,
    documentId: null,
    clientId: null,
  });

  function titleCase(str) {
    let tmpArr = str.toLowerCase().split("_");

    return tmpArr.map(obj => { return obj[0].toUpperCase() + obj.slice(1) }).join(" ");
  }

  function getFileLink(obj){
    return (
      <>
        <a target="_blank" href={`${imagesUrl}${obj.filename}`} rel="noreferrer">{obj.originalname}</a>
        <p />
      </>
    );
  }

  const columns = [
    {
      dataField: "createdAt",
      text: props.t("Created Date"),
      formatter: (val) => (
        new Date(val.createdAt).toLocaleDateString()
      )
    },
    {
      dataField: "type",
      text: props.t("Type"),
      formatter: (val) => (
        titleCase(val.type)
      )
    },
    {
      dataField: "files",
      text: props.t("Files"),
      formatter: (val) => (
        val.files.map(obj => getFileLink(obj))
      )
    },
    {
      dataField: "status",
      text: props.t("Status"),
      formatter: (val) => (
        titleCase(val.status)
      )
    },
    {
      dataField: "status",
      text: "",
      formatter: (val) => {
        return val.rejectionReason ? val.rejectionReason : "-";
      }
    },
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: props.t("Action"),
      formatter: (item, index) => (
        <div className="d-flex gap-3">
          {
            ["PENDING", "EXPIRED", "IN_PROGRESS"].indexOf(item.status) > -1 &&
            <React.Fragment>
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip3"
                  onClick={() => {
                    setDeleteModal({
                      show: true,
                      customerId: item.customerId,
                      documentId: item._id,
                      index,
                      onClose: () => {
                        setDeleteModal({
                          ...deleteModal,
                          show: false,
                        });
                      }
                    });
                  }}
                ></i>
              </Link>
            </React.Fragment>
          }
          {["PENDING", "EXPIRED", "IN_PROGRESS"].indexOf(item.status) === -1 && <React.Fragment>----</React.Fragment>}
        </div>
      ),
    },
  ];
  
  return (
    <Container>
      {
        props.loading 
          ? 
          <div className="d-flex align-items-center justify-content-center">
            <Spinner /> 
          </div> 
          : 
          <>
            {
              props.documents?.length > 0 
                ? 
                <CustomTable
                  columns={columns}
                  rows={docs}
                />
                : 
                <div className="d-flex align-items-center justify-content-center">
                  {props.t("No document uploaded")}
                </div>
            }
          </>
      }
    </Container>
  );
}

const mapStateToProps = (state) => ({
  loading: state.documents.loading,
  clearChangeStatus: state.documents.clearChangeStatus,
  clearDelete: state.documents.clearDelete,
  documents: state.documents.documents,
  error: state.documents.error
});
export default connect(mapStateToProps, null)(withTranslation()(DocumentList));  