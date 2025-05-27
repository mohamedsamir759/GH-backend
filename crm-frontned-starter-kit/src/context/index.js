import React, { useState, useEffect } from "react";
import SocketContext from "./context";
import { initSockets } from "../socket";

const SocketProvider = (props) => {
  const [state, setState] = useState({
    dealSync: {
      loading: false,
      query: {},
      isCompleted: false,
      deals: []
    }
  });
  useEffect(() => initSockets({
    state,
    setState
  }), [initSockets]);
  const value = {
    state,
    setState,
  };
  return (
    <SocketContext.Provider value={value}>
      {props.children}
    </SocketContext.Provider>
  );
};
export default SocketProvider;