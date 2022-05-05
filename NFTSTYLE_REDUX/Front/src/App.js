import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "./index.css";
import Home from "views/Home.js";
import Create from "views/Create.js";
import CreateSingle from "views/Create-single-And-Multiple";
import "@metamask/legacy-web3";
import Following from "views/following.js";
import EditProfile from "views/edit-profile.js";
import Myitems from "views/my-items.js";
import Activity from "views/activity.js";
import ForBrands from "views/for-brands.js";
import Info from "views/info.js";
import search from "views/search.js";
import Privacypolicy from "views/Privacypolicy.js";
import Terms from "views/Termsofservice";
import ConnectWallet from "../src/views/separate/Connect-Wallet";
import { ApproveChecked } from "actions/v1/token";
import { ToastContainer, toast } from "react-toastify";
import Web3 from "web3";
import config from "lib/config";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { AddressUserDetails_GetOrSave_Action } from "actions/v1/user";
import { useSelector, useDispatch } from 'react-redux';
import { Account_Connect, Account_disConnect } from "actions/redux/action";
import SINGLE from "ABI/userContract721"
toast.configure();
let toasterOption = config.toasterOption;
export default function App(props) {
  const { ...rest } = props;

  const [UserAccountAddr, Set_UserAccountAddr] = useState("");
  const [UserAccountBal, Set_UserAccountBal] = useState(0);
  const [Service_Fee, set_Service_Fee] = useState(0);
  const [Wen_Bln, set_Wen_Bln] = useState(0);
  const [providerss, set_providers] = useState(null);
  const [WalletConnected, Set_WalletConnected] = useState("false");
  const [AddressUserDetails, Set_AddressUserDetails] = useState({});
  const [Accounts, Set_Accounts] = useState("");

  const [convertVal, setConvertVal] = React.useState(0);
  const [ApprovedData, setApprovedData] = useState("false");
  const dispatch = useDispatch();
  const birds = useSelector(state => state.wallet_connect_context);
  const timerRef = useRef(null);
  const AfterWalletConnected = () => {
    ApproveCheck();
  };
  const ApproveCheck = async () => {
    if (UserAccountAddr != "") {
      var ReqData = {
        addr: String(UserAccountAddr).toLowerCase(),
      };
      var Resp = await ApproveChecked(ReqData);
      // console.log("Resp.data",Resp.data)
      if (Resp && Resp.data && Resp.data.getDat && Resp.data.getDat.Approved) {
        setApprovedData(Resp.data.getDat.Approved);
      }
    }
  };

  useEffect(()=>{
    getServi()
    if(localStorage.walletConnectType)
        getInit(localStorage.walletConnectType);
  },[birds.WalletConnected])

  async function getInit(type) {
    var provider = await connect_Wallet(type);
    if (provider) {
      try {
        await provider.enable().then(async function () {
          var web3 = new Web3(provider);
          if (web3.currentProvider.networkVersion == config.networkVersion || web3.currentProvider.chainId == config.networkVersion) 
          {
            localStorage.setItem("walletConnectType", type);
            var balance = 0;
            var currAddr = "";
            var setacc = "";
            if (localStorage.walletConnectType == "wc") 
            {
              var result = JSON.parse(localStorage.walletconnect).accounts;
              setacc = result[0];
              var val = await web3.eth.getBalance(setacc);
              balance = Web3.utils.fromWei(String(val));
              currAddr = String(setacc).toLowerCase();
              config.providercon = provider;
              var AddressUserDetails = await AddressUserDetails_GetOrSave_Action({addr: currAddr})
              if(AddressUserDetails.data.data.User)
              {
                var Token = AddressUserDetails.data.data.token
                localStorage.setItem("user_token",Token)
              dispatch({
                type: Account_Connect,
                Account_Detail: {
                  UserAccountAddr: currAddr,
                  providerss: provider,
                  UserAccountBal: balance,
                  WalletConnected: "true",
                  Accounts: setacc,
                  Wall:Token,
                  AddressUserDetails: AddressUserDetails,
                }
              })
            }
            } 
            else if (localStorage.walletConnectType == "mt") 
            {
              var result = await web3.eth.getAccounts();
              setacc = result[0];
              await web3.eth.getBalance(setacc).then(async (val) => {
                var val = await web3.eth.getBalance(setacc);
                balance = Web3.utils.fromWei(String(val));
              });
              currAddr = String(setacc).toLowerCase();
              config.providercon = provider;
              config.currAdrress = currAddr;
              var AddressUserDetails = await AddressUserDetails_GetOrSave_Action({addr: currAddr})
              if(AddressUserDetails.data.data.User)
              {
                console.log("hdbjhsbfhbhgbfsnbhjrnth",AddressUserDetails.data.data.token)
                var Token = AddressUserDetails.data.data.token
                localStorage.setItem("user_token",Token)
              dispatch({
                type: Account_Connect,
                Account_Detail: {
                  UserAccountAddr: currAddr,
                  providerss: provider,
                  UserAccountBal: balance,
                  WalletConnected: "true",
                  Accounts: setacc,
                  Wall:Token,
                  AddressUserDetails: AddressUserDetails.data.data,
                }
              })
            }
            }
          } 
          else 
          {
            toast.warning(config.toaster, toasterOption);
          }
        })
        .catch((error)=>{
          console.log("dbcfsdfb",error)
        });
      } catch (err) 
      {
        console.log("fgregrtgt",err)
      }
    } else {
      toast.warning("Please Add Wallet", toasterOption);
    }
  }

  async function connect_Wallet(type) {
    if (type == "wc") {
      var provider = new WalletConnectProvider({
        rpc: {
          56: "https://bsc-dataseed1.binance.org",
          // 97:"https://data-seed-prebsc-1-s1.binance.org:8545/"
          //4:"https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
        },
        network: "binance",
        //chainId: 4,
        chainId: 56,
        // chainId: 97,
      });
      return provider;
    } else if (type == "mt") {
      var provider = window.ethereum;
      return provider;
    }
  }

  window.addEventListener('load', async (event) => {
    if(localStorage.getItem('walletConnectType')=='mt'){
      if(window.ethereum) {
         window.ethereum.on('accountsChanged', function (accounts) {
          if(timerRef.current) {
            clearTimeout(timerRef.current);
          }
          timerRef.current = 
          setTimeout(() => {
            getInit('mt');
          }, 1000);
        })
        
        window.ethereum.on('chainChanged', async function (networkId) {
          console.log("chainid",networkId)
         if(networkId == config.chainId){
          if(timerRef.current) {
            clearTimeout(timerRef.current);
          }
          timerRef.current = setTimeout(() => {
            getInit('mt');
          }, 1000);
        }
        else {
                //localStorage.setItem('connect', 'false')
                toast.warning("Please Connect to Binance Network", toasterOption);
        }
      })
    }}
    else if(localStorage.walletConnectType=="wc"){
      var provider3 = null
      if(provider3==null){
         provider3 = await connect_Wallet("wc");
      }
      else if(provider3!=null){
      (provider3).on("connect", () => {
        getInit('wc')
      });
      (provider3).on("disconnect", () => {
        localStorage.removeItem('walletConnectType')
      });
      }}
  })

  async function getServi(){
    var web3sw=new Web3(config.BNBPROVIDER)
    if(web3sw){
    var CoursetroContracti = new web3sw.eth.Contract(
      SINGLE,
      config.singleContract
    );
    var Singlefee1 = await CoursetroContracti
    .methods
    .getServiceFee()
    .call()
    dispatch({
      type: Account_Connect,
      Account_Detail: {
        Service_Fee: Singlefee1,
      }
    })
  }
}

  return (
    <BrowserRouter basename="/NFT-Style">
       <ConnectWallet
        // Set_UserAccountAddr={Set_UserAccountAddr}
        // Set_UserAccountBal={Set_UserAccountBal}
        // Set_WalletConnected={Set_WalletConnected}
        // Set_AddressUserDetails={Set_AddressUserDetails}
        // Set_Accounts={Set_Accounts}
        // WalletConnected={WalletConnected}
        // set_Service_Fee={set_Service_Fee}
        // Service_Fee={Service_Fee}
        // AfterWalletConnected={AfterWalletConnected}
        // Wen_Bln={Wen_Bln}
        // set_Wen_Bln={set_Wen_Bln}
        // setConvertVal={setConvertVal}
        // convertVal={convertVal}
        // set_providers={set_providers}
        // providerss={providerss}
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

        <Route
          path={"/create-multiple"}
          component={ApprovedData == "true" ? CreateSingle : CreateSingle}
        />
        <Route
          path={"/create-single"}
          component={ApprovedData == "true" ? CreateSingle : CreateSingle}
        />

        <Route path="/:paramUsername" component={Myitems} />
        <Route path="/" component={Home} />

        <Route exact path="/*" component={Home}>
          <Redirect to="/" />
        </Route>
      </Switch>
      <ToastContainer />
    </BrowserRouter>
  );
}
