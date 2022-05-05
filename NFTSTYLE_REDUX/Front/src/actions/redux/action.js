import { combineReducers } from 'redux';
export const Account_Connect = 'Account_Connect';
export const Account_disConnect = 'Account_disConnect';

const initial_wallet_connect ={
        UserAccountAddr:'',
        UserAccountBal:0,
        providerss:null,
        Service_Fee:0,
        Wen_Bln:0,
        Wall:"",
        Accounts:'',
        WalletConnected:'',
        AddressUserDetails:null,
        tokenAddress:null,
        swapFee:0
}

function wallet_connect_context(state=initial_wallet_connect, action) {
        switch (action.type) {  
        case Account_Connect:
      return {
        ...state,
       ...action.Account_Detail
};
case Account_disConnect:
        return {
          ...state,
          ...action.Account_Disconnect
  };
    default:
      return state;
  }
}
const birdApp = combineReducers({
        wallet_connect_context
      });
      
      export default birdApp;