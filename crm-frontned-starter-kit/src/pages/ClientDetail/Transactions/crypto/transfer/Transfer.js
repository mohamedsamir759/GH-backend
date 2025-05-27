import React from "react";
import { connect } from "react-redux";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

// i18n
import { withTranslation } from "react-i18next";

import Activities from "./Activities";
import { useParams } from "react-router-dom";

function Transfer(props) {
  const { clientId } = useParams();
  return (
    <>
      <Activities clientId={clientId}/>
    </>
  );
}

const mapStateToProps = (state) => ({
  fx: state.clientReducer.clientDetails.fx
});

export default connect(mapStateToProps, null)(withTranslation()(Transfer));
