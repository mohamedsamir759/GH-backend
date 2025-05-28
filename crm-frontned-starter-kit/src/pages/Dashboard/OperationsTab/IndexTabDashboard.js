import React, { useState } from "react";
import { 
  useDispatch, 
  connect, 
  useSelector 
} from "react-redux";
import MetaTags from "react-meta-tags";
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
import RequestsStats from "./Requests";
import TransactionsStats from "./TransactionsStats";

function IndexTabDashboard(props) {
  const dispatch = useDispatch();
  useState(() => {
    dispatch(fetchDictionaryStart());
  }, []);
  const { profileMetaInfo = {} } = useSelector((state) => state.Profile);

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setactiveTab(tab);
    }
  };
  const loadTabs = ({
    transactions: { depositDetails: { crypto } = {} } = {},
  }) => [
    {
      tabId: "1",
      navLinkName: "Transaction",
      component: <TransactionsStats  />,
      hidden: !crypto,
    },
    {
      tabId: "2",
      navLinkName: "Requests",
      component: <RequestsStats  />,
      hidden: !crypto,
    },
  ];

  const tabs = loadTabs({ 
    ...profileMetaInfo, 
  }).filter((item) => !item.hidden);
  const [activeTab, setactiveTab] = useState(
    tabs.length > 0 ? tabs[0].tabId : "1"
  );


  return (
    <React.Fragment>
      <MetaTags>
        <title >Transactions</title>
      </MetaTags>
      <Row>
        <Col className="col-12">
          <Card>
            <CardBody>
              <Nav tabs>
                {tabs.map((tabItem) => (
                  <>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTab === tabItem.tabId,
                        })}
                        onClick={() => {
                          toggle(tabItem.tabId);
                        }}
                      >
                        {tabItem.navLinkName}
                      </NavLink>
                    </NavItem>
                  </>
                ))}
              </Nav>

              <TabContent activeTab={activeTab} className="p-3 text-muted">
                {tabs.map((tabItem) => (
                  <>
                    <TabPane tabId={tabItem.tabId}>
                      <Row>
                        <Col sm="12">{tabItem.component}</Col>
                      </Row>
                    </TabPane>
                  </>
                ))}
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
}
const mapStateToProps = (state) => ({
  loading: state.dictionaryReducer.loading || false,
  dictionary: state.dictionaryReducer.dictionary || [],
  error: state.dictionaryReducer.error,
});
export default connect(mapStateToProps, null)(IndexTabDashboard);
