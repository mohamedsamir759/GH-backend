import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import CustomTable from "../../components/Common/CustomTable";
import {
  Button, Container 
} from "reactstrap";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

import { fetchClientWithdrawals } from "../../store/transactions/withdrawal/actions";

//i18n
import { withTranslation } from "react-i18next";

const Withdrawal = (props) => {
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(3);

  const loadWithdrawals = () => {
    dispatch(fetchClientWithdrawals({
      page: 1,
      limit
    }));
  };
  
  useEffect(() => {
    loadWithdrawals();
  }, [limit]);

  return (
    <React.Fragment>
      <Container>
        <div className='pt-2'>
          {
            props.withdrawals 
              &&
              <>
                <CustomTable 
                  rows={props.withdrawals && props.withdrawals} 
                  columns={props.columns}
                  loading={props.loading}
                />
                <Button 
                  disabled={limit >= props.totalWithdrawals}
                  type="button" 
                  className='blue-gradient-color w-100'
                  onClick={() => {
                    props.totalWithdrawals > props.withdrawals?.length && setLimit(limit + 5);
                  }}
                >
                  {props.t("Load more")}
                </Button>
              </>
          }
        </div>
      </Container>
    </React.Fragment >
  );
};

const mapStateToProps = (state) => ({
  withdrawals: state.withdrawalsReducer.withdrawals,
  totalWithdrawals: state.withdrawalsReducer.totalDocs, 
  loading: state.withdrawalsReducer.loading
});
export default connect(mapStateToProps, null)(withTranslation()(Withdrawal)); 