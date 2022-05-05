import React,{useState} from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import './index.css';
import Home from "views/Home.js";
import Create from "views/Create.js";
import CreateSingle from "views/Create-single-And-Multiple";
import '@metamask/legacy-web3'
import Following from "views/following.js";
import EditProfile from "views/edit-profile.js";
import Myitems from "views/my-items.js";
import Activity from "views/activity.js";
import ForBrands from "views/for-brands.js";
import Info from "views/info.js";
import search from "views/search.js";
import Privacypolicy from "views/Privacypolicy.js";
import Terms from "views/Termsofservice";
import ConnectWallet from '../src/views/separate/Connect-Wallet'
import { ApproveChecked } from "actions/v1/token";
import { ToastContainer,toast } from 'react-toastify';
export default function App(props) {
  const { ...rest } = props;

  const [UserAccountAddr, Set_UserAccountAddr] = useState('');
	const [UserAccountBal, Set_UserAccountBal] = useState(0);
	const [Service_Fee, set_Service_Fee] = useState(0);
	const [Wen_Bln, set_Wen_Bln] = useState(0);
	const [providerss, set_providers] = useState(null)
	const [WalletConnected, Set_WalletConnected] = useState('false');
  const [AddressUserDetails, Set_AddressUserDetails] = useState({});
	const [Accounts, Set_Accounts] = useState('');
	
	const [convertVal, setConvertVal] = React.useState(0);
  const[ApprovedData,setApprovedData]=useState("false")
  const AfterWalletConnected=()=>{
    ApproveCheck();
  }
  const ApproveCheck=async()=>{
    if(UserAccountAddr!=""){
    var ReqData = {
      addr: String(UserAccountAddr).toLowerCase()
    }
    var Resp = await ApproveChecked(ReqData);
    // console.log("Resp.data",Resp.data)
    if(Resp&&Resp.data&&Resp.data.getDat&&Resp.data.getDat.Approved){
    setApprovedData(Resp.data.getDat.Approved)}
    }
  }
return(
  
  <BrowserRouter basename="/" >
     <ConnectWallet
				Set_UserAccountAddr={Set_UserAccountAddr}
				Set_UserAccountBal={Set_UserAccountBal}
				Set_WalletConnected={Set_WalletConnected}
				Set_AddressUserDetails={Set_AddressUserDetails}
				Set_Accounts={Set_Accounts}
				WalletConnected={WalletConnected}
				set_Service_Fee={set_Service_Fee}
				Service_Fee={Service_Fee}
				AfterWalletConnected={AfterWalletConnected}
				Wen_Bln={Wen_Bln}
				set_Wen_Bln={set_Wen_Bln}
				setConvertVal={setConvertVal}
				convertVal={convertVal}
				set_providers={set_providers}
				providerss={providerss}
			/>
    <Switch>
      <Route path="/privacy-policy" component={Privacypolicy} />
      <Route path="/community" component={Privacypolicy} />
      <Route path="/terms-of-service" component={Terms} />
      <Route path="/search" component={search} />
      <Route path="/info/:tokenidval" component={Info} />
      <Route path="/how-it-works" component={ForBrands} />
      <Route path="/activity" component={Activity} />
      <Route path="/my-items" component={Myitems} />
      <Route path="/edit-profile" component={EditProfile} />
      <Route path="/following" component={Following} />
      <Route path="/create" component={Create} />
    
    
      <Route path="/user/:paramAddress" component={Myitems} />
    
      <Route path={"/create-multiple"} component={ApprovedData=="true"?CreateSingle:CreateSingle} />
      <Route path={"/create-single"} component={ApprovedData=="true"?CreateSingle:CreateSingle} />
    
  <Route path="/:paramUsername" component={Myitems} />
      <Route path="/" component={Home} />

      <Route exact path="/*" component={Home}>
        <Redirect to="/" />
      </Route>
    </Switch>
    <ToastContainer/>
  </BrowserRouter>)
}