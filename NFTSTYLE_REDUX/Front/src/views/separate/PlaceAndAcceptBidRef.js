import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState
} from 'react';

import Web3 from 'web3';
import $ from 'jquery';

import config from '../../lib/config';
import DETH_ABI from '../../ABI/DETH_ABI.json';
import EXCHANGE_ABI from '../../ABI/EXCHANGE.json';
import Multiple from '../../ABI/userContract1155.json'
import Single from '../../ABI/userContract721.json'
import Select from 'react-select'
// Import css files
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import isEmpty from "../../lib/isEmpty";

import { Button, TextField } from '@material-ui/core';

import {
  getCurAddr
} from '../../actions/v1/user';

import {
  TokenCounts_Get_Detail_Action,
  BidApply_ApproveAction,
  acceptBId_Action,
  CancelBid_Action,
  null_time_auction,
  checkOtherPlatformDetais1155,
  getListOfToken
} from '../../actions/v1/token';
import ReactPlayer   from 'react-player';
import { toast } from 'react-toastify';
import {getReceipt} from '../../actions/v1/report'
import { useSelector } from 'react-redux';
toast.configure();
let toasterOption = config.toasterOption;


const multipleAddress = config.multiple;
const singleAddress = config.single;

export const PlaceAndAcceptBidRef = forwardRef((props, ref) => {

  
  const Wallet_Details = useSelector(state => state.wallet_connect_context);
const [BidformSubmit, Set_BidformSubmit] = React.useState(false);
const [NoOfToken_NeedToSend, Set_NoOfToken_NeedToSend] = React.useState(false);
const[YouWillPay,Set_YouWillPay]=React.useState(0)
const[MetaMaskAmt,setMetaMaskAmt]=useState(0)
const[Accept_bid_Amt,set_Accept_bid_Amt]=useState(0)
const [accept_btn, Set_accept_btn] = React.useState("start");
const[NoOfToken,Set_NoOfToken]=useState(1)
const [coinname, setCoinNames] = useState('');
const [priceoption, setPriceoption] = React.useState([]);
  const [PurchaseBalance, Set_PurchaseBalance] = React.useState(0);
  const [NewTokenDecimal, setNewTokenDecimal] = React.useState(0);
  
var {
    Set_WalletConnected,
    Set_UserAccountAddr,
    Set_UserAccountBal,
    Set_AddressUserDetails,
    Set_Accounts,
    Set_MyItemAccountAddr,
    Set_tokenCounts,
    Set_item,
    Set_tokenCounts_Detail,
    Set_MyTokenBalance,
    Set_Bids,
    Set_AccepBidSelect,
    Set_tokenBidAmt,
    Set_ValidateError,
    Set_TokenBalance,
   
    Set_YouWillPayFee,
    Set_YouWillGet,
    Set_BidApply_ApproveCallStatus,
    Set_BidApply_SignCallStatus,

    WalletConnected,
    UserAccountAddr,
    UserAccountBal,
    AddressUserDetails,
    Accounts,
    MyItemAccountAddr,
    tokenCounts,
    item,
    tokenCounts_Detail,
    MyTokenBalance,
    Bids,
    AccepBidSelect,
    tokenBidAmt,
    ValidateError,
    TokenBalance,
    
    YouWillPayFee,
    YouWillGet,
    BidApply_ApproveCallStatus,
    BidApply_SignCallStatus,
    AllowedQuantity,
Service_Fee
} = props;
//("bid all",item)
const priceoptionfunc = (e) => {
  setCoinNames(e.label)
  BalanceCalculation(e.label)
};

useEffect(() => {
  PriceCalculate_this()
},[PurchaseBalance])

function PriceCalculate_this(data = {}) {
  var web3 = new Web3(Wallet_Details.providerss)
  var price = (typeof data.tokenBidAmt != 'undefined') ? data.tokenBidAmt : tokenBidAmt;
  var quantity = (typeof data.NoOfToken != 'undefined') ? data.NoOfToken : NoOfToken;
  if (price == '') { price = 0; }
  if (quantity == '') { quantity = 0; }
  if (isNaN(price) != true && isNaN(quantity) != true) {
    if(price >= 0.0001){
    if (item.type == 721) {
      var totalPrice = price* 1000000;
    }
    else {
      var totalPrice = (price * 1000000) * quantity;
    }
    var toMid = totalPrice 
    var serfee = (toMid)*((web3.utils.fromWei(String(Service_Fee),'szabo')))/100000000
    //console.log("dbhfvbehjvfhrhfvjbvf",toMid,serfee,(serfee/1000000) + (toMid/1000000))
    var totfee = (serfee/1000000) + (toMid/1000000)
    if(NewTokenDecimal == 18)
    {
        setMetaMaskAmt( web3.utils.toWei(String(Number(totfee))));
    }
    else{
        setMetaMaskAmt((Number(totfee))*(10**(NewTokenDecimal)));
    }
    Set_YouWillPay((String(Number(totfee))))
  }
  else {
    Set_YouWillPay(0);
  }
  }
  else {
    Set_YouWillPay(0);
  }
}

async function BalanceCalculation(Coin){
  if(config.providercon) {
      var web3 = new Web3(config.providercon)
      if(
          web3
      ) {
          var web3   = new Web3(config.providercon);
          const MultiContract = new web3.eth.Contract(Single, config.singleContract);
          var tokenAddress = await MultiContract.methods.getTokenAddress(Coin).call()
            const TokenObj = new web3.eth.Contract(DETH_ABI, tokenAddress);
            var TokenBalance = Number(await TokenObj.methods.balanceOf(UserAccountAddr).call())
            var TokenDecimal = Number(await TokenObj.methods.decimals().call())
            Set_PurchaseBalance(TokenBalance/(10**(TokenDecimal)))
            setNewTokenDecimal(TokenDecimal)     
      }
  }

}

async function getBuyTokensList() {
  var TokenList = await getListOfToken()
  var ListOption = [];

  if (TokenList) {
    TokenList.data.data.data.slice(1).map((item) => {
      ListOption.push({
        label: item.tokenSymbol
      })
    })
   
    if(ListOption.length > 0)
    {
    //console.log("DropdownToken",ListOption)
    setPriceoption(ListOption);
    setPriceoption(ListOption);
    //console.log("DropdownToken",priceoption)
    }
  }

}

const Validation_PlaceABid = (chk) => {
  //console.log("tokenCounts_Detail.TotalQuantity",Bids)
    if(chk) {
      var ValidateError = {};
      if(NoOfToken == '') {
        ValidateError.NoOfToken = '"Quantity" is not allowed to be empty';
      }
      else if(isNaN(NoOfToken) == true) {
        ValidateError.NoOfToken = '"Quantity" must be a number';
      }
      else if (NoOfToken == 0 || NoOfToken < 1) {
        ValidateError.NoOfToken = '"Quantity" is required';
      }
      else if(NoOfToken == '') {
        ValidateError.NoOfToken = '"Quantity" is required';
      }
      else if(NoOfToken > AllowedQuantity) {
        ValidateError.NoOfToken = '"Quantity" must be less than or equal to '+AllowedQuantity;
      }
  
      if(tokenBidAmt == '') {
        ValidateError.tokenBidAmt = '"Bid amount" is not allowed to be empty';
      }
      else if(isNaN(tokenBidAmt) == true) {
        ValidateError.tokenBidAmt = '"Bid amount" must be a number';
      }
      else if(tokenBidAmt == 0) {
        ValidateError.tokenBidAmt = '"Bid amount" is required';
      }
      else if(tokenBidAmt < 0.0001 || tokenBidAmt > 1e12) {
        ValidateError.tokenBidAmt = 'Bid Must be Between 0.0001 to 1e12';
      }
      
      else if(tokenBidAmt < (Bids&&Bids.pending&&(Bids.pending).length>0&&Bids.pending[0].tokenBidAmt)) {
        ValidateError.tokenBidAmt = '"Bid amount" must be greater than '+(Bids&&Bids.pending&&(Bids.pending).length>0&&Bids.pending[0].tokenBidAmt);
      }
      else if(tokenBidAmt == (Bids&&Bids.pending&&(Bids.pending).length>0&&Bids.pending[0].tokenBidAmt)) {
        ValidateError.tokenBidAmt = '"Bid amount" must be greater than '+(Bids&&Bids.pending&&(Bids.pending).length>0&&Bids.pending[0].tokenBidAmt);
      }
      else if(item.minimumBid > tokenBidAmt) {
        ValidateError.tokenBidAmt = '"Bid amount" must be higher than or equal to '+item.minimumBid;
      }
      else if(YouWillPay/1e18 > PurchaseBalance) {
        ValidateError.tokenBidAmt = 'Insufficient balance, Check your wallet balance';
      }
      else if(PurchaseBalance ==0) {
        ValidateError.tokenBidAmt = 'Insufficient balance, Check your wallet balance';
      }
      // else if(YouWillPayTest == 0){
      //   ValidateError.tokenBidAmt = 'Must be 2 digits required after decimal point';
    
      // }
  
      // //////////console.log('ValidateError', ValidateError);
  
      Set_ValidateError(ValidateError);
      return ValidateError;
    }
}


const inputChange = (e) => {
    // //('inputChange');
    if(e && e.target && typeof e.target.value != 'undefined' && e.target.name) {
      var value = e.target.value;
      switch(e.target.name) {
        case 'tokenBidAmt':
          // if(value != '' && isNaN(value) == false && value > 0) {
          //   Set_tokenBidAmt(value);
          //   PriceCalculate_this({tokenBidAmt:value});
          // }
          // else {
          //   // Set_tokenBidAmt('0');
          //   PriceCalculate_this({tokenBidAmt:0});
          // }
          Set_tokenBidAmt(value);
          PriceCalculate_this({tokenBidAmt:value});
          // alert(tokenBidAmt)
          break;
        case 'NoOfToken':
          // if(value != '' && isNaN(value) == false && value > 0) {
          //   Set_NoOfToken(value);
          //   PriceCalculate_this({NoOfToken:value});
          // }
          // else {
          //   // Set_NoOfToken('0');
          //   PriceCalculate_this({NoOfToken:0});
          // }
          Set_NoOfToken(value);
          PriceCalculate_this({NoOfToken:value});
          break;
          // code block
      }
      // window.$('#Validation_PlaceABid').click();
    }
}

async function FormSubmit_PlaceABid (e) {
    Set_BidformSubmit(true);
    var errors = await Validation_PlaceABid(true);
    var errorsSize = Object.keys(errors).length;
    if(errorsSize != 0) {
      toast.error("Form validation error. Fix all mistakes and submit again", toasterOption);
      return false;
    }
    window.$('#place_bid_modal').modal('hide');
    window.$('#proceed_bid_modal').modal('show');
}

async function BidApply_ApproveCall() {
  var handle=null;
  var receipt=null;
  if (!config.providercon) {
      toast.warning("OOPS!..connect Your Wallet", toasterOption);
      return false;
    }
    var web3 = new Web3(config.providercon);
    var currAddr = (UserAccountAddr != "")? UserAccountAddr : Wallet_Details.UserAccountAddr
    if (!currAddr) {
      toast.warning("OOPS!..connect Your Wallet", toasterOption);
    }
    Set_BidApply_ApproveCallStatus('processing');
    const MultiContract = new web3.eth.Contract(Multiple, config.multipleContract);
    var tokenAddress = await MultiContract.methods.getTokenAddress(coinname).call()
    var CoursetroContract = new web3.eth.Contract(DETH_ABI, tokenAddress);
    var handle=null;
    var receipt=null
    //console.log("jfbefbkjebnfew",tokenAddress,coinname,UserAccountAddr)
    try{
    if(item.type == 721){
      
      var getAllowance = await CoursetroContract
                       .methods
                       .allowance(
                        UserAccountAddr,
                        config.singleContract
                       ).call()

                       if(NewTokenDecimal == 18)
                       {
                        var sendVal=web3.utils.toWei(String(Number(web3.utils.fromWei(String(MetaMaskAmt)))+Number(web3.utils.fromWei(String(getAllowance)))))
                       }
                       else{
                        var sendVal=(((Number(MetaMaskAmt))/(10**(NewTokenDecimal)))+((Number(getAllowance))/(10**(NewTokenDecimal))))*(10**(NewTokenDecimal))
                       }
      //console.log("metamsk sendmt",MetaMaskAmt,getAllowance,sendVal)
      await CoursetroContract
    .methods
    .approve(
      config.singleContract,
      // YouWillPayWei+getAllowance
      sendVal.toString()
    )
    .send({from: Wallet_Details.Accounts})
    .on('transactionHash',async (transactionHash) => {
      handle = setInterval(async () => {
          receipt = await getReceipt(web3, transactionHash)
          clr1();
        }, 8000)
  })
  
    }
    else{
      var getAllowance = await CoursetroContract
                       .methods
                       .allowance(
                        UserAccountAddr,
                        config.multipleContract
                       ).call()
                       if(NewTokenDecimal == 18)
                       {
                        var sendVal=web3.utils.toWei(String(Number(web3.utils.fromWei(String(MetaMaskAmt)))+Number(web3.utils.fromWei(String(getAllowance)))))
                       }
                       else{
                        var sendVal=((Number(MetaMaskAmt))+(Number(web3.utils.fromWei(String(getAllowance)))))
                       }
      console.log("metamsk sendmt",MetaMaskAmt,getAllowance,sendVal)
      await CoursetroContract
    .methods
    .approve(
      config.multipleContract,
      sendVal.toString()
    )
    .send({from: Wallet_Details.Accounts})
    .on('transactionHash',async (transactionHash) => {
      handle = setInterval(async () => {
          receipt = await getReceipt(web3, transactionHash)
          clr1();
        }, 8000)
  })
    
    }}
    catch(e){
      toast.error("Approve failed", toasterOption);
      console.log("check bid test",e)
      Set_BidApply_ApproveCallStatus('tryagain');
    }
    
   async function clr1(){
     //console.log("come 1")
    if(receipt!=null){
      //console.log("come 12")
      clearInterval(handle);
      if(receipt.status==true){  
        //console.log("come 13")
      var BidData = {
        tokenCounts: item.tokenCounts,
        tokenBidAddress: UserAccountAddr,
        tokenBidAmt: tokenBidAmt,
        coinname: coinname,
        NoOfToken: item.type == 721 ? 1 : NoOfToken,
        owner:item.tokenowners_current[0]&&item.tokenowners_current[0].tokenOwner
      }
      //console.log("hsagdhgasgdasgdghashdjadsghasgdjasgdgasjgdjasd",BidData)
      var Resp = await BidApply_ApproveAction(BidData);
      Set_BidApply_ApproveCallStatus('done');
      if(Resp.data && Resp.data.type && Resp.data.type == 'success') {
        toast.success("Approve Successfully", toasterOption);
  
      }
      else {
        toast.error("Approve failed", toasterOption);
        Set_BidApply_ApproveCallStatus('tryagain');
      }
    
   }  }}    
}
async function BidApply_SignCall() {
  if (!Wallet_Details.providerss) {
    toast.warning("OOPS!..connect Your Wallet", toasterOption);
    return;
  }
  var web3 = new Web3(Wallet_Details.providerss);
  var currAddr = (UserAccountAddr != "")?UserAccountAddr : Wallet_Details.UserAccountAddr
  if (!currAddr) {
    toast.warning("OOPS!..connect Your Wallet", toasterOption);
    return;
  }

  Set_BidApply_SignCallStatus('processing');

  try{
    await   web3.eth.personal.sign("Bidding a Art", currAddr, "Bid Placed")
   toast.success("Bid sign successfully", toasterOption);
    Set_BidApply_SignCallStatus('done');
    setTimeout(() => window.$('#proceed_bid_modal').modal('hide'), 600);
   
      window.location.reload()
  
}
  catch(e){
    toast.error("Sign failed", toasterOption);
    Set_BidApply_SignCallStatus('tryagain');
  }
}

async function CancelBid_Proceed(curBid_val) {
  var payload = {
    tokenCounts: curBid_val.tokenCounts,
    tokenBidAddress: curBid_val.tokenBidAddress,
    owner:item.tokenowners_current[0]&&item.tokenowners_current[0].tokenOwner
   
  }
  var Resp = await CancelBid_Action(payload);
  if(Resp && Resp.data && Resp.data.toast && Resp.data.toast.type && Resp.data.toast.message) {
    if(Resp.data.toast.type == 'error') {
      toast.error(Resp.data.toast.message, toasterOption);
    }
    else if(Resp.data.toast.type == 'success') {
      toast.success(Resp.data.toast.message, toasterOption);
    }
  }
  setTimeout(() => window.$('.modal').modal('hide'), 600);
  window.location.reload();
 
}

async function AcceptBid_Proceed() {
    var curAddr = UserAccountAddr;
    if (Wallet_Details.providerss) {
      var web3 = new Web3(Wallet_Details.providerss);
      var handle=null;
      var receipt=null;
      var passAmt = (Number(YouWillPayFee*1e6) + Number(YouWillGet*1e6));
      passAmt = passAmt/1e6
      // passAmt = passAmt.toFixed(config.toFixed)
      // passAmt = (passAmt * config.decimalvalues).toString();
      const MultiContract = new web3.eth.Contract(Multiple, config.multipleContract);
      var tokenAddress = await MultiContract.methods.getTokenAddress(AccepBidSelect.coinname).call()
      //console.log("bnbsdijnuoinviuowniounrownw",tokenAddress,passAmt*config.decimalvalues,passAmt,NoOfToken_NeedToSend,Accept_bid_Amt,AccepBidSelect.coinname)
      var CHcekDethBlnOfBid = new web3.eth.Contract(DETH_ABI, tokenAddress);
      var getBlnofBidder=await CHcekDethBlnOfBid.methods.balanceOf(AccepBidSelect.tokenBidAddress).call();
      var tokenBalance = getBlnofBidder / config.decimalvalues;
      var getAllowance=await CHcekDethBlnOfBid.methods.allowance(AccepBidSelect.tokenBidAddress,(item.type==721?config.singleContract:config.multipleContract)).call();
      var getAllowancecal =web3.utils.toWei(getAllowance) ;
      //console.log("bnbsdijnuoinviuowniounrownw",tokenBalance,passAmt*config.decimalvalues,passAmt,getAllowancecal,NoOfToken_NeedToSend,Accept_bid_Amt,config.tokenSymbol)
      if(
        (tokenBalance)>(passAmt)
        // true
        ){
        
        if(
        (Number(getAllowancecal))>(passAmt*config.decimalvalues)
        // true
        ){
      if(NoOfToken_NeedToSend) {
        try{
          Set_accept_btn('process')
        if(item.type == 721){
          var CoursetroContract = new web3.eth.Contract(Single, config.singleContract);
                    CoursetroContract
                  .methods
                  .acceptBId(
                    AccepBidSelect.coinname,
                    AccepBidSelect.tokenBidAddress,
                    Accept_bid_Amt.toString(),
                    item.tokenCounts
                  )
                  .send({from:Wallet_Details.Accounts})
                  .on('transactionHash',async (transactionHash) => {
                    handle = setInterval(async () => {
                        receipt = await getReceipt(web3, transactionHash)
                        clr1();
                      }, 8000)
                })
                
        }
        else{
          //console.log("bebirhnfauhneuin",config.tokenSymbol,AccepBidSelect.tokenBidAddress,Accept_bid_Amt,item.tokenCounts,NoOfToken_NeedToSend)
          var CoursetroContract = new web3.eth.Contract(Multiple, config.multipleContract);
                    CoursetroContract
                  .methods
                  .acceptBId(
                    AccepBidSelect.coinname,
                    AccepBidSelect.tokenBidAddress,
                    Accept_bid_Amt.toString(),
                    item.tokenCounts,
                    NoOfToken_NeedToSend
                  )
                  .send({from:Wallet_Details.Accounts})
                  .on('transactionHash',async (transactionHash) => {
                    handle = setInterval(async () => {
                        receipt = await getReceipt(web3, transactionHash)
                        clr1();
                      }, 8000)
                })
                
        }
      }
      catch(e){
        //console.log("err____",e)
        toast.error("accept bid cancelled",toasterOption)
        Set_accept_btn('try')
     
      }
        async function clr1(){
          if(receipt!=null){
            clearInterval(handle);
            if(receipt.status==true){  
            var acceptBId_Payload = {
              tokenCounts: item.tokenCounts,
              NoOfToken : NoOfToken_NeedToSend, //AccepBidSelect.NoOfToken,
              tokenBidAddress: AccepBidSelect.tokenBidAddress,
              UserAccountAddr_byaccepter: curAddr,
              coin:AccepBidSelect.coinname,
              price:AccepBidSelect.tokenBidAmt,
              transactionHash: receipt.transactionHash
            }
            var Resp = await acceptBId_Action(acceptBId_Payload);
            if(item.clocktime!=null && item.endclocktime !=null){
            var nullTimeAUction = await null_time_auction(acceptBId_Payload);}
            setTimeout(() => window.$('.modal').modal('hide'), 600);
            Set_accept_btn('done')
            setTimeout(() => window.location.reload(), 600);
                   
        }}}
        
      }
    }
    else{
      toast.error("This Bidder Doesn't have enough allowance,Pleae try  another bidder 2")
      Set_accept_btn('error1')
    }
  }
  
  else{
    toast.error("This Bidder Doesn't have enough balance,Pleae try  another bidder 1")
    Set_accept_btn('error')
  }
    }
}

useImperativeHandle(
  ref,
  () => ({
    async PlaceABid_Click() {
      if(Wallet_Details.providerss) {
        Set_BidformSubmit(false);
      if(Bids && Bids.myBid && Bids.myBid.tokenBidAmt) {
        Set_tokenBidAmt(Bids.myBid.tokenBidAmt);
        Set_NoOfToken(Bids.myBid.NoOfToken);
        // Set_Bids()
        Set_Bids(Bids)
      }
      if(new Date(item.endclocktime) > Date.now()){
        //console.log("Clock Time",item)
        //alert("in")
        setCoinNames(item.CoinName);
        BalanceCalculation(item.CoinName)
      }
      window.$('#place_bid_modal').modal('show');
    }
    else{
      // //("callend place a bid")
      window.$('#place_bid_modal').modal('hide');
      window.$('#connect_modal').modal('show')
    }
    },
    async PriceCalculate(data={}) {
      PriceCalculate_this(data);
    },


    async AcceptBid_Select(curBid_val) {
    if(Wallet_Details.providerss){
      var web3=new Web3(Wallet_Details.providerss)
      var BuyOwnerDetail={
        tokenOwner:UserAccountAddr,
        tokenCounts:curBid_val.tokenCounts
      }
      var balance = await checkOtherPlatformDetais1155(item,BuyOwnerDetail,item.type,web3);
            //console.log('balance>>>>>>>>>',balance,curBid_val,item)
            if (balance == 0) {
              toast.warning("You won't buy at this moment please refresh you data",toasterOption);
              setTimeout(() => {
                  window.location.href="/"
              }, 1000);
              return false;
          }
          else{
      if(curBid_val && curBid_val.tokenBidAmt) {
        window.$('#accept_modal').modal('show');
        Set_AccepBidSelect(curBid_val);

        //console.log("bebirhnfauhneuin",curBid_val)
        if(MyTokenBalance < curBid_val.pending) {
          Set_NoOfToken_NeedToSend(MyTokenBalance);
          var totalAmt = Number(MyTokenBalance) * (Number(curBid_val.tokenBidAmt)*1000000);
        }
        else {
          Set_NoOfToken_NeedToSend(curBid_val.pending);
          var totalAmt =Number(curBid_val.pending) * (Number(curBid_val.tokenBidAmt)*1000000);
        }
        var TotAmt=web3.utils.toWei(String(totalAmt/1e6))
        var toMid = Number(totalAmt)
        var ServiceFee_val = (toMid)*((web3.utils.fromWei(String(Service_Fee),'szabo')))/100000000
        var YouWillGet_Val = (toMid/1e6 - ServiceFee_val/1e6);
        //console.log("hbebfunwbufn",TotAmt,totalAmt,toMid,ServiceFee_val,YouWillGet_Val)
        Set_YouWillPayFee(ServiceFee_val);
        Set_YouWillGet((YouWillGet_Val));
        set_Accept_bid_Amt(TotAmt)
      }
    }
    }
    else{
      // //("called")
      window.$('#connect_modal').modal('show')
    }
    },
    async CancelBid_Select(curBid_val) {
      if(window.ethereum) {
        if(
        curBid_val
        && curBid_val.pending > 0
        &&
        (
          curBid_val.status == 'pending'
          || curBid_val.status == 'partiallyCompleted'
        )
      ) {
        Set_AccepBidSelect(curBid_val);
        window.$('#cancel_modal').modal('show');
      }
      else {
        window.$('.modal').modal('hide')
      }
    }
  
  else{
    window.$('#connect_modal').modal('show')
  }
  }
  
  }),
)

useEffect(() => {
  getBuyTokensList();
  Validation_PlaceABid(BidformSubmit);
}, [
  tokenBidAmt,
  NoOfToken
])

  return (
    <div>
      <div id="Validation_PlaceABid" onClick={() => Validation_PlaceABid(BidformSubmit)}></div>
      {/* place_bid Modal */}
      <div class="modal fade primary_modal" id="place_bid_modal" tabindex="-1" role="dialog" aria-labelledby="place_bid_modalCenteredLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-md" role="document">
          <div class="modal-content">
              <div class="modal-header text-center">
              <h5 class="modal-title" id="place_bid_modalLabel">Place a bid</h5>
              <p className="text-center place_bit_desc">You are about to place a bid for</p>
              <p className="place_bit_desc_2 word_brak_text_inline_p"><span className="text_red mr-2">{item.tokenName}</span>by<span className="text_red ml-2 word_brak_text_inline">{MyItemAccountAddr ? MyItemAccountAddr: UserAccountAddr}</span></p>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
              </div>
              <div class="modal-body px-0 pt-0">
                <form className="px-4 bid_form">
                  <label for="bid">Your bid</label>
                  <div class="input-group mb-3 input_grp_style_1 input_grp_without_img">
                    <input
                        type="text"
                        name="tokenBidAmt"
                        id="tokenBidAmt"
                        class="form-control"
                        placeholder="Enter your bit amount"
                        aria-label="bid"
                        aria-describedby="basic-addon2"
                        onChange={inputChange}
                        maxLength={config.maxLength}
                    />
                    {new Date(item.endclocktime) < Date.now() ?
                      <div className="input-group-append px-0">
                            {/* <span className="input-group-text px-0" id="basic-addon2">
                            BNB
                             </span> */}
                            <div className="input-group-append input_selct_new">
                              <Select
                                className="input-group-text px-0"
                                id="basic-addon2"
                                name="coinname"
                                onChange={priceoptionfunc}
                                options={priceoption}
                                label="Select price"
                                formControlProps={{
                                  fullWidth: true
                                }}
                              />

                            </div>
                          </div>
                          :
                          <>
                          <div class="input-group-append">
                          <span className="input-group-text" id="basic-addon2">
                            {coinname}
                             </span> </div></>
                             }
                  </div>
                  {ValidateError.tokenBidAmt && <span className="text-danger">{ValidateError.tokenBidAmt}</span>}
                  {item.type == config.multipleType
                   && <label for="qty">Enter quantity <span className="label_muted pl-2">({AllowedQuantity} available)</span></label> }
                  {item.type == config.multipleType
                   && <div class="mb-3 input_grp_style_1">
                  <input
                      type="text"
                      name="NoOfToken"
                      id="NoOfToken"
                      class="form-control"
                      placeholder="Enter your bit quantity"
                      onChange={inputChange}
                      value={NoOfToken}
                  />
                  </div>}
                  {ValidateError.NoOfToken && <span className="text-danger">{ValidateError.NoOfToken}</span>}
                  <div className="row pb-3">
                  <div className="col-12 col-sm-6">
                      <p className="buy_desc_sm">Your balance</p>
                  </div>
                  <div className="col-12 col-sm-6 text-sm-right">
                      <p className="buy_desc_sm_bold">{UserAccountBal} {config.currencySymbol}</p>
                  </div>
                  </div>
                  <div className="row pb-3">
                  <div className="col-12 col-sm-6">
                      <p className="buy_desc_sm">Your bidding balance</p>
                  </div>
                  <div className="col-12 col-sm-6 text-sm-right">
                      <p className="buy_desc_sm_bold">{PurchaseBalance} {coinname}</p>
                  </div>
                  </div>
                  <div className="row pb-3">
                  <div className="col-12 col-sm-6">
                      <p className="buy_desc_sm">Service fee</p>
                  </div>
                  <div className="col-12 col-sm-6 text-sm-right">
                      <p className="buy_desc_sm_bold">{((Wallet_Details.Service_Fee)/(10**18))}% <span>{coinname}</span></p>
                  </div>
                  </div>
                  <div className="row pb-3">
                  <div className="col-12 col-sm-6">
                      <p className="buy_desc_sm">You will pay</p>
                  </div>
                  <div className="col-12 col-sm-6 text-sm-right">
                      <p className="buy_desc_sm_bold">{(YouWillPay)}</p>
                  </div>
                  </div>

                  <div className="text-center">
                  {/* data-dismiss="modal" aria-label="Close" data-toggle="modal" data-target="#proceed_bid_modal" */}
                  <Button className="primary_btn btn-block" onClick={() => FormSubmit_PlaceABid()} >Place a bid</Button>
                  </div>

              </form>
              </div>
          </div>
          </div>
      </div>
      {/* end place_bid modal */}

      {/* proceed_bid Modal */}
      <div class="modal fade primary_modal" id="proceed_bid_modal" tabindex="-1" role="dialog" aria-labelledby="proceed_bid_modalCenteredLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-md" role="document">
          <div class="modal-content">
              <div class="modal-header text-center">
              <h5 class="modal-title" id="proceed_bid_modalLabel">Follow Steps</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
              </div>
              <div class="modal-body">
              <form>
                  <div className="media approve_media">
                  <i className="fas fa-check mr-3 pro_complete" aria-hidden="true"></i>
                  {/* <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true"></i> */}
                  <div className="media-body">
                      <p className="mt-0 approve_text">Approve</p>
                      <p className="mt-0 approve_desc">Checking balance and approving</p>
                  </div>
                  </div>
                  <div className="text-center my-3">
                  <Button
                      className={"btn-block " + ( (BidApply_ApproveCallStatus=='processing' || BidApply_ApproveCallStatus=='done') ? 'primary_btn' : 'primary_btn')}
                      disabled={(BidApply_ApproveCallStatus=='processing' || BidApply_ApproveCallStatus=='done')}
                      onClick={BidApply_ApproveCall}
                      >
                      {BidApply_ApproveCallStatus == 'processing' && <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true" id="circle1"></i >}
                      {BidApply_ApproveCallStatus == 'init' && 'Approve'}
                      {BidApply_ApproveCallStatus == 'processing' && 'In-progress...'}
                      {BidApply_ApproveCallStatus == 'done' && 'Done'}
                      {BidApply_ApproveCallStatus == 'tryagain' && 'Try Again'}
                      </Button>
                  </div>
                  <div className="media approve_media">
                  <i className="fas fa-check mr-3" aria-hidden="true"></i>
                  <div className="media-body">
                      <p className="mt-0 approve_text">Signature</p>
                      <p className="mt-0 approve_desc">Create a signatute to place a bid</p>
                  </div>
                  </div>
                  <div className="text-center mt-3">
                  <Button
                      className={"btn-block " + ( (BidApply_ApproveCallStatus!='done' || BidApply_SignCallStatus=='processing' || BidApply_SignCallStatus=='done') ? 'primary_btn' : 'primary_btn')}
                      disabled={(BidApply_ApproveCallStatus!='done' || BidApply_SignCallStatus=='processing' || BidApply_SignCallStatus=='done')}
                      onClick={BidApply_SignCall}
                  >
                      {BidApply_SignCallStatus == 'processing' && <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true" id="circle1"></i >}
                      {BidApply_SignCallStatus == 'init' && 'Start'}
                      {BidApply_SignCallStatus == 'processing' && 'In-progress...'}
                      {BidApply_SignCallStatus == 'done' && 'Done'}
                      {BidApply_SignCallStatus == 'tryagain' && 'Try Again'}
                  </Button>
                  </div>
              </form>
              </div>
          </div>
          </div>
      </div>
      {/* end proceed_bid modal */}

      {/* accept bid Modal */}
      <div class="modal fade primary_modal" id="accept_modal" tabindex="-1" role="dialog" aria-labelledby="accept_modalCenteredLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-md" role="document">
          <div class="modal-content">
              <div class="modal-header text-center">
              <h5 class="modal-title" id="accept_modalLabel">Accept bid</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
              </div>
              <div class="modal-body px-0">
              <div className="img_accept text-center">
                  {
                  item && item.image && item.image.split('.').pop() == "mp4" ?
                  <ReactPlayer  className="video_res"
                  playing={true} 
                   url={item.ipfsimage!=""? `${config.IPFS_IMG}/${item.ipfsimage}`:
                   `${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`}
                  loop={true}
                  controls={true}
                  muted={true}
                  playsinline={true}/> 
                    :
                  <img src={item.ipfsimage!=""? `${config.IPFS_IMG}/${item.ipfsimage}`:`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} alt="Collections" className="img-fluid " />
                  }
              </div>
              <p className="text-center accept_desc">
                  <span className="buy_desc_sm">You are about to accept bid for</span>
                  <span className="buy_desc_sm_bold pl-2">{item.tokenName}</span>
                  <span className="buy_desc_sm pl-2">from</span>
                  <span className="buy_desc_sm_bold pl-2">{AccepBidSelect.tokenBidAddress}</span>
              </p>
              <p className="info_title text-center">{AccepBidSelect.tokenBidAmt} {AccepBidSelect.coinname} for {NoOfToken_NeedToSend} edition(s)</p>
              <div className="row mx-0 pb-3">
                  <div className="col-12 col-sm-6 px-4">
                  <p className="buy_desc_sm">Service fee in %</p>
                  </div>
                  <div className="col-12 col-sm-6 px-4 text-sm-right">
                  <p className="buy_desc_sm_bold">{((Wallet_Details.Service_Fee)/(10**18))}%</p>
                  </div>
              </div>
              <div className="row mx-0 pb-3">
                  <div className="col-12 col-sm-6 px-4">
                  <p className="buy_desc_sm">Royalty fee in %</p>
                  </div>
                  <div className="col-12 col-sm-6 px-4 text-sm-right">
                  <p className="buy_desc_sm_bold">{((item.tokenRoyality))}%</p>
                  </div>
              </div>
              <div className="row mx-0 pb-3">
                  <div className="col-12 col-sm-6 px-4">
                  <p className="buy_desc_sm">You will get</p>
                  </div>
                  <div className="col-12 col-sm-6 px-4 text-sm-right">
                  <p className="buy_desc_sm_bold">{(YouWillGet)} {AccepBidSelect.coinname}</p>
                  </div>
              </div>
              <form className="px-4">
                  <div className="text-center">
                  <Button className="primary_btn btn-block" 
                        onClick={(accept_btn=="start"||accept_btn=="try")&& AcceptBid_Proceed}
                        disabled={(accept_btn=="process"||accept_btn=="done")}
                        >{accept_btn == "start" && 'Accept Bid'}
                        {accept_btn == "try" && 'Try Again'}
                        {accept_btn == "process" && 'In-Progress'}
                        {accept_btn == "done" && 'Done'}
                        {accept_btn == "error" && 'Something went wrong'}
                        {accept_btn == "error1" && "Bidder doesn't have enough allowance"}
                       
                        </Button>
                        <Button className="cancel_btn btn-block" 
                          disabled={(accept_btn=="process")}
                        data-dismiss="modal" aria-label="Close">Cancel</Button>
                      </div>
              </form>
              </div>
          </div>
          </div>
      </div>
      {/* end accept bid modal */}

      {/* accept bid Modal */}
      <div class="modal fade primary_modal" id="cancel_modal" tabindex="-1" role="dialog" aria-labelledby="accept_modalCenteredLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-md" role="document">
          <div class="modal-content">
              <div class="modal-header text-center">
              <h5 class="modal-title" id="accept_modalLabel">Cancel bid</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
              </div>
              <div class="modal-body px-0">
              <div className="img_accept text-center">
                  {
                  item && item.image && item.image.split('.').pop() == "mp4" ?
                  // <video src={`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} type="video/mp4" alt="Collections" className="img-fluid" autoPlay controls playsInline loop />
                  <ReactPlayer  playing={true}  url={item.ipfsimage!=""? `${config.IPFS_IMG}/${item.ipfsimage}`:`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`}
                  loop={true}
                  className="img-fluid" 
                  controls={true}
                  muted={true}
                  playsinline={true}/> 
                  :
                  <img src={item.ipfsimage!=""? `${config.IPFS_IMG}/${item.ipfsimage}`:`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} alt="Collections" className="img-fluid " />
                  }
              </div>
              <p className="text-center accept_desc p-3">
                  <span className="buy_desc_sm">You are about to cancel bid for</span>
                  <span className="buy_desc_sm_bold pl-2">{item.tokenName}</span>
              </p>
              <p className="info_title text-center">{AccepBidSelect.tokenBidAmt} {AccepBidSelect.coinname} for {AccepBidSelect.pending} edition(s)</p>
              <form className="px-4">
                  <div className="text-center">
                  <Button className="primary_btn btn-block" onClick={() => CancelBid_Proceed(AccepBidSelect)}>Cancel bid</Button>
                  <Button className="cancel_btn btn-block" data-dismiss="modal" aria-label="Close">Cancel</Button>
                  </div>
              </form>
              </div>
          </div>
          </div>
      </div>
      {/* end accept bid modal */}
    </div>
  )
})

