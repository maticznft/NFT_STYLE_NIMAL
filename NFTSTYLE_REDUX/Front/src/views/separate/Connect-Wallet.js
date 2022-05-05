import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation } from 'react-router-dom';
import SINGLE from 'ABI/userContract721.json';
import BNB from '../../assets/images/bnb.png'
import Onboard from 'bnc-onboard'
import Web3 from 'web3';
import WalletConnectProvider from "@walletconnect/web3-provider";
import Icon1 from "assets/images/fox.png";
import Icon3 from "assets/images/wallet_05.png";
import Icon4 from "assets/images/wallet1.png";
import { Dialog, MenuItem, Select } from '@material-ui/core';

import $ from 'jquery';
import axios from 'axios';
import config from '../../lib/config';
// import LoderImg from '../../assets/dev/images/loader.gif'
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import Modal from 'react-modal';
// https://data-seed-prebsc-1-s1.binance.org:8545/
import {
  AddLikeAction,
  GetLikeDataAction,
  convertionValue,
  ApproveCh
} from '../../actions/v1/token';
import {
  AddressUserDetails_GetOrSave_Action,
  Collectibles_Get_Action,
  changeReceiptStatus_Action,
  
} from '../../actions/v1/user';
import DETH_ABI from 'ABI/DETH_ABI.json';
import isEmpty from './../../lib/isEmpty'
import Link,{useParams} from 'react-router-dom';
import { toast } from 'react-toastify';
import zIndex from "@material-ui/core/styles/zIndex";
import { useSelector, useDispatch } from 'react-redux';
import { Account_Connect, Account_disConnect } from "actions/redux/action";
toast.configure();
let toasterOption = config.toasterOption;
const useStyles = makeStyles(styles);
var n=0
export default function ConnectWallet(props) {
  const dispatch = useDispatch();
  const [modalopen, setmodalopen] = useState(true)
  const [accounts, setaccounts] = useState('')
  // const [Service_Fee, set_Service_Fee] = useState(0);
  const [providers, set_providers] = useState(null)
  const classes = useStyles();
  const { ...rest } = props;
  
  const {
    WalletConnected,
  } = props;

  const timerRef = useRef(null);

//   useEffect(() => {
//     // console.clear(); 
//     getServi();
//    if(localStorage.walletConnectType&&localStorage.walletConnectType!=null&&localStorage.walletConnectType=='mt'){
//       getInit('mt');
      
//     }
//     else if(localStorage.walletConnectType=='wc'&&localStorage.walletconnect!=null){
//       getInit('wc')
//     }
//    (async()=>{
//   var convertion = await convertionValue();
//   if(convertion&&convertion.data&&convertion.data.USD){
//     props.setConvertVal(convertion.data.USD)   
//     //console.log("dsdjasdgjagdgas",convertion.data.USD)              
//   }
 
 
//   // var contractCall = new web3.eth.Contract(EXCHANGE,config.exchangeAddress)
//   // var swapFee = await contractCall.methods.getTransValue().call();
//   // config.swapFee=swapFee
//   // props.set_swap_fee(swapFee);
  
 
// })()

//   }, [localStorage.walletConnectType,WalletConnected]);


// async function getServi(){
//    var web3sw=new Web3(config.BNBPROVIDER)
//   if(web3sw){
//   var CoursetroContracti = new web3sw.eth.Contract(
//     SINGLE,
//     config.singleContract
//   );
//   var Singlefee1 = await CoursetroContracti
//   .methods
//   .getServiceFee()
//   .call()
//   props.set_Service_Fee(Number(Singlefee1))
//   }

// }
 


  var {paramUsername,paramAddress} = useParams();
  // //////console.log("ewqewqeqwewqewqeqw",paramUsername,paramAddress)
  var handle=null;
  var currAddr="";
  var provider = null;

  // async function getInit(type) {
  //   // if(provider==null){
  //     // alert(1)
  //   provider = await connect_Wallet(type);

  //   if (provider) {
  //     try {
  //       await  provider.enable()
  //       .then(async function () {
  //         var web3=new Web3(provider)
  //         // alert(1)
  //         // //console.log("connect",web3.currentProvider.isWalletConnect)
  //         if((web3.currentProvider.networkVersion == config.networkVersion)
  //         ||(web3.currentProvider.chainId == config.networkVersion)
  //         )
  //         {
  //           localStorage.setItem('walletConnectType',type)
  //           var balance=0,setacc='';
  //           if(localStorage.walletConnectType=="wc"){
  //             var result = JSON.parse(localStorage.walletconnect).accounts
  //             setacc = result[0];
  //             var val = await web3.eth.getBalance(setacc)
  //             balance = val / 1000000000000000000;
  //             props.Set_UserAccountBal(balance);
  //             currAddr=String(setacc).toLowerCase();
  //             props.set_providers(provider)
  //             config.providercon=provider;
  //             props.Set_UserAccountBal(balance);
  //             props.Set_Accounts(setacc); 
  //             setaccounts(setacc)
  //             props.Set_UserAccountAddr(currAddr);
  //             config.currAdrress=currAddr
  //            props.Set_WalletConnected("true");
  //             var bidvalue = new web3.eth.Contract(
  //               DETH_ABI, config.tokenAddr[config.tokenSymbol]
  //           );
  //           // var bidbln = await bidvalue
  //           //   .methods
  //           //   .balanceOf(currAddr)
  //           //   .call()
  //           // var bidbln1 = (bidbln / config.decimalvalues).toFixed(config.toFixed)
  //           // props.set_Wen_Bln(bidbln1)
  //             await AfterWalletConnected();
  //           }
  //           else if(localStorage.walletConnectType=="mt"){
  //             var result = await web3.eth.getAccounts()
  //             setacc = result[0];
  //             await web3.eth.getBalance(setacc)
  //             .then(async(val) => {
  //               var val = await web3.eth.getBalance(setacc)
  //               balance = val / 1000000000000000000;   
  //             })
  //             currAddr=String(setacc).toLowerCase();
  //             props.set_providers(provider)
  //             config.providercon=provider;
  //             props.Set_UserAccountBal(balance);
  //            props.Set_Accounts(setacc); 
  //            setaccounts(setacc)
  //             props.Set_UserAccountAddr(currAddr);
  //            config.currAdrress=currAddr
  //            props.Set_WalletConnected("true");
 
  //             var bidvalue = new web3.eth.Contract(
  //               DETH_ABI, config.tokenAddr[config.tokenSymbol]
  //           );
  //           // var bidbln = await bidvalue
  //           //   .methods
  //           //   .balanceOf(currAddr)
  //           //   .call()
  //           // var bidbln1 = (bidbln / config.decimalvalues).toFixed(config.toFixed)
  //           // props.set_Wen_Bln(bidbln1)
  //           await AfterWalletConnected();
  //           }
                         
                                 
  //         }
  //         else {
  //           var a=0;
  //           props.Set_WalletConnected("false"); 
  //            if(a==0){
  //             a=a+1
  //              //////console.log("dsdhjash",a)
  //           toast.warning(config.toaster, toasterOption);
  //         }
  //         }
  //       })
  //       .catch((e) => {
  //       })
  //     } catch (err) {
  //       props.Set_WalletConnected("false");
  //     }
  //   }
  //   else {
     
   
  //     props.Set_WalletConnected("false");
  //     if(n==0){
  //       n=n+1
  //     toast.warning("Please Add Wallet", toasterOption);}
  //   }
  // }

  async function clr(){
  
    if(currAddr!=""){
    clearInterval(handle)}
  }
  // async function connect_Wallet(type) {
  //   // window.$('#connect_modal').modal('hide');
  //   if (type == 'wc') {
	// 		var provider = new WalletConnectProvider({
	// 			rpc: {
	// 				 56: "https://bsc-dataseed1.binance.org",
  //         // 97:"https://data-seed-prebsc-1-s1.binance.org:8545/"
  //         //4:"https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
  //       },
	// 			network: 'binance',
  //       //chainId: 4,
	// 			  chainId: 56,
  //      // chainId: 97,
	// 		}
	// 		);
	// 		//////console.log('Connnnnnn>>>>');
	// 		return provider;
	// 	}  
   
  //     else if(type == 'mt') {
  //       var provider = window.ethereum;
  //       return provider;
        
  //     }
    
      
  //   }


//   async function AfterWalletConnected() {
//     // if(accounts!=""){
//       var a=1;
//     await AddressUserDetails_GetOrSave_Call();
//     props.AfterWalletConnected();
 
//   // }  
// }

  async function AddressUserDetails_GetOrSave_Call() {
    var ReqData = {
      addr: String(accounts).toLowerCase()
    }
    var Resp = await AddressUserDetails_GetOrSave_Action(ReqData);
    if (Resp && Resp.data && Resp.data.data && Resp.data.data.User) {
      props.Set_AddressUserDetails(Resp.data.data.User);
    } else {
      props.Set_AddressUserDetails({});
    }
    return true;
  }

//   if(config.providercon!=null){
//     //console.log("Account Changed")
//     config.providercon.on('accountsChanged', function (accounts) {
//       if(timerRef.current) {
//         clearTimeout(timerRef.current);
//       }
//       timerRef.current = setTimeout(() => {
//         getInit(localStorage.kethirthaya);
//       }, 1000);
//   })
//   config.providercon.on('networkChanged', function (networkId) {
//     if(networkId == config.networkVersion){
//       if(timerRef.current) {
//         clearTimeout(timerRef.current);
//       }
//       timerRef.current = setTimeout(() => {
//         getInit(localStorage.kethirthaya);
//       }, 1000);
//       props.Set_WalletConnected("true");
//     }
//     else {
//       props.Set_WalletConnected("false");
//     }
//   })
//   config.providercon.on('disconnect',async function () {
//     localStorage.setItem('kethirthaya','true')
//     localStorage.setItem('connect','false')
//     localStorage.removeItem('walletconnect')
//     props.Set_WalletConnected("false")
//     props.Set_UserAccountAddr("")
//     await (config.providercon).disconnect()
//    })
// }


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
      border: 'none !important',
    },
    overlay: {
     zIndex:2
    },
  };

  let subtitle;
  const [WalletConnectNotifyPopup, Set_WalletConnectNotifyPopup] = React.useState(false);

 
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
      //console.log("eihbufinuiwfiwrigbirwi",pathVal)
    }
  }

  const [location_pathname, Set_location_pathname] = useState(pathVal);


 
  return (<>
    <div>


      {(
        (localStorage.walletConnectType == undefined)
        && (location_pathname != "") &&
        (
          location_pathname == 'my-items'
          || location_pathname == 'following'
          || location_pathname == 'activity'
          || location_pathname == 'edit-profile'
        )
      ) &&
        <Modal
          isOpen={modalopen}
          // onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >

          <h5 className="modal-title react_modal_title" id="wallet_connect_modalLabel_1">Network</h5>


          <div className="modal-body">
            <div className="text-center icon_coin_net">
              <img src={BNB} alt="logo" className="img-fluid" />
            </div>
            <div className="update_cover_div_1" id="update_cover_div_1">
              <p className="mt-0 approve_desc text-center mb-0">{config.toaster}</p>
              <div class ="text-center">
              <button className={"mybadge-timer mt-2"} data-toggle="modal" data-target="#connect_modal">
              Connect
            </button>
            </div>
            </div>

          </div>

        </Modal>
      }
     
    


    </div>
    {/* <Dialog
        disableEnforceFocus
      > */}
    <div className="modal fade primary_modal" id="connect_modal"  role="dialog" aria-labelledby="connect_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false" >
        <div className="modal-dialog modal-dialog-centered modal-sm" role="document">
          <div className="modal-content">
            <div className="modal-header text-center">
              <h5 className="modal-title" id="connect_modalLabel">Connect Your Wallet</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <ul className="connect_ul mb-4">
                {
                   
                  window.ethereum
                  && new Web3( window.ethereum)
                  &&new Web3(window.web3.currentProvider)
                  &&(new Web3(window.web3.currentProvider.isMetaMask))
                  &&
                
                <li>
                  <div className=" connect_card"  onClick={() => {
                              window.$('.modal').modal('hide')
                              if(localStorage.walletconnect!=null){
                                localStorage.removeItem('walletconnect')
                              }
                              localStorage.setItem("walletConnectType","mt")
                              dispatch({
                                type: Account_Connect,
                                Account_Detail: {
                                  WalletConnected: "mt",
                                }
                              })
                            }} >
                    <div className="card-body-mod">
                      <div className="media follow_media">
                        {/* <img src={require("../../assets/images/connect_img_1.png")} alt="User" className="img-fluid mr-2" /> */}

                        <div className="media-body flex_body">
                          <div className="w-100">
                            <div className="wallet-lists" 
                           >
                              <p className="my-2 media_text"> <img src={Icon1}  className="img-fluid mx-2"  />Metamask</p>

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>
                  </div>
                </li>
                }
                <li>
                  <div className="connect_card"    onClick={() => {
                                localStorage.setItem('walletConnectType','wc')
                                window.$('.modal').modal('hide')
                                dispatch({
                                  type: Account_Connect,
                                  Account_Detail: {
                                    WalletConnected: "wc",
                                  }
                                })
                            }}>
                    <div className="card-body-mod">
                      <div className="media follow_media">
                        {/* <img src={require("../../assets/images/connect_img_1.png")} alt="User" className="img-fluid mr-2" /> */}

                        <div className="media-body flex_body">
                          <div className="w-100">
                            <div className="" 
                           >
                              <p className="my-2 media_text"> <img src={Icon3}  className="img-fluid mx-2" />Wallet Connect</p>
                              
                            </div>

                          </div>

                        </div>

                      </div>

                    </div>
                  </div>
                </li>
                {window.ethereum
                  && new Web3( window.ethereum)
                  &&new Web3(window.web3.currentProvider)
                  &&(new Web3(window.web3.currentProvider.isWalletConnect))&&
                 
                <li>
                  <div className="connect_card  d-xl-none" 
                  onClick={() => {
                    // localStorage.setItem('walletConnectType','mt')
                    window.$('.modal').modal('hide')
                    // getInit('mt')
                    if(localStorage.walletconnect!=null){
                      localStorage.removeItem('walletconnect')
                    }
                  }}
                >
                    <div className="card-body-mod">
                      <div className="media follow_media">
                      
                        <div className="media-body flex_body">
                          <div className="w-100">
                            <div className="wallet-lists" >
                              <p className="my-2 media_text"> <img src={Icon4}  className="img-fluid mx-2" />Trust wallet</p>
                                
                            </div>

                          </div>

                        </div>

                      </div>

                    </div>
                  </div>
                </li>}
               
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* </Dialog> */}
</>
  )
}