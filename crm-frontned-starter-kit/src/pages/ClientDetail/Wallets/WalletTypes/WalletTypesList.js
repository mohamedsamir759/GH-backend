import React, { useEffect, useState } from "react";
import { useDispatch, connect } from "react-redux";

import { fetchDictionaryStart } from "store/dictionary/actions";
import {
  Card,
  CardBody,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import { MetaTags } from "react-meta-tags";
import TradingWalletsTab from "./TradingWallets/TradingWalletsTab";
import CollateralWalletsTab from "./CollateralWallets/CollateralWalletsTab";
import FundingWalletsTab from "./FundingWallets/FundingWalletsTab";
import { useParams } from "react-router-dom";
import { getClientWalletDetailsListed } from "apis/wallet";
import FuturesWalletsTab from "./FuturesWallets/FuturesWalletsTab";
function WalletTypesList() {
  const dispatch = useDispatch();
  const params = useParams();
  const [allClientWallets, setAllClientWallets] = useState({});
  useState(() => {
    dispatch(fetchDictionaryStart());
  }, []);
  const [activeTab, setactiveTab] = useState(1);
  const toggle = (tab) => {
    if (activeTab !== tab) {
      setactiveTab(tab);
    }
  };

  const loadClientWalletDetails = async () => {
    try {
      const payload = {
        belongsTo: params?.clientId,
        page: 1,
        limit: 100000,
      };
      const userWallets = await getClientWalletDetailsListed({payload});
      setAllClientWallets(userWallets?.result);
    } catch (error) {
      console.log("errorr", error);
    }
  };

  useEffect(async() => {
    await loadClientWalletDetails();
  }, [params]);

  const tabBars = () => [
    {
      index: 1,
      name: "Funding Wallets",
      tab: <FundingWalletsTab wallets={allClientWallets?.funding}/>,
    },
    {
      index: 2,
      name: "Trading Wallets",
      tab: <TradingWalletsTab wallets={allClientWallets?.trading}/>,
    },
    {
      index: 3,
      name: "Margin Wallets",
      tab: <CollateralWalletsTab wallets={allClientWallets?.margin}/>,
    },
    {
      index: 4,
      name: "Futures Wallets",
      tab: <FuturesWalletsTab wallets={allClientWallets?.futures}/>,
    },
  ];

  return (
    <React.Fragment>
      <MetaTags>
        <title>Wallet Types</title>
      </MetaTags>
      <div className="container-fluid">
        <Row>
          <Col className="col-12">
            <Card>
              <CardBody>
                <Nav tabs>
                  {tabBars().map((tabItem) => (
                    <NavItem key={tabItem.index}>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTab === tabItem.index,
                        })}
                        onClick={() => {
                          toggle(tabItem.index);
                        }}
                      >
                        {tabItem.name}
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>

                <TabContent activeTab={activeTab} className="p-3 text-muted">
                  {tabBars().map((tabItem) => (
                    <TabPane tabId={tabItem.index} key={tabItem.index}>
                      <Row>
                        <Col sm="12">{tabItem.tab}</Col>
                      </Row>
                    </TabPane>
                  ))}
                </TabContent>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
}
const mapStateToProps = (state) => ({
  loading: state.dictionaryReducer.loading || false,
  dictionary: state.dictionaryReducer.dictionary || [],
  error: state.dictionaryReducer.error,
});
export default connect(mapStateToProps, null)(WalletTypesList);
