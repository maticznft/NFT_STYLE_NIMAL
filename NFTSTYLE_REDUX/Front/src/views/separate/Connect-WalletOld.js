import React, { useEffect, useState, useRef, useCallback } from "react";
import { Button, TextField } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import { useLocation } from 'react-router-dom'
import BNB from '../../assets/images/bnb.png'
import Onboard from 'bnc-onboard'
import Web3 from 'web3';
import '@metamask/legacy-web3'
import WalletConnectProvider from "@walletconnect/web3-provider";
import isEmpty from "lib/isEmpty";
import DETH_ABI from "../../ABI/DETH_ABI"
import $ from 'jquery';
import axios from 'axios';
import config from '../../lib/config';
// import LoderImg from '../../assets/dev/images/loader.gif'
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import Modal from 'react-modal';
// https://data-seed-prebsc-1-s1.binance.org:8545/
import {
  AddLikeAction,
  GetLikeDataAction
} from '../../actions/v1/token';
import {
  AddressUserDetails_GetOrSave_Action,
  Collectibles_Get_Action,
  changeReceiptStatus_Action
} from '../../actions/v1/user';
import { toast } from 'react-toastify';
import Multiple from '../../ABI/userContract1155.json'
import SINGLE from '../../ABI/userContract721.json'
toast.configure();
let toasterOption = config.toasterOption;
var temp = 0
var currAddr="";
var provider = null;
const useStyles = makeStyles(styles);

export default function ConnectWallet(props) {
  const [modalopen, setmodalopen] = useState(false)
  const [accounts, setaccounts] = useState('')
  const classes = useStyles();
  const [providers, set_providers] = useState(null)
  const { ...rest } = props;
  const {
    WalletConnected
  } = props;

  const timerRef = useRef(null);

  useEffect(() => {
    if(localStorage.kethirthaya && localStorage.kethirthaya == 'true' && localStorage.uwat && localStorage.uwat == 'mt' || localStorage.uwat == 'tw')
    {
      //console.log("connectwalletcalleduseEfff")
    getInit();
    }
    modalcall()
  }, []);
  useCallback(() => {
   //console.log("walletconnect disconnect")
  }, [localStorage.walletconnect]);
  async function getInit() {
    if (!isEmpty(localStorage.uwat)) {
      if (localStorage.uwat == 'mt') {
        connect_Wallet('metamask');
      }
      if (localStorage.uwat == 'tw') {
        ////console.log("connectwalletcalledgetint")
        connect_Wallet('tw');
      }
    }

  }

  let web3
  // head to blocknative.com to create a key
  const BLOCKNATIVE_KEY = 'blocknative-api-key'
  // the network id that your dapp runs on
  const NETWORK_ID = 1

  async function connect_Wallet(type) {
    
    window.$('.modal').modal('hide');
    
    if (type == 'metamask') {
      var provider = window.ethereum;
      set_providers(provider)
      var web3 = new Web3(provider);
      if (typeof web3 === 'undefined') {
        props.Set_WalletConnected(false);
        toast.warning("Connect to Ethereum Network", toasterOption);
        //localStorage.setItem('kethirthaya', 'false')
        return false;
      }
    }
    if (type == 'tw') {
      ////console.log("connectwalletcalled")
      if(isEmpty(localStorage.walletconnect))
      {
        if(localStorage.count == 'done')
        {
        localStorage.setItem('uwat','NotConnected')
        }
        localStorage.setItem('count','Not')
        //window.location.reload()
      }
      if(localStorage.uwat != 'NotConnected')
      {
      provider = new WalletConnectProvider({
        rpc: {
          1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        },
        network: 'ethereum',
        chainId: 1,
      }
      );
      //
    }
  }
    
    if (provider != null) {
      try {
        provider.enable()
          .then(async function (resulr) {
            //console.log("ceb kjnekjmkmkln bh hk>>>>>>>>>>",resulr,provider)
            var web3 = new Web3(provider)
            //console.log("contexted contenet22",web3)
            if ((web3.currentProvider.networkVersion == config.networkVersion) || (web3.currentProvider.chainId == config.networkVersion)) 
            {
              localStorage.setItem('walletConnectType', type)
              //console.log("ceb kjnekjmkmkln bh hk>>>>>>>>>>",resulr)
              config.address=resulr[0]
              var balance = 0;
              var setacc = '';
              if (localStorage.walletConnectType == "tw") {
                var result = JSON.parse(localStorage.walletconnect).accounts
                //console.log("provider checktw", result)
                setacc = result[0];
                var val = await web3.eth.getBalance(setacc)
                balance = val / 1000000000000000000;
                props.Set_UserAccountBal(balance);
                currAddr = String(setacc).toLowerCase();
                //console.log("provider checktw2", balance,currAddr)
                props.set_providers(provider)
                config.providercon = provider;
                props.Set_UserAccountBal(balance);
                props.Set_Accounts(setacc);
                setaccounts(setacc)
                props.Set_UserAccountAddr(currAddr);
                config.address = currAddr
                props.Set_WalletConnected("true");
                if(isEmpty(localStorage.walletconnect) || localStorage.count == 'Not')
                {
                  localStorage.setItem('count','done')
                  window.location.reload()
                }
                // var bidvalue = new web3.eth.Contract(
                //   DETH_ABI, config.tokenAddr[config.tokenSymbol]
                // );
                // var bidbln = await bidvalue
                //   .methods
                //   .balanceOf(setacc)
                //   .call()
                // var bidbln1 = (bidbln / config.decimalvalues).toFixed(config.toFixed)
                // props.set_Wen_Bln(bidbln1)
                // //console.log("bln check", bidvalue)
              }
            else if (localStorage.uwat == "mt") {
              //console.log("connect vla da")
              var result = await web3.eth.getAccounts()
              setacc = result[0];

              await web3.eth.getBalance(setacc)
                .then(async (val) => {

                  var val = await web3.eth.getBalance(setacc)
                  balance = val / 1000000000000000000;

                })
                //console.log("provider checkmt",balance)
              currAddr = String(setacc).toLowerCase();
              //console.log("provider checkmt1",provider)
              props.set_providers(provider)
              //console.log("provider checkmt2",provider)
              config.providercon = provider;
              props.Set_UserAccountBal(balance);
              //console.log("provider checkmt3",balance)
              props.Set_Accounts(setacc);
              setaccounts(setacc)
              props.Set_UserAccountAddr(currAddr);
              config.address = currAddr
              props.Set_WalletConnected("true");

              // var bidvalue = new web3.eth.Contract(
              //   DETH_ABI, config.tokenAddr[config.tokenSymbol]
              // );
              // var bidbln = await bidvalue
              //   .methods
              //   .balanceOf(currAddr)
              //   .call()
              // var bidbln1 = (bidbln / config.decimalvalues).toFixed(config.toFixed)
              // props.set_Wen_Bln(bidbln1)
              }
              await AfterWalletConnected(web3);
            }
            else {
              props.Set_WalletConnected(false);
              if (temp >=  1) {
                temp = temp + 1
                toast.warning("Please Connect to Ethereum Network", toasterOption);
                localStorage.setItem('kethirthaya', 'false')
              }
            }
          })
          .catch((e) => {
          })
      } catch (err) {
        props.Set_WalletConnected(false);
        //localStorage.setItem('kethirthaya', 'false')
      }
    }
    else {
      props.Set_WalletConnected(false);
      if(temp == 0)
      {
      temp = temp + 1
      toast.warning("Please Add Metamask or Trust Wallet", toasterOption);
      }
      //localStorage.setItem('kethirthaya', 'false')
    }
  }

  // async function AfterWalletConnected(setacc) {
  //   // alert(setacc)
  //   if(setacc !== undefined){
  //   await AddressUserDetails_GetOrSave_Call(setacc);}
  //   props.AfterWalletConnected();
  // }
  async function AfterWalletConnected(a) {
    // alert(setacc)
    // if(setacc !== undefined){
    //alert('in')
    
    //window.location.reload()
    // }
    props.AfterWalletConnected();
    await AddressUserDetails_GetOrSave_Call();
  }
  // async function AddressUserDetails_GetOrSave_Call(data) {
  async function AddressUserDetails_GetOrSave_Call() {
    // //////("acount checkingssssssssssss",data)
    // var sendaddr="";
    // if(data !== undefined)
    // {
    //   sendaddr=data
    // }  
    var sendaddr = window.web3.eth.defaultAccount
    if(!isEmpty(String(accounts).toLowerCase()))
    {
    var ReqData = { addr: String(accounts).toLowerCase() }
    }
    else{
      var ReqData = { addr: String(config.address).toLowerCase() }
    }
    //alert(ReqData.addr)
    //alert(config.address)
    var Resp = await AddressUserDetails_GetOrSave_Action(ReqData);
    //////('------ 1q1q1q', Resp);
    if (Resp && Resp.data && Resp.data.data && Resp.data.data.User) {
      //alert("Resp",Resp.data.data.User.curraddress)
      localStorage.setItem('kethirthaya','true')
      props.Set_AddressUserDetails(Resp.data.data.User);
    } else {
      props.Set_AddressUserDetails({});
    }
    return true;
  }

  window.addEventListener('load', async (event) => {
    if(localStorage.getItem('walletConnectType')=='mt'){
      if(window.ethereum) {
        // //console.log('addEventListener',window.ethereum)
        window.ethereum.on('accountsChanged', function (accounts) {
          if(timerRef.current) {
            clearTimeout(timerRef.current);
            
          }
          timerRef.current = setTimeout(() => {
            getInit('mt');
            
          }, 1000);
        })
        
        window.ethereum.on('chainChanged', async function (networkId) {
          //console.log("varala poda",networkId,config.chainId)
        if(networkId == config.chainId){
          if(timerRef.current) {
            clearTimeout(timerRef.current);
            
          }
          timerRef.current = setTimeout(() => {
            getInit('mt');
            
          }, 1000);
          props.Set_WalletConnected("true");
        }
        else {
          props.set_providers(null)
          props.Set_WalletConnected("false");
        }
      })
    }}
    else if(localStorage.walletConnectType=="tw"){
      var provider3 = null
      //console.log("localsorage ",provider)
      if(provider3==null){
        // provider3 = await connect_Wallet("tw");
     
      }
      else if(provider3!=null){
        providers.on("connect", () => {
        //getInit()
        //console.log("connect in trust wallet");
      });
      providers.on("disconnect", (error,payload) => {
        //console.log("connectdisconnet",payload);
        localStorage.setItem('count','Not')
        localStorage.setItem('kethirthaya','false')
        localStorage.removeItem('walletConnectType')
        localStorage.setItem('uwat','Notconnected')
        window.location.reload()
      });
      }}
  })
  // window.addEventListener('load', (event) => {
  //   event.preventDefault();
  //   //////('addEventListener',event)
  //   if (window.ethereum) {
  //     var web3 = new Web3(window.ethereum);
  //     try {
  //       if (typeof web3 !== 'undefined') {
  //         window.ethereum.on('accountsChanged', function (accounts) {
  //           connectWallet();
  //         })
  //         window.ethereum.on('networkChanged', function (networkId) {
  //           if(networkId == config.networkVersion){
  //             Set_WalletConnected(true)
  //           }
  //           else {
  //             Set_WalletConnected(false)
  //           }
  //         })
  //       }
  //       else {
  //         Set_WalletConnected(false);
  //         toast.warning("Please Add Metamask External", toasterOption)
  //       }
  //     }catch(err){
  //       toast.warning("Please Add Metamask External", toasterOption)
  //     }
  //   }
  //   else {
  //     Set_WalletConnected(false);
  //     toast.warning("Please Add Metamask External", toasterOption)
  //   }
  // })

  const customStyles = {
    content: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      boxShadow: '0 27px 24px 0 rgb(0 0 0 / 20%), 0 40px 77px 0 rgb(0 0 0 / 22%)',
      borderRadius: '30px',
      border: 'none !important'
    },
  };

  let subtitle;
  const [WalletConnectNotifyPopup, Set_WalletConnectNotifyPopup] = React.useState(false);

  function openModal() {
    Set_WalletConnectNotifyPopup(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    Set_WalletConnectNotifyPopup(false);
  }
  function closeModal1() {
    setmodalopen(false)
  }
  var WalletConnectNotifyPopup_test = '';

  if (WalletConnected) {
    WalletConnectNotifyPopup_test = false;
  }
  else {
    WalletConnectNotifyPopup_test = true;
  }

  var pathVal = '';

  const location = useLocation();
  if (location.pathname) {
    if (location.pathname.split('/').length >= 2) {
      pathVal = location.pathname.split('/')[1];
    }
  }

  const [location_pathname, Set_location_pathname] = useState(pathVal);

  const connect_Wallet_call = (type) => {
    // if(WalletConnected!=true) {
    //   connect_Wallet(type);
    // }
  }
   const modalcall = async() =>{
     var web3=new Web3("https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161")
    var CoursetroContract = new web3.eth.Contract(
      SINGLE,
      config.single
    );
    //console.log("serviuve gfee",CoursetroContract)
    var Singlefee1 = await CoursetroContract
      .methods
      .getServiceFee()
      .call()
    
    props.set_Service_Fee(Number(Singlefee1))
  
    if(localStorage.kethirthaya != "false")
    {
    setTimeout(() => {
     var a  = (localStorage.kethirthaya == "false") ? true : (isEmpty(config.address)) ? true : false
     setmodalopen(a)
    }, 1000);
  }else{
      setmodalopen(true)
      
  }

  }

  return (
    <div>
      {(
        (localStorage.kethirthaya == "false" || WalletConnected == false || WalletConnected == 'false')
        &&
        (
          location_pathname == 'my-items'
          || location_pathname == 'following'
          || location_pathname == 'activity'
          || location_pathname == 'info'
        )
      ) &&
        <Modal
          isOpen={modalopen}
          // onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          {/* <button onClick={closeModal1}>close</button> */}
          {/* <div className="modaltest" style={{opacity:2, position:'relative'}}>
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Network</h2>
          <div>Connect to Binance Network.</div>
        </div> */}
          {/* {/ wallet_connect Modal /} */}
          {/* <div class="primary_modal" id="wallet_connect_modal" tabindex="-1" role="dialog" aria-labelledby="wallet_connect_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false"> */}
          {/* <div className="primary_modal"> */}
          {/* <div class="modal-dialog modal-dialog-centered modal-sm" role="document"> */}
          {/* <div class="modal-content"> */}
          {/* <div class="modal-header text-center"> */}
          <h5 class="modal-title react_modal_title" id="wallet_connect_modalLabel_1">Network</h5>

          {/* <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button> */}
          {/* </div> */}
          <div class="modal-body">
            <div className="text-center icon_coin_net">
              <img src={BNB} alt="logo" className="img-fluid" />
            </div>
            <div className="update_cover_div_1" id="update_cover_div_1">
              <p className="mt-0 approve_desc text-center mb-0">Connect to Ethereum network</p>

            </div>

          </div>
          {/* </div> */}
          {/* </div> */}
          {/* </div> */}
          {/* {/ end wallet_connect modal /} */}
          {/* </div> */}
        </Modal>
      }
      {/* <div id="connect_Wallet_call" onClick={() => connect_Wallet_call('metamask')}></div> */}
    </div>
  )
}