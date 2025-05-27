import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Container } from "reactstrap";
import MetaTags from "react-meta-tags";

import CardWrapper from "components/Common/CardWrapper";
import Widgets from "components/Common/Widgets";
import Transactions from "./Transactions";
import Deposits from "./Deposits";
import Withdrawals from "./Withdrawals";
import Orders from "./Orders";
import Convert from "./Convert";
import AllFilters from "./filters/AllFilters";
import { withTranslation } from "react-i18next";
import WithdrawalFilters from "./filters/WithdrawalFilters";
import DepositFilters from "./filters/DepositFilters";
import OrderFilter from "./filters/OrderFilter";
import ConvertFilters from "./filters/ConvertFilters";

function History(props) {
  const [activeTab, setTab] = useState(0);
  const [transactionsFilterObj, setTransactionsFilterObj] = useState({});
  const [depositsFilterObj, setDepositsFilterObj] = useState({});
  const [withdrawalsFilterObj, setWithdrawalsFilterObj] = useState({});
  const [ordersFilterObj, setOrdersFilterObj] = useState({});
  const [convertsFilterObj, setConvertsFilterObj] = useState({});
  const { assets } = useSelector(state=>state.assets);
  
  const transactionsFilterHandler = (filter) => {
    filter.fromDate === "" && delete filter.fromDate;
    filter.toDate === "" && delete filter.toDate;
    setTransactionsFilterObj(filter);
  };

  const depositsFilterHandler = (filter) => {
    filter.fromDate === "" && delete filter.fromDate;
    filter.toDate === "" && delete filter.toDate;
    setDepositsFilterObj(filter);
  };

  const withdrawalsFilterHandler = (filter) => {
    filter.fromDate === "" && delete filter.fromDate;
    filter.toDate === "" && delete filter.toDate;
    setWithdrawalsFilterObj(filter);
  };

  const ordersFilterHandler = (filter) => {
    filter.fromDate === "" && delete filter.fromDate;
    filter.toDate === "" && delete filter.toDate;
    setOrdersFilterObj(filter);
  };

  const convertsFilterHandler = (filter) => {
    filter.fromDate === "" && delete filter.fromDate;
    filter.toDate === "" && delete filter.toDate;
    setConvertsFilterObj(filter);
  };

  return (
    <>
      <div className="page-content">
        <MetaTags>
          <title>{props.t("History")}</title>
        </MetaTags>
        <Container className="mb-5 mt-5">
          <div className="d-flex flex-row">
            <h1 className="mb-4">
              {props.t("History")}
            </h1>
          </div>
          <Widgets
            setTab={setTab}
            tabs={["All", "Withdrawls", "Deposit", "Orders", "Convert"]}
          >
            {/* filter tabs */}
            {
              activeTab === 0 && <AllFilters filterHandler={transactionsFilterHandler} assets={assets} />
            }
            {
              activeTab === 2 && <DepositFilters filterHandler={depositsFilterHandler} assets={assets} />
            }
            {
              activeTab === 1 && <WithdrawalFilters filterHandler={withdrawalsFilterHandler} assets={assets} />
            }
            {
              activeTab === 3 && <OrderFilter filterHandler={ordersFilterHandler} />
            }
            {
              activeTab === 4 && <ConvertFilters filterHandler={convertsFilterHandler} assets={assets} />
            }
            <CardWrapper>
              <Container>
                {activeTab === 0 && <Transactions assets={assets} filterObj={transactionsFilterObj} />}
                {activeTab === 2 && <Deposits assets={assets} filterObj={depositsFilterObj} />}
                {activeTab === 1 && <Withdrawals assets={assets} filterObj={withdrawalsFilterObj} />}
                {activeTab === 3 && <Orders assets={assets} filterObj={ordersFilterObj} />}
                {activeTab === 4 && <Convert assets={assets} filterObj={convertsFilterObj} />}
              </Container>
            </CardWrapper>
          </Widgets>
        </Container>
      </div>
    </>
  );
}

export default withTranslation()(History); 