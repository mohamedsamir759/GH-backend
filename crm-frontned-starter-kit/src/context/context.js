import { createContext } from "react";

const SocketContext = createContext({
  dealSync: {
    loading: false,
    query: {},
    isCompleted: false,
    deals: [],
    showMessage: false,
    message: "",
    isError: false,
  }
});

export default SocketContext;