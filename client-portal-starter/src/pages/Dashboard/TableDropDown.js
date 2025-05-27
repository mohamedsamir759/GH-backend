import React, { useState } from "react";
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle 
} from "reactstrap";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

const TableDropDown = () => {
  const [drp_primary1, setDrp_primary1] = useState(false);

  return (
    <div className="">
      <Dropdown
        isOpen={drp_primary1}
        toggle={() => setDrp_primary1(!drp_primary1)}
      >
        <DropdownToggle caret color='link'
        >
          <i className='bx bx-dots-vertical'></i>
        </DropdownToggle>
        <DropdownMenu
          end="true"
        >
          <DropdownItem header>
                      Header
          </DropdownItem>
          <DropdownItem>
                      Some Action
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem>
                      Foo Action
          </DropdownItem>
          <DropdownItem>
                      Bar Action
          </DropdownItem>
          <DropdownItem>
                      Quo Action
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default TableDropDown;