import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { 
  Container, Input, Row, Col, Label
} from "reactstrap";
import Select from "react-select";

import { withTranslation } from "react-i18next";
import { fetchDepositGateWay } from "../../../store/history/actions";
import CardWrapper from "components/Common/CardWrapper";
import { getAssetImgSrc } from "helpers/assetImgSrc";
import CustomSelect from "components/Common/CustomSelect";

function AllFilters(props) {
  const dispatch = useDispatch();
  const [currency, setCurrency] = useState();
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [gateway, setGateway] = useState();
  const [status, setStatus] = useState();

  useEffect(() => {
    dispatch(fetchDepositGateWay());

  }, []);

  const currencyOptions = props.assets.map((asset) => {
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
      value: "PENDING", 
      label: "Pending" 
    },
    { 
      value: "APPROVED",
      label: "Approved" 
    },
    { 
      value: "REJECTED",
      label: "Rejected" 
    },
  ];

  const gatewaysKeys = props.depositGateways && Object.keys(props.depositGateways);
  const gatewayOptions = gatewaysKeys?.map((gatewayOption) => {
    return (
      {
        value: gatewayOption,
        label: gatewayOption
      }
    );
  });

  useEffect(() => {
    props.filterHandler({
      currency,
      status,
      gateway,
      fromDate,
      toDate
    });

  }, [currency, fromDate, toDate, gateway, status]);
  
  return (
    <>
      <CardWrapper className="mb-2">
        <Container>
          <h4 className="mb-4">
            {props.t("Filter by")}
          </h4>
          <Row className="mb-2">
            {/* currency */}
            <Col>
              <div>
                <Label>{props.t("Currency")}</Label>
                <CustomSelect
                  isClearable={true}
                  isSearchable={true}
                  options={currencyOptions}
                  onChange={(e) => {
                    setCurrency(e?.value);
                  }}
                />
              </div>
            </Col>

            {/* status */}
            <Col>
              <div>
                <Label>{props.t("Status")}</Label>
                <Select
                  isClearable={true}
                  isSearchable={true}
                  options={statusOptions}
                  onChange={(e) => {setStatus(e?.value)}}
                />
              </div>
            </Col>

            {/* gateWay */}
            <Col>
              <div>
                <Label>{props.t("Gateway")}</Label>
                <Select
                  isClearable={true}
                  isSearchable={true}
                  options={gatewayOptions}
                  onChange={(e) => {setGateway(e?.value)}}
                />
              </div>
            </Col>
          </Row>

          <Row>
            {/* fromDate */}
            <Col>
              <div>
                <Label>{props.t("From Date")}</Label>
                <Input
                  className="form-control"
                  type="date"
                  id="toDate"
                  placeholder={props.t("From date")}
                  onChange={(e) => {setFromDate(e.target.value)}}
                />
              </div>
            </Col>

            {/* toDate */}
            <Col>
              <div>
                <Label>{props.t("To Date")}</Label>
                <Input
                  className="form-control"
                  type="date"
                  id="toDate"
                  placeholder={props.t("To date")}
                  onChange={(e) => {setToDate(e.target.value)}}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </CardWrapper>
    </>
  );
}

const mapStateToProps = (state) => ({
  depositGateways: state.historyReducer.depositGateWays
});

export default connect(mapStateToProps, null)(withTranslation()(AllFilters)); 