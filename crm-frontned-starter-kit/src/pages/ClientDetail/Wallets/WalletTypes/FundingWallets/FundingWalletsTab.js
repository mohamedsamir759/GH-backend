import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  CardBody, Card, CardHeader
} from "reactstrap";
import FundingWalletsAdd from "./FundingWalletsAdd";
import TableLoader from "components/Common/TableLoader";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import DeleteModal from "components/Common/DeleteModal";
import FundingWalletsEdit from "./FundingWalletsEdit";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function FundingWalletsTab(props){  
  const {wallets} = props;
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState();
  useEffect(()=>{
    if (!props.editSuccess && editModal){
      setEditModal(false);
    }
  }, [props.editSuccess]);
  useEffect(()=>{
    if (props.clearDeleteModal && deleteModal){
      setDeleteModal(false);
    }
  }, [props.clearDeleteModal]);
  const columns = [ 
    {
      dataField: "asset",
      text: props.t("Asset"),
    },
    {
      dataField: "amount",
      text: props.t("Amount"),
    },
    {
      dataField: "isCrypto",
      text: props.t("Crypto"),
      formatter: (val) => <p>{val?.isCrypto ? "True" : "False"}</p>,
    },
    // {
    //   dataField: "bouns_amount",
    //   text: props.t("Bonus"),
    //   formatter: (val) => <p>{val?.bouns_amount ? val?.bouns_amount : 0}</p>,
    // },
    {
      dataField: "address",
      text: props.t("Address"),
      formatter: (val) => <p>{val?.address ? val?.address : "---"}</p>,
    },
    {
      dataField: "freezeAmount",
      text: props.t("Freeze Amount"),
    },
    {
      dataField: "active",
      text: props.t("Status"),
      formatter: (val) => <p>{`${val?.isCrypto}`}</p>,
    },
    // {
    //   dataField: "",
    //   isDummyField: true,
    //   editable: false,
    //   text: props.t("Actions"),
    // }
  ];

  return (

    <React.Fragment>
    
      <Card>
        <CardHeader>
          {/* <div className="d-flex justify-content-end align-items-center">
            <FundingWalletsAdd/>
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
                className="table "
              >
                <Thead className="text-center">
                  <Tr>
                    {columns.map((column, index) =>
                      <Th data-priority={index} key={index}><span className="color-primary">{column.text}</span></Th>
                    )}
                  </Tr>
                </Thead>
                <Tbody>
                  {props.loading && <TableLoader colSpan={4} />}
                  {!props.loading && wallets?.length === 0 &&
                    <>
                      <Tr>
                        <Td colSpan={"100%"} className="fw-bolder text-center" st="true">
                          <h3 className="fw-bolder text-center">No records</h3>
                        </Td>
                      </Tr>
                    </>
                  }
                  {!props.loading && wallets?.map((row, rowIndex) =>
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
                    
            </div>
          </div>
        </CardBody>
      </Card>
      {/* {<FundingWalletsEdit open={editModal}  onClose={()=>setEditModal(false)}/>} */}
      {<DeleteModal loading= {props.disableDeleteButton} show ={deleteModal}  onCloseClick={()=>setDeleteModal(false)}/>}
    </React.Fragment>
  );
}
const mapStateToProps = (state)=>({
  dictionary:state.dictionaryReducer.dictionary || [],
  countries :state.dictionaryReducer.countries || [],
  id:state.dictionaryReducer.id,
  editSuccess:state.dictionaryReducer.editSuccess,
  deleteLoading:state.dictionaryReducer.deleteLoading,
  clearDeleteModal :state.dictionaryReducer.clearDeleteModal,
  dictionariesPermissions:state.Profile.dictionariesPermissions || {},
  disableDeleteButton : state.dictionaryReducer.disableDeleteButton
});
export default connect(mapStateToProps, null)(withTranslation()(FundingWalletsTab));