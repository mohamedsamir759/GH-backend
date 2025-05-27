import { createContext } from "react"; 

const SocketContext = createContext({  
  markets: [],  
  orderBooks: [],
  markupId: null,
}); 

export default SocketContext;