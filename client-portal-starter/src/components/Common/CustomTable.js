import React from "react";
import {
  Table, Thead, Tbody, Tr, Th, Td 
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
//i18n
import { withTranslation } from "react-i18next";
import TableLoader from "./TableLoader";

function CustomTable({ columns = [], rows = [], loading = false, ...props }) {
  return (<>
    <div className="table-rep-plugin custom-table">
      <div
        className="table-responsive mb-0"
        data-pattern="priority-columns"
      >
        <Table
          id="tech-companies-1"
          className="table"
        >
          <Thead>
            <Tr>
              {columns.map((column, index) => (
                <Th data-priority={index} key={`colmun-${index}`}>{props.t(column.text)}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {loading && <TableLoader colSpan={4} />}
            {!loading && rows.map((row, rowIndex) => (
              <React.Fragment key={`$row-${rowIndex}`}>
                <Tr className="not-empty-row">
                  {columns.map((column, index) => {
                    return <Td key={`${rowIndex}-${index}`} style={{ verticalAlign: "middle" }}>
                      {column.formatter
                        ? column.formatter(row, rowIndex)
                        : row[column.dataField]}
                    </Td>;
                  })}
                </Tr>
                <Tr className="empty-row"></Tr>
              </React.Fragment>    
            ))}
            {!loading && rows.length === 0 && (
              <Td colSpan={"100%"} className="text-center">{props.t("There are no records")}</Td>
            )}
          </Tbody>
        </Table>
      </div>
    </div>
  </>);
}
export default withTranslation()(CustomTable); 