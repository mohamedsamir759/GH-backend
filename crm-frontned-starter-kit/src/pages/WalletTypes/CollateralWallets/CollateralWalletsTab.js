import React, { useState, useEffect } from "react";
import { useDispatch, connect } from "react-redux";
import {
  CardBody, Card, CardHeader
} from "reactstrap";
import CollateralWalletsAdd from "./CollateralWalletsAdd";
import TableLoader from "components/Common/TableLoader";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import DeleteModal from "components/Common/DeleteModal";
import CollateralWalletsEdit from "./CollateralWalletsEdit";
import { withTranslation } from "react-i18next";

function CollateralWalletsTab(props){  
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
  
  ];

  return (

    <React.Fragment>
    
      <Card>
        <CardHeader>
          <div className="d-flex justify-content-end align-items-center">
            <CollateralWalletsAdd/>
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
                className="table "
              >
                <Thead className="text-center">
                  <Tr>
                    {columns.map((column, index) =>
                      <Th data-priority={index} key={index}><span className="color-primary">{column.text}</span></Th>
                    )}
                  </Tr>
                </Thead>
                <Tbody className="text-center" style={{ fontSize:"13px" }}>
                  {props.loading && <TableLoader colSpan={4} />}
                  {!props.loading && props.countries.map((row, rowIndex) =>
                           
                    <Tr key={rowIndex}>
                      {columns.map((column, index) =>
                        <Td key={`${rowIndex}-${index}`}>
                                  
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
      {<CollateralWalletsEdit open={editModal}  onClose={()=>setEditModal(false)}/>}
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
export default connect(mapStateToProps, null)(withTranslation()(CollateralWalletsTab));