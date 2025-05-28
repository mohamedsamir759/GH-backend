import React, { useState } from "react";
import FeatherIcon from "feather-icons-react";
import useModal from "hooks/useModal";
import { useTranslation } from "react-i18next";
import {
  Modal, ModalHeader,
  ModalBody,
  Row, Col, Button, Input, Label
} from "reactstrap";
import { startCase } from "lodash";
import {
  AvField, AvForm
} from "availity-reactstrap-validation";
import SearchableComponent from "pages/Transactions/Forex/internalTransfer/SearchableComponents";
import { searchMarketFromExchangeAPI, updateMarketConfiguration } from "apis/markets";
import { useDispatch } from "react-redux";
import { showErrorNotification, showSuccessNotification } from "store/actions";
import { fetchMarketsStart } from "store/markets/actions";

function MarketConfigModal(props) {
  const {
    item, type, show, toggle, tags
  } = props;
  const { 
    name, enabled, instance, count, enabledName
  } = tags;
  const { baseAsset, quoteAsset } = item;

  const [isEnabled, setIsEnabled] = useState(enabled);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  return <Modal isOpen={show} toggle={toggle} centered={true}>
    <ModalHeader toggle={toggle} tag="h4">
      {startCase(type)} {t("Market Configuration")}
    </ModalHeader>
    <ModalBody>
      <AvForm
        className='p-4'
        onValidSubmit={(e, v) => {
          const obj = {
            [enabledName]: isEnabled,
            marketId: item._id,
            [`${name.toLowerCase()}Instance`]: v[`${name.toLowerCase()}Instance`] || instance,
          };
          console.log(obj, v, instance);
          if (isEnabled && !v[`${name.toLowerCase()}Instance`]) {
            return dispatch(showErrorNotification("Please select Symbol(s) for the market"));
          }
          setLoading(true);
          updateMarketConfiguration(obj).then((res) => {
            if (!res.isSuccess) throw new Error(res.message);
            dispatch(showSuccessNotification("Market Configuration Updated Successfully"));
          }).catch((err) => {
            dispatch(showErrorNotification(err.message));
          }).finally(() => {
            setLoading(false);
            dispatch(fetchMarketsStart({
              limit: 10,
              page: 1,
            }));
          });
        }}
      >
        <Row>
          <Col md="12">
            <AvField
              name="name"
              value={item.pairName}
              type="text"
              label={t("PairName")}
              disabled
            />
          </Col>
          <Col md="12 my-2">
            <Label>{startCase(enabledName)} ?</Label>
            <div className="text-center">
              <Input type="checkbox" id={"id"} switch="none"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
              />
              <Label className="me-1" htmlFor={"id"} data-on-label="" data-off-label=""></Label>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            {console.log("instance", instance)}
            {
              isEnabled && <SearchableComponent
                isRequired
                name={`${name?.toLowerCase()}Instance`}
                label={`${name} Exchange Name`}
                defaultOptions={[{
                  value: instance,
                  label: item.pairName,
                }]}
                value={instance}
                getData={async (payload) => searchMarketFromExchangeAPI(payload).then((res) => {
                  if (res.result) {
                    if (["SPOT", "MARGIN"].includes(type)) {
                      return res.result.filter(market => {
                        return market[`is${name}`]
                          && (market.baseAsset?.toLowerCase().includes(baseAsset?.toLowerCase()) && market.quoteAsset?.toLowerCase().includes(quoteAsset?.toLowerCase()));
                      }).slice(0, 5);
                    } else {
                      return res.result.filter(market => {
                        return market[`is${name}`]
                          && (market.baseAsset?.toLowerCase().includes(baseAsset?.toLowerCase()) && market.quoteAsset?.toLowerCase().includes(quoteAsset?.toLowerCase()));
                      }).slice(0, 5);
                    }
                  }
                  return [];
                })}
                shouldReset={`${baseAsset}-${quoteAsset}`}
                mapper={(market) => ({
                  value: market.id,
                  label: market.symbol,
                })}
                isMulti={count > 1}
              />
            }
          </Col>
        </Row>
        <Row>
          {
            loading ? <Col md="12" className="text-center">
              <Button color="primary" type="button" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              </Button>
            </Col> : <Col md="12" className="text-center">
              <Button color="primary" type="submit" >
                {t("Save")}
              </Button>
            </Col>
          }
        </Row>
      </AvForm>
    </ModalBody>
  </Modal>;
}

export default function MarketConfig(props) {
  const {
    item, type
  } = props;

  const [showModal, setShowModal] = useModal();

  const handleOnClick = () =>  setShowModal();
  const getTagName = () => {
    if (type === "SPOT") {
      return {
        name: "Spot",
        enabledName: "isSpotEnabled",
        enabled: item.isSpotEnabled,
        instance: item.spotInstance,
        count: 1,
      };
    }

    if (type === "MARGIN") {
      return {
        name: "Margin",
        enabledName: "isMarginEnabled",
        enabled: item.isMarginEnabled,
        instance: item.spotInstance,
        count: 1,
      };
    }

    if (type === "FUTURES") {
      return {
        name: "Futures",
        enabledName: "isFuturesEnabled",
        enabled: item.isFuturesEnabled,
        instance: item.spotInstance,
        count: 2
      };
    }
  };

  return <div>
    <FeatherIcon
      icon={getTagName().enabled ? "check" : "x"} className={getTagName().enabled ? "text-success cursor-pointer" : "text-danger cursor-pointer"}
      onClick={handleOnClick}
    />
    {showModal && <MarketConfigModal
      item={item} type={type} show={showModal} toggle={setShowModal}
      tags={getTagName()}
    />}
  </div>;
}
