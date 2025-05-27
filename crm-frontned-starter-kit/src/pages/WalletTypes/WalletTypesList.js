import React, { useState } from "react";
import {
  useDispatch, connect
} from "react-redux";

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
function WalletTypesList() {
  const dispatch = useDispatch();
  useState(() => {
    dispatch(fetchDictionaryStart());
  }, []);
  const [activeTab, setactiveTab] = useState(1);
  const toggle = tab => {
    if (activeTab !== tab) {
      setactiveTab(tab);
    }
  };

  const tabBars = () => [
    {
      index: 1,
      name: "Trading Wallets",
      tab: <TradingWalletsTab />,
    },
    {
      index: 4,
      name: "Collateral Wallets",
      tab: <CollateralWalletsTab />,
    },
    {
      index: 3,
      name: "Funding Wallets",
      tab: <FundingWalletsTab />,
    },
  ];

  return (
    <React.Fragment>
      <MetaTags>
        <title>
          Wallet Types
        </title>
      </MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          <h2>Wallet Types</h2>
          <Row>
            <Col className="col-12">
              <Card>

                <CardBody>
                  <Nav tabs>
                    {
                      tabBars().map((tabItem) => (
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
                      ))
                    }
                  </Nav>

                  <TabContent activeTab={activeTab} className="p-3 text-muted">
                    {
                      tabBars().map((tabItem) => (
                        <TabPane tabId={tabItem.index} key={tabItem.index}>
                          <Row>
                            <Col sm="12">
                              {tabItem.tab}
                            </Col>
                          </Row>
                        </TabPane>
                      ))
                    }
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
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