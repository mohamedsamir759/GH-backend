import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

//import drawer
import ReactDrawer from "react-drawer";
import "react-drawer/lib/react-drawer.css";

// Import menuDropdown
import LanguageDropdown from "../CommonForBoth/TopbarDropdown/LanguageDropdown";
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";
import RightSidebar from "../CommonForBoth/RightSidebar";
import LightDark from "../CommonForBoth/Menus/LightDark";

// import images
import * as content from "content";

//i18n
import { withTranslation } from "react-i18next";

// Redux Store
import {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
  changelayoutMode
} from "../../store/actions";
import PortalEntryPoint from "./PortalEntryPoint";

const Header = props => {
  const { onChangeLayoutMode } = props;
  const [search, setsearch] = useState(false);
  const [isClick, setClick] = useState(true);
  const [position] = useState();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const onDrawerClose = () => {
    setOpen(false);
  };

  useEffect(()=>{
    if (window.innerWidth < 993)
      document.querySelector("#vertical-menu-btn svg").style.transform = "scale(-1,-1)";
  }, []);
  /*** Sidebar menu icon and default menu set */
  function tToggle() {
    var body = document.body;
    setClick(!isClick);
    if (isClick === true) {
      body.classList.add("sidebar-enable");
      document.body.setAttribute("data-sidebar-size", "sm");
    } else {
      body.classList.remove("sidebar-enable");
      document.body.setAttribute("data-sidebar-size", "lg");
    }
  }
  useEffect(() => {
    var body = document.body;
    const isSidebarEnable = body.classList.contains("sidebar-enable");
    const sidebarIcon = document.querySelector("#vertical-menu-btn svg");
    //for big screens
    if (window.innerWidth > 993){
      if (isSidebarEnable) {
        sidebarIcon.style.transform = "scale(-1,-1)";
      } else sidebarIcon.style.transform = "scale(1,-1)";
    } else {    
      if (isSidebarEnable)
        sidebarIcon.style.transform = "scale(1,-1)";
      else
        sidebarIcon.style.transform = "scale(-1,-1)";

    }

  }, [isClick]);
  return (
    <React.Fragment>
      <PortalEntryPoint />
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box">
              <Link to="/dashboard" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={content.mainLogo} alt="" height="24" />
                </span>
                <span className="logo-lg">
                  <img src={content.mainLogo} alt="" height="24" /> <span className="logo-txt">{content.clientName}</span>
                </span>
              </Link>

              <Link to="/dashboard" className="logo logo-light">
                <span className="logo-sm">
                  <img src={content.mainLogo} alt="" height="24" />
                </span>
                <span className="logo-lg">
                  <img src={content.mainLogo} alt="" height="24" /> <span className="logo-txt">{content.clientName}</span>
                </span>
              </Link>
            </div>
            <button
              onClick={() => {
                tToggle();
              }}

              type="button" className="btn btn-sm px-3 font-size-16 header-item" id="vertical-menu-btn">
              {props.layoutMode === "dark" ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M22 12H3" stroke="#ffffff"></path>
                <g stroke="#ffffff">
                  <path d="M22 4H13"></path>
                  <path opacity=".301" d="M22 20H13"></path>
                </g>
                <path d="M7 7l-5 5 5 5" stroke="#ffffff"></path>
              </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M22 12H3" stroke="#11142d"></path>
                <g stroke="#808191">
                  <path d="M22 4H13"></path>
                  <path opacity=".301" d="M22 20H13"></path>
                </g>
                <path d="M7 7l-5 5 5 5" stroke="#11142d"></path>
              </svg>}
            </button>
            <form className="app-search d-none d-lg-block">
              <div className="position-relative">
                <input type="text" className="form-control" placeholder="Search..." />
                <button className="btn fs-4 d-flex align-items-center" type="button">
                  <i className="bx bx-search-alt-2 align-middle" />
                </button>
              </div>
            </form>
          </div>

          <div className="d-flex">
            <div className="dropdown d-inline-block d-lg-none ms-2">
              <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                aria-labelledby="page-header-search-dropdown">

                <form className="p-3">
                  <div className="form-group m-0">
                    <div className="input-group">
                      <input type="text" className="form-control" placeholder="Search ..." aria-label="Search Result" />

                      <button className="btn btn-primary" type="submit"><i className="mdi mdi-magnify"></i></button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

          </div>
          <div className="d-flex">
            <div className="dropdown d-inline-block d-lg-none ms-2">
              <button
                onClick={() => {
                  setsearch(!search);
                }}
                type="button"
                className="btn header-item noti-icon "
                id="page-header-search-dropdown"
              >
                <i className="mdi mdi-magnify" />
              </button>
              <div
                className={
                  search
                    ? "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show"
                    : "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                }
                aria-labelledby="page-header-search-dropdown"
              >
                <form className="p-3">
                  <div className="form-group m-0">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search ..."
                        aria-label="Recipient's username"
                      />
                      <div className="input-group-append">
                        <button className="btn btn-primary" type="submit">
                          <i className="mdi mdi-magnify" />
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <LanguageDropdown />

            {/* light / dark mode */}
            <LightDark layoutMode={props["layoutMode"]} onChangeLayoutMode={onChangeLayoutMode} />

            {/* <Dropdown
              className="d-none d-lg-inline-block ms-1"
              isOpen={socialDrp}
              toggle={() => {
                setsocialDrp(!socialDrp);
              }}
            >
              <DropdownToggle
                className="btn header-item noti-icon "
                tag="button"
              >
                <FeatherIcon
                  icon="grid"
                  className="icon-lg"
                />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-lg dropdown-menu-end">
                <div className="p-2">
                  <Row className="g-0">
                    <Col>
                      <Link className="dropdown-icon-item" to="#">
                        <img src={github} alt="Github" />
                        <span>GitHub</span>
                      </Link>
                    </Col>
                    <Col>
                      <Link className="dropdown-icon-item" to="#">
                        <img src={bitbucket} alt="bitbucket" />
                        <span>Bitbucket</span>
                      </Link>
                    </Col>
                    <Col>
                      <Link className="dropdown-icon-item" to="#">
                        <img src={dribbble} alt="dribbble" />
                        <span>Dribbble</span>
                      </Link>
                    </Col>
                  </Row>

                  <Row className="g-0">
                    <Col>
                      <Link className="dropdown-icon-item" to="#">
                        <img src={dropbox} alt="dropbox" />
                        <span>Dropbox</span>
                      </Link>
                    </Col>
                    <Col>
                      <Link className="dropdown-icon-item" to="#">
                        <img src={mail_chimp} alt="mail_chimp" />
                        <span>Mail Chimp</span>
                      </Link>
                    </Col>
                    <Col>
                      <Link className="dropdown-icon-item" to="#">
                        <img src={slack} alt="slack" />
                        <span>Slack</span>
                      </Link>
                    </Col>
                  </Row>
                </div>
              </DropdownMenu>
            </Dropdown> */}

            <NotificationDropdown />
            {/* <div
              onClick={toggleTopDrawer} disabled={open}
              className="dropdown d-inline-block"
            >
              <button
                type="button"
                className="btn header-item noti-icon right-bar-toggle "
              >
                <FeatherIcon
                  icon="settings"
                  className="icon-lg"
                />
              </button>
            </div> */}
            <ProfileMenu />

          </div>
        </div>
      </header>
      <ReactDrawer
        open={open}
        position={position}
        onClose={onDrawerClose}
      >
        <RightSidebar onClose={onDrawerClose} onChangeLayoutMode={onChangeLayoutMode} />
      </ReactDrawer>
    </React.Fragment>
  );
};

Header.propTypes = {
  changeSidebarType: PropTypes.func,
  leftMenu: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
  changelayoutMode: PropTypes.func,
  layoutMode: PropTypes.any,
};

const mapStatetoProps = state => {
  const {
    layoutType,
    showRightSidebar,
    leftMenu,
    layoutMode
  } = state.Layout;
  return {
    layoutType,
    showRightSidebar,
    leftMenu,
    layoutMode 
  };
};

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  changelayoutMode,
  toggleLeftmenu,
  changeSidebarType,
})(withTranslation()(Header));
