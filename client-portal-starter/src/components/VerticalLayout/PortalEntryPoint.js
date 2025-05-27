import React, { useEffect, useContext } from "react";
import { connect, useDispatch } from "react-redux";
import {
  fetchMarkets, 
  fetchWallets, 
  fetchOrderBooks, 
  fetchProfile, 
  fetchHighKlines, 
  fetchAssets, 
  fetchDictStart, 
  fetchLogs,
} from "../../store/actions";
import SocketContext from "../../context/context";


const PortalEntryPoint = props => {
  const dispatch = useDispatch();
  const {
    setState,
  } = useContext(SocketContext);
  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchDictStart());
    dispatch(fetchMarkets());
    dispatch(fetchOrderBooks());
    dispatch(fetchWallets({
      limit: 100,
      page: 1
    }));
    dispatch(fetchHighKlines());
    dispatch(fetchAssets());
    dispatch(fetchLogs({
      limit: 10,
      page: 1
    }));
  }, []);

  useEffect(() => {
    setState(state => {
      return {
        ...state,
        markupId: props.profile._id,
      };
    });
  }, [props.profile]);

  return <></>;
};

const mapStateToProps = (state) => ({
  profile: state.Profile.clientData,
});
export default connect(mapStateToProps, null)(PortalEntryPoint);