import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { 
  Container, Input, Row, Col, Label 
} from "reactstrap";
import Select from "react-select";

import { withTranslation } from "react-i18next";
import CardWrapper from "components/Common/CardWrapper";
import CustomSelect from "components/Common/CustomSelect";
import { getAssetImgSrc } from "helpers/assetImgSrc";

function ConvertFilter(props) {
  const [fromDate, setFromDate] = useState();
  const [status, setStatus] = useState();
  const [toDate, setToDate] = useState();
  const [fromAsset, setFromAsset] = useState();
  const [toAsset, setToAsset] = useState();

  const fromAssetOptions = props.assets.map((asset) => {
    return (
      {
        value: asset.symbol,
        label: asset.symbol,
        image: getAssetImgSrc(asset)
      }
    );
  });

  const toAssetOptions = props.assets.map((asset) => {
    return (
      {
        value: asset.symbol,
        label: asset.symbol,
        image: getAssetImgSrc(asset)
      }
    );
  });

  const statusOptions = [
    {
      label: "Open",
      value: "open"
    },
    {
      label: "Closed",
      value: "closed"
    },
    {
      label: "Rejected",
      value: "rejected"
    }
  ];

  useEffect(() => {
    props.filterHandler({
      fromDate,
      toDate,
      status,
      fromAsset,
      toAsset
    });

  }, [fromAsset, toAsset, fromDate, toDate, status]);
  
  return (
    <>
      <CardWrapper className="mb-2">
        <Container>
          <h4 className="mb-4">
            {props.t("Filter by")}
          </h4>
          <Row className="mb-2">
            {/* from asset */}
            <Col>
              <Label>{props.t("From Asset")}</Label>
              <div>
                <CustomSelect
                  isClearable={true}
                  isSearchable={true}
                  options={fromAssetOptions}
                  onChange={(e) => {
                    setFromAsset(e?.value);
                  }}
                />
              </div>
            </Col>

            {/* to asset */}
            <Col>
              <Label>{props.t("To Asset")}</Label>
              <div>
                <CustomSelect
                  isClearable={true}
                  isSearchable={true}
                  options={toAssetOptions}
                  onChange={(e) => {
                    setToAsset(e?.value);
                  }}
                />
              </div>
            </Col>

            {/* status */}
            <Col>
              <Label>{props.t("status")}</Label>
              <Select
                isClearable={true}
                isSearchable={true}
                options={statusOptions}
                onChange={(e) => {setStatus(e?.value)}}
              />
            </Col>
          </Row>

          <Row>
            {/* fromDate */}
            <Col>
              <Label>{props.t("From Date")}</Label>
              <Input
                className="form-control"
                type="date"
                id="toDate"
                placeholder={props.t("From date")}
                onChange={(e) => {setFromDate(e.target.value)}}
              />
            </Col>

            {/* toDate */}
            <Col>
              <Label>{props.t("To Date")}</Label>
              <Input
                className="form-control"
                type="date"
                id="toDate"
                placeholder={props.t("To date")}
                onChange={(e) => {setToDate(e.target.value)}}
              />
            </Col>
          </Row>
        </Container>
      </CardWrapper>
    </>
  );
}

const mapStateToProps = (state) => ({
  withdrawalGateWays: state.historyReducer.withdrawalGateWays
});

export default connect(mapStateToProps, null)(withTranslation()(ConvertFilter)); 