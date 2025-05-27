import React from "react";
import Widgets from "../../components/Common/Widgets";
import CryptoCard from "../../components/Common/CryptoCard";
import {
  Button, Col, Row 
} from "reactstrap";
import {
  connect, useDispatch,
} from "react-redux";
//i18n
import { withTranslation } from "react-i18next";
import { fetchHighKlines } from "store/actions";
import Loader from "components/Common/Loader";

const dropdownItems = [
  {
    title:"24 hours",
    value:"24h"
  },
  {
    title:"7 days",
    value:"7d" 
  },
  {
    title:"30 days",
    value:"30d" 
  }
];

const CryptoData = (props) => {  
  const dispatch = useDispatch();
  const [markets, setMarkets] = React.useState([]);
  const {
    markets: m,
    hover,
    wallets,
  } = props;

  React.useEffect(() => {
    if (wallets) {
      let filtered = wallets ? m.filter((market) => {
        if (wallets.find((x) => x?.assetId?.symbol === market?.pairName.split("/")[0])) {
          return market;
        }
      }) : m;
      setMarkets(filtered);
    }
  }, [wallets, m]);

  return (
    <Widgets tabs={["Core Assets", "Top Gainers", "Top Losers", "New"]} 
      dropdownProps={{
        className:"dropdown-end",
        dropdownItems:dropdownItems,
        handleClick:(item)=>{dispatch(fetchHighKlines(item.value))},
        defaultValue:dropdownItems[0].title
      }}  className="mb-3">
      {!markets || markets.length === 0 && <Loader/>}
      {markets && (
        <Row className='d-flex'>
          {
            markets?.map((market, index) => (
              <Col md={6} lg={4} key={index}>
                <CryptoCard
                  hover={hover}
                  cryptoFooter={<Button type="button" className="blue-gradient-color dashboard-button" onClick={() => { props.history.push("/quick-buy") }}>{props.t("Quick Buy")}</Button>}
                  colors={{
                    strokeColor: "rgba(255, 167, 52,1)",
                    chartColor: "rgba(255, 167, 52, 0.5)" 
                  }}
                  cryptoDetails={{
                    iconSrc: `images/logo/${market ? market.pairName.split("/")[0] : "BTC"}.svg`,
                    coinTitle: `${market.pairName}`,
                    precent: market?.percentage,
                    marketCap: market?.close?.$numberDecimal ? market.close?.$numberDecimal : market.close,
                  }}>
                </CryptoCard>
              </Col>
            ))
          }
        </Row>
      )}
      <Row>
        <Col className='col-12 mb-5'>
          <div className="btn-group crypto-footer w-100" role="group">
            <Button type="button" className='blue-gradient-color'>{props.t("Discover More assets")}</Button>
          </div>
        </Col>
      </Row>
    </Widgets>
  );
};
const mapStateToProps = (state) => ({
  marketsLoading: state.markets.loading || false,
  markets: state.markets.markets || [],
  marketNames: state.markets.marketNames,
  wallets: state.wallets.wallets,
});
export default connect(mapStateToProps, null)(withTranslation()(CryptoData)); 