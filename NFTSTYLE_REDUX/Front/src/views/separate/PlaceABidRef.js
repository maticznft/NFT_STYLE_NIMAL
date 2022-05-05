import React, {
    forwardRef,
    useImperativeHandle,
    useEffect
} from 'react';

import Web3 from 'web3';
import $ from 'jquery';

import config from '../../lib/config';
import DETH_ABI from '../../ABI/DETH_ABI.json';
import EXCHANGE_ABI from '../../ABI/EXCHANGE.json';

// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import isEmpty from "../../lib/isEmpty";

import { Button, TextField } from '@material-ui/core';

import {
    getCurAddr
} from '../../actions/v1/user';

import {
    TokenCounts_Get_Detail_Action,
    BidApply_ApproveAction,
    acceptBId_Action,
    CancelBid_Action
} from '../../actions/v1/token';

import { toast } from 'react-toastify';
toast.configure();
let toasterOption = config.toasterOption;

const exchangeAddress = config.exchangeAddress;

export const PlaceABidRef = forwardRef((props, ref) => {

    const [BidformSubmit, Set_BidformSubmit] = React.useState(false);
    const [NoOfToken_NeedToSend, Set_NoOfToken_NeedToSend] = React.useState(false);

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
        Set_NoOfToken,
        Set_ValidateError,
        Set_TokenBalance,
        Set_YouWillPay,
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
        NoOfToken,
        ValidateError,
        TokenBalance,
        YouWillPay,
        YouWillPayFee,
        YouWillGet,
        BidApply_ApproveCallStatus,
        BidApply_SignCallStatus,
        AllowedQuantity
    } = props;

    function PriceCalculate_this(data={}) {
        var price = (typeof data.tokenBidAmt != 'undefined') ? data.tokenBidAmt : tokenBidAmt;
        var quantity = (typeof data.NoOfToken != 'undefined') ? data.NoOfToken : NoOfToken;
        if(price == '') { price = 0; }
        if(quantity == '') { quantity = 0; }
        if(isNaN(price) != true && isNaN(quantity) != true) {
          if(item.type == 721) {
            var totalPrice = price;
          }
          else {
            var totalPrice = price * quantity;
          }
          var per = (totalPrice * config.fee) / 100;
          var finalPrice = totalPrice + per;
          var totalPriceWithFee = parseFloat(finalPrice).toFixed(config.toFixed);
          Set_YouWillPay(totalPriceWithFee);
        }
        else {
          Set_YouWillPay(0);
        }
    }

    const Validation_PlaceABid = (chk) => {
        if(chk) {
          var ValidateError = {};
      
          if(NoOfToken == '') {
            ValidateError.NoOfToken = '"Quantity" is not allowed to be empty';
          }
          else if(isNaN(NoOfToken) == true) {
            ValidateError.NoOfToken = '"Quantity" must be a number';
          }
          else if(NoOfToken == 0) {
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
          // else if(tokenBidAmt > tokenCounts_Detail.TotalQuantity) {
          //   ValidateError.tokenBidAmt = '"Bid amount" must be less than or equal to '+tokenCounts_Detail.TotalQuantity;
          // }
          else if(item.minimumBid > tokenBidAmt) {
            ValidateError.tokenBidAmt = '"Bid amount" must be higher than or equal to '+item.minimumBid;
          }
          else if(YouWillPay > TokenBalance) {
            ValidateError.tokenBidAmt = 'Insufficient balance, Check your wallet balance';
          }
      
          // //('ValidateError', ValidateError);
      
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
        if (!window.ethereum) {
          toast.warning("OOPS!..connect Your Wallet", toasterOption);
          return false;
        }
        var web3 = new Web3(window.ethereum);
        var currAddr = window.web3.eth.defaultAccount;
        if (!currAddr) {
          toast.warning("OOPS!..connect Your Wallet", toasterOption);
        }
        Set_BidApply_ApproveCallStatus('processing');
        var CoursetroContract = new web3.eth.Contract(DETH_ABI, config.tokenAddr[config.tokenSymbol]);
        var YouWillPayWei = (YouWillPay * config.decimalvalues).toString();
        CoursetroContract
        .methods
        .approve(
          exchangeAddress,
          YouWillPayWei
        )
        .send({from: Accounts})
        .then(async (result) => {
          toast.success("Approve Successfully", toasterOption);
          var BidData = {
            tokenCounts: item.tokenCounts,
            tokenBidAddress: UserAccountAddr,
            tokenBidAmt: tokenBidAmt,
            NoOfToken: item.type == 721 ? 1 : NoOfToken
          }
          var Resp = await BidApply_ApproveAction(BidData);
          if(Resp.data && Resp.data.type && Resp.data.type == 'success') {
            Set_BidApply_ApproveCallStatus('done');
          }
          else {
            toast.error("Approve failed", toasterOption);
            Set_BidApply_ApproveCallStatus('tryagain');
          }
        })
        .catch((error) => {
          toast.error("Approve failed", toasterOption);
          Set_BidApply_ApproveCallStatus('tryagain');
        })
    }
    async function BidApply_SignCall() {
        if (!window.ethereum) {
          toast.warning("OOPS!..connect Your Wallet", toasterOption);
          return;
        }
        var web3 = new Web3(window.ethereum);
        var currAddr = window.web3.eth.defaultAccount;
        if (!currAddr) {
          toast.warning("OOPS!..connect Your Wallet", toasterOption);
          return;
        }
    
        Set_BidApply_SignCallStatus('processing');
    
        web3.eth.personal.sign("Bidding a Art", currAddr, "Bid Placed")
        .then(async (result) => {
          toast.success("Bid sign successfully", toasterOption);
          Set_BidApply_SignCallStatus('done');
          setTimeout(() => window.$('#proceed_bid_modal').modal('hide'), 600);
          setTimeout(() => window.location.reload(), 1200);
        })
        .catch(() => {
          toast.error("Sign failed", toasterOption);
          Set_BidApply_SignCallStatus('tryagain');
        })
    }

    async function CancelBid_Proceed(curBid_val) {
      var payload = {
        tokenCounts: curBid_val.tokenCounts,
        tokenBidAddress: curBid_val.tokenBidAddress
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
        var curAddr = await getCurAddr();
        // var payload = {
        //   curAddr:curAddr,
        //   tokenCounts:tokenidval
        // };
        // TokenCounts_Get_Detail_Call(payload);
    
        if (window.ethereum) {
          var web3 = new Web3(window.ethereum);
          var CoursetroContract = new web3.eth.Contract(EXCHANGE_ABI, config.exchangeAddress);
          var passAmt = parseFloat(YouWillPayFee) + parseFloat(YouWillGet);
          passAmt = passAmt.toFixed(config.toFixed)
          passAmt = (passAmt * config.decimalvalues).toString();

          if(NoOfToken_NeedToSend) {
            CoursetroContract
            .methods
            .acceptBId(
              config.tokenAddr[config.tokenSymbol],
              AccepBidSelect.tokenBidAddress,
              passAmt,
              item.tokenCounts,
              item.contractAddress,
              item.type,
              NoOfToken_NeedToSend
            )
            .send({from:Accounts})
            .then(async (result) => {
              // //('result', result);
              var acceptBId_Payload = {
                tokenCounts: item.tokenCounts,
                NoOfToken : NoOfToken_NeedToSend, //AccepBidSelect.NoOfToken,
                tokenBidAddress: AccepBidSelect.tokenBidAddress,
                UserAccountAddr_byaccepter: curAddr,
                transactionHash: result.transactionHash
              }
              var Resp = await acceptBId_Action(acceptBId_Payload);
              setTimeout(() => window.$('.modal').modal('hide'), 600);
              window.location.reload();
            })
            .catch((err) => {
              //('err', err)
            })
          }
        }
    }

    useImperativeHandle(
      ref,
      () => ({
        async PlaceABid_Click() {
          Set_BidformSubmit(false);
          if(Bids && Bids.myBid && Bids.myBid.tokenBidAmt) {
            Set_tokenBidAmt(Bids.myBid.tokenBidAmt);
            Set_NoOfToken(Bids.myBid.NoOfToken);
          }
        },
        async PriceCalculate(data={}) {
          PriceCalculate_this(data);
        },
        async AcceptBid_Select(curBid_val) {
          if(curBid_val && curBid_val.tokenBidAmt) {
            Set_AccepBidSelect(curBid_val);

            if(MyTokenBalance < curBid_val.pending) {
              Set_NoOfToken_NeedToSend(MyTokenBalance);
              var totalAmt = MyTokenBalance * curBid_val.tokenBidAmt;
            }
            else {
              Set_NoOfToken_NeedToSend(curBid_val.pending);
              var totalAmt = curBid_val.pending * curBid_val.tokenBidAmt;
            }
            var ServiceFee_val = (totalAmt * config.fee) / 100;
            var YouWillGet_Val = totalAmt - ServiceFee_val;
            Set_YouWillPayFee(ServiceFee_val.toFixed(config.toFixed));
            Set_YouWillGet(YouWillGet_Val.toFixed(config.toFixed));
          }
        },
        async CancelBid_Select(curBid_val) {
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
          }
          else {
            window.$('.modal').modal('hide')
          }
        }
      }),
    )

    useEffect(() => {
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
                <p className="place_bit_desc_2"><span className="text_red mr-2">
                  {item.tokenName}</span>by<span className="text_red ml-2">NFTbuyer</span></p>
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
                          // value={tokenBidAmt}
                      />
                      <div class="input-group-append">
                        <span class="input-group-text" id="basic-addon2">ETH</span>
                      </div>
                    </div>
                    {ValidateError.tokenBidAmt && <span className="text-danger">{ValidateError.tokenBidAmt}</span>}
                    {item.type == config.multipleType && <label for="qty">Enter quantity <span className="label_muted pl-2">({AllowedQuantity} available)</span></label> }
                    {item.type == config.multipleType && <div class="mb-3 input_grp_style_1">
                    <input
                        type="text"
                        name="NoOfToken"
                        id="NoOfToken"
                        class="form-control"
                        placeholder="1"
                        onChange={inputChange}
                        // value={NoOfToken}
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
                        <p className="buy_desc_sm_bold">{TokenBalance} {config.tokenSymbol}</p>
                    </div>
                    </div>
                    <div className="row pb-3">
                    <div className="col-12 col-sm-6">
                        <p className="buy_desc_sm">Service fee</p>
                    </div>
                    <div className="col-12 col-sm-6 text-sm-right">
                        <p className="buy_desc_sm_bold">{Service_Fee}% <span>{config.currencySymbol}</span></p>
                    </div>
                    </div>
                    <div className="row pb-3">
                    <div className="col-12 col-sm-6">
                        <p className="buy_desc_sm">You will pay</p>
                    </div>
                    <div className="col-12 col-sm-6 text-sm-right">
                        <p className="buy_desc_sm_bold">{YouWillPay}</p>
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
                    <ReactPlayer  playing={true}  url={item.ipfsimage!=""? `${config.IPFS_IMG}/${item.ipfsimage}`:`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`}
                    loop={true}
                    controls={true}
                    muted={true}
                    playsinline={true}/> 
                  
                    // <video src={`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} type="video/mp4" alt="Collections" className="img-fluid" autoPlay controls playsInline loop />
                    :
                    <img src={item.ipfsimage!=""? `${config.IPFS_IMG}/${item.ipfsimage}`:`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} alt="Collections" className="img-fluid " />
                    }
                </div>
                <p className="text-center accept_desc word_break_txt">
                    <span className="buy_desc_sm">You are about to accept bid for</span>
                    <span className="buy_desc_sm_bold pl-2">{item.tokenName}</span>
                    <span className="buy_desc_sm pl-2">from</span>
                    <span className="buy_desc_sm_bold pl-2">{AccepBidSelect.tokenBidAddress}</span>
                </p>
                <p className="info_title text-center">{AccepBidSelect.tokenBidAmt} {config.tokenSymbol} for 1 edition(s)</p>
                <div className="row mx-0 pb-3">
                    <div className="col-12 col-sm-6 px-4">
                    <p className="buy_desc_sm">Service fee in %</p>
                    </div>
                    <div className="col-12 col-sm-6 px-4 text-sm-right">
                    <p className="buy_desc_sm_bold">{Service_Fee}%</p>
                    </div>
                </div>
                <div className="row mx-0 pb-3">
                    <div className="col-12 col-sm-6 px-4">
                    <p className="buy_desc_sm">Service fee in {config.currencySymbol}</p>
                    </div>
                    <div className="col-12 col-sm-6 px-4 text-sm-right">
                    <p className="buy_desc_sm_bold">{YouWillPayFee}</p>
                    </div>
                </div>
                <div className="row mx-0 pb-3">
                    <div className="col-12 col-sm-6 px-4">
                    <p className="buy_desc_sm">You will get</p>
                    </div>
                    <div className="col-12 col-sm-6 px-4 text-sm-right">
                    <p className="buy_desc_sm_bold">{YouWillGet} {config.currencySymbol}</p>
                    </div>
                </div>
                <form className="px-4">
                    <div className="text-center">
                    <Button className="primary_btn btn-block" onClick={() => AcceptBid_Proceed()}>Accept bid</Button>
                    <Button className="cancel_btn btn-block" data-dismiss="modal" aria-label="Close">Cancel</Button>
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
                    <ReactPlayer  playing={true}  url={item.ipfsimage!=""? `${config.IPFS_IMG}/${item.ipfsimage}`:`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`}
                    loop={true}
                    controls={true}
                    muted={true}
                    playsinline={true}/> 
                    // <video src={`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} type="video/mp4" alt="Collections" className="img-fluid" autoPlay controls playsInline loop />
                    :
                    <img src={item.ipfsimage!=""? `${config.IPFS_IMG}/${item.ipfsimage}`:`${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} alt="Collections" className="img-fluid " />
                    }
                </div>
                <p className="text-center accept_desc word_break_txt">
                    <span className="buy_desc_sm">You are about to cancel bid for</span>
                    <span className="buy_desc_sm_bold pl-2">{item.tokenName}</span>
                </p>
                <p className="info_title text-center">{AccepBidSelect.tokenBidAmt} {config.tokenSymbol} for 1 edition(s)</p>
                <form className="px-4">
                    <div className="text-center">
                    <Button className="primary_btn btn-block" onClick={() => CancelBid_Proceed()}>Cancel bid</Button>
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

