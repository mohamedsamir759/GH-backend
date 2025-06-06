import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import {
  Card, CardBody, CardHeader 
} from "reactstrap";
import { Link } from "react-router-dom";
import MarkupsAdd from "./MarkupAdd";
import DeleteModal from "components/Common/DeleteModal";
import TableLoader from "components/Common/TableLoader";
import MarkupEdit from "./MarkupEdit";
import { removeItem } from "store/dictionary/actions";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import { withTranslation } from "react-i18next";
import { captilazeFirstLetter } from "common/utils/manipulateString";
function MarkupsTab(props){
  
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletedItem, setDeletedItem] = useState();
  const [editModal, setEditModal] = useState(false);
  const [selectedMarkup, setSelectedMarkup] = useState();
  const { update, delete:deletePermission } = props.dictionariesPermissions;
  const dispatch = useDispatch();
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
      dataField:"markups",
      text:props.t("Name"), 
      formatter:(value)=>captilazeFirstLetter(value.markups)
    }, 
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: props.t("Action"),
      formatter: (item) => (
        <div className="d-flex gap-3">
          <Link className={`text-success ${!update ? "d-none" : ""}`} to="#">
            <i
              className="mdi mdi-pencil font-size-18"
              id="edittooltip"
              onClick={() => {setSelectedMarkup(item); setEditModal(!editModal)}}
            ></i>
          </Link>
          <Link className={`text-danger ${!deletePermission ? "d-none" : ""}`} to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => {setDeleteModal(!deleteModal); setDeletedItem(item)}}
            ></i>
          </Link>
        </div>
      ),
    },
    
  ];
  const customData = props.dictionary[0] ? props.markups.map(markup=>{
    return {
      markups:markup 
    };
  }) : [] ; 
  const deleteAction = ()=> {
    dispatch(removeItem(props.id, deletedItem));
  };

  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <div className="d-flex justify-content-end  align-items-center">
            <MarkupsAdd />
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
                <Thead >
                  <Tr>
                    {columns.map((column, index) =>
                      <Th data-priority={index} key={index}><span className="color-primary">{column.text}</span></Th>
                    )}
                  </Tr>
                </Thead>
                <Tbody  style={{ fontSize: "13px" }}>
                  {props.loading && <TableLoader colSpan={4} />}
                  {!props.loading && customData.map((row, rowIndex) =>
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
      {<MarkupEdit open={editModal} selectedMarkup ={selectedMarkup} onClose= {()=>setEditModal(false)}/>}
      {<DeleteModal loading={props.disableDeleteButton} show={deleteModal} onDeleteClick={deleteAction} onCloseClick={()=>setDeleteModal(false)}/>}
    </React.Fragment>
  );
}
const mapStateToProps = (state)=>({
  loading: state.dictionaryReducer.loading || false,
  dictionary: state.dictionaryReducer.dictionary || [],
  error : state.dictionaryReducer.error,
  markups :state.dictionaryReducer.markups || [],
  id :state.dictionaryReducer.id,
  deleteLoading : state.dictionaryReducer.deleteLoading,
  editSuccess :state.dictionaryReducer.editSuccess,
  clearDeleteModal :state.dictionaryReducer.clearDeleteModal,
  dictionariesPermissions : state.Profile.dictionariesPermissions || {},
  disableDeleteButton : state.dictionaryReducer.disableDeleteButton
});
export default connect(mapStateToProps, null)(withTranslation()(MarkupsTab));