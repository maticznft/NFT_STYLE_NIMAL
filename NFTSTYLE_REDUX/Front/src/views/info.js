import React, {
  useEffect,
  useRef,
  useState
} from "react";
// @material-ui/core component
import { makeStyles } from "@material-ui/core/styles";
import { Button } from '@material-ui/core';
// core components
import Header from "components/Header/Header.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import { Link, useParams, useLocation, useHistory } from "react-router-dom";
import { Scrollbars } from 'react-custom-scrollbars';
import Countdown from "react-countdown";
import ReactPlayer from "react-player";
import CopyToClipboard from 'react-copy-to-clipboard';
// myside
import Web3 from 'web3';
import config from '../lib/config';
import isEmpty from "../lib/isEmpty";
import moment from 'moment';
import Loader from './Loader'
import {
  getCurAddr
} from '../actions/v1/user';
import {
  reportFunc
} from '../actions/v1/report';

import {
  TokenCounts_Get_Detail_Action,
  BidApply_ApproveAction,
  acceptBId_Action,
  convertion,
  BurnField,
  convertionValue2
} from '../actions/v1/token';
import ConnectWallet from './separate/Connect-Wallet';
import { WalletRef } from './separate/WalletRef';
import { PlaceAndAcceptBidRef } from './separate/PlaceAndAcceptBidRef';
import { PurchaseNowRef } from "./separate/PurchaseNowRef";
import { PutOnSaleRef } from './separate/PutOnSaleRef';
import { LikeRef } from './separate/LikeRef';
import { CancelOrderRef } from './separate/CancelOrderRef';
import { BurnRef } from "./separate/BurnRef";
import { ReportNowRef } from "./separate/ReportNowRef";
import { TransferRef } from "./separate/TransferRef";
import { ShareNowRef } from "./separate/ShareNowRef";
import EXCHANGE from '../ABI/EXCHANGE.json'
import Multiple from '../ABI/userContract1155.json'
import Single from '../ABI/userContract721.json'
import DETH_ABI from '../ABI/DETH_ABI.json'
import { FacebookShareButton, TwitterShareButton, TelegramShareButton, WhatsappShareButton } from 'react-share'
import ReactMarkdown from 'react-markdown'
import { toast } from 'react-toastify';
import Avatars from "./Avatar";
import { useSelector } from 'react-redux';
toast.configure();
let toasterOption = config.toasterOption;

const dashboardRoutes = [];
const multipleAddress = config.multiple;
const singleAddress = config.single;

const useStyles = makeStyles(styles);
const renderer = ({ days, Month, Year, hours, minutes, seconds, completed }) => {
  if (completed) {
    return <span>0d  0h 0m 0s left</span>
  } else {
    // Render a countdown
    return <span>{days}d  {hours}h {minutes}m {seconds}s left</span>;
  }
};
// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}



export default function Info(props) {
  const classes = useStyles();
  const history = useHistory();
  const { ...rest } = props;
  function hideDetail() {
    document.getElementById("image_div").classList.toggle('expand_img');
    document.getElementById("img_des").classList.toggle('show_des');
    document.getElementById("detai_div").classList.toggle('hide_detail');
    document.getElementById("arrow_icon").classList.toggle('fa-shrink');

  }

  function hideDetailowner() {
    document.getElementById("image_div_owner").classList.toggle('expand_img');
    document.getElementById("img_des_owner").classList.toggle('show_des');
    document.getElementById("detai_div_owner").classList.toggle('hide_detail');
    document.getElementById("arrow_icon_owner").classList.toggle('fa-shrink');
  }
  const Wallet_Details = useSelector(state => state.wallet_connect_context);
  const LikeForwardRef = useRef();
  const PlaceABidForwardRef = useRef();
  const PutOnSaleForwardRef = useRef();
  const PurchaseNowForwardRef = useRef();
  const CancelOrderForwardRef = useRef();
  const WalletForwardRef = useRef();
  var BurnForwardRef = useRef();
  var ReportForwardRef = useRef();
  var ShareForwardRef = useRef();
  const TransferForwardRef = useRef();

  const location = useLocation();

  const [locationname, Setlocationname] = useState(location.pathname)
  async function BidApply_ApproveCall() {
    PlaceABidForwardRef.current.BidApply_ApproveCall();
  }
  async function BidApply_SignCall() {
    PlaceABidForwardRef.current.BidApply_ApproveCall();
  }
  var { tokenidval } = useParams();
  // wallet related : common state
  const [WalletConnected, Set_WalletConnected] = React.useState('false');
  const [UserAccountAddr, Set_UserAccountAddr] = React.useState(Wallet_Details.UserAccountAddr);

  const [tokenValues, settokenValues] = React.useState("");

  const [UserAccountBal, Set_UserAccountBal] = React.useState(Wallet_Details.UserAccountBal);
  const [AddressUserDetails, Set_AddressUserDetails] = useState({});
  const [Accounts, Set_Accounts] = React.useState(Wallet_Details.Accounts);
  const [MyItemAccountAddr, Set_MyItemAccountAddr] = React.useState('');
  const [tokenCounts, Set_tokenCounts] = useState(tokenidval);
  const [item, Set_item] = useState({});
  const [tokenCounts_Detail, Set_tokenCounts_Detail] = useState({});

  const [MyTokenBalance, Set_MyTokenBalance] = useState(0);
  const [MyTokenDetail, Set_MyTokenDetail] = useState(0);
  const [noofitems, setnoofitem] = useState();
  const [Bids, Set_Bids] = useState({});

  const [AccepBidSelect, Set_AccepBidSelect] = useState(0);

  const [tokenBidAmt, Set_tokenBidAmt] = useState(0);
  const [NoOfToken, Set_NoOfToken] = useState(1);

  const [ValidateError, Set_ValidateError] = useState({});

  const [TokenBalance, Set_TokenBalance] = useState(0);

  const [YouWillPay, Set_YouWillPay] = useState(0);
  const [YouWillPayFee, Set_YouWillPayFee] = useState(0);
  const [YouWillGet, Set_YouWillGet] = useState(0);
  const [LikedTokenList, setLikedTokenList] = React.useState([]);
  // const [MultipleWei, Set_MultipleWei] = useState(0);

  const [BidApply_ApproveCallStatus, Set_BidApply_ApproveCallStatus] = React.useState('init');
  const [BidApply_SignCallStatus, Set_BidApply_SignCallStatus] = React.useState('init');
  const [HitItem, Set_HitItem] = useState({});

  const [BuyOwnerDetail, Set_BuyOwnerDetail] = useState({});
  const [BuyOwnerDetailFirst, Set_BuyOwnerDetailFirst] = useState({});
  const [convertVal, setConvertVal] = React.useState(0);
  const [OwnersDetailFirst, Set_OwnersDetailFirst] = useState({});


  const [showingLoader, setshowingLoader] = React.useState(false);
  const [reports, setreports] = React.useState("");
  const [reportSubmit, setreportSubmit] = React.useState(false);
  const [burnLoading, setBurnLoading] = useState('empty');
  const [Service_Fee, set_Service_Fee] = useState(0);
  const [Wen_Bln, set_Wen_Bln] = useState(0);
  const [providerss, set_providers] = useState(null)
  const [MyItemAccountAddr_Details, Set_MyItemAccountAddr_Details] = useState({})
  const [swap_fee, set_swap_fee] = useState(0);
  const [AllowedQuantity, Set_AllowedQuantity] = useState(0);
  const [Zero_Price_Detail, Set_Zero_Price_Detail] = useState([])
  const [onwer_price, set_onwer_price] = useState({})
  const [tokenUsers, setTokenUsers] = useState({})
  const [copied, setcopied] = useState(false)
  const [token_owner_detail_first, set_token_owner_detail_first] = useState({})
  const [unlocked, setunlocked] = useState(false)
  const [nftStyle, setnftStyle] = useState('')

  useEffect(() => {
    //console.log('Info')
    (async () => {

      var curAddr = Wallet_Details.UserAccountAddr;
      var payload = {
        curAddr: curAddr,
        tokenCounts: tokenidval
      };
      TokenCounts_Get_Detail_Call(payload);
      LikeForwardRef.current.getLikesData()
      nftstyle()
    })();

  }, [Wallet_Details.UserAccountAddr])

  const AfterWalletConnected = async () => {
    // Set_TokenBalance(Wen_Bln);
  }


  const TokenCounts_Get_Detail_Call = async (payload) => {

    var curAddr = Wallet_Details.UserAccountAddr;
    //console.log("wewieuiwueiwuewi",curAddr)
    setshowingLoader(true)
    var Resp = await TokenCounts_Get_Detail_Action(payload);
    setTimeout(() => {
      // setshowingLoader(true)
      // change
      setshowingLoader(false)
    }, 2000);

    if (Resp && Resp && Resp.data && Resp.data.Detail && Resp.data.Detail.Resp) {
      //console.log("respininfopage",Resp)
      var TokenResp = Resp.data.Detail.Resp;
      var sum = 0;
      (TokenResp.Token[0].tokenowners_current).map((item) => {
        sum += item.balance
        Set_AllowedQuantity(sum)

      })
      ////////
      if (
        TokenResp
        && TokenResp.Token
        && TokenResp.Token[0]
        && TokenResp.Token[0].tokenowners_current
      ) {
        for (let i = 0; i < (TokenResp.Token[0].tokenowners_current).length; i++) {
          const element = TokenResp.Token[0].tokenowners_current[i];
          set_onwer_price(element)

          //////////console...log("uywtquyetwqtewq ", element.balance)
          //  Set_AllowedQuantity(element.balance)

          if (element.tokenPrice > 0 && element.tokenOwner != curAddr) {
            Set_BuyOwnerDetailFirst(element);

            break;
          }
          if (element.tokenOwner != curAddr) {
            Set_Zero_Price_Detail(element);

            break;
          }
          if (element.tokenPrice > 0 && element.tokenOwner == curAddr) {
            Set_OwnersDetailFirst(element);

            break;
          }
        }
      }
      Set_tokenCounts_Detail(TokenResp);
      //  //console.log("slasjakljkasjdsajdasdlasj",TokenResp)
      if (TokenResp.Bids) {
        ////console.log("Biding details"+JSON.stringify(TokenResp.Bids))
        Set_Bids(TokenResp.Bids);
      }

      var IndexVal = -1;
      var tokenOwnInf = {};
      if (TokenResp.Token[0] && TokenResp.Token[0].tokenowners_all && curAddr) {
        var tokenowners_all = TokenResp.Token[0].tokenowners_all;
        IndexVal = tokenowners_all.findIndex(val => (val.tokenOwner.toString() == curAddr.toString() && val.balance > 0));
      }

      // //////////console...log("check all val")

      if (IndexVal > -1) {
        // //////////console...log("check all val1",tokenowners_all)

        Set_MyTokenBalance(tokenowners_all[IndexVal].balance);
        Set_MyTokenDetail(tokenowners_all[IndexVal])
        var addrs = TokenResp.Token[0].tokenOwnerInfo.curraddress[IndexVal]
        tokenOwnInf.curraddress = addrs;
        tokenOwnInf.name = TokenResp.Token[0].tokenOwnerInfo.name[IndexVal]
        set_token_owner_detail_first(tokenOwnInf)
      }
      else {
        Set_MyTokenDetail({});
        Set_MyTokenBalance(0);
      }

      if (TokenResp.Token && TokenResp.Token[0]) {
        Set_item(TokenResp.Token[0]);
        setTokenUsers(TokenResp.Tusers);
        // //////////console...log("tokenvaluesss",TokenResp.Token[0])
      }

    }
  }
  async function GetUserBal() {
    await WalletForwardRef.current.GetUserBal();
  }
  const showingloader_true = async () => {
    // alert('jhvhj')
    // setshowingLoader(true)
  }
  const showingloader_false = async () => {
    // setshowingLoader(false)
  }
  const copyText = () => {
    toast.success("Unlockable content Copies", toasterOption);
    setcopied(true)

  }
  var renderer = ({ days, Month, Year, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span>Waiting for Owner To Accept</span>
    } else {
      return <span>{days}d  {hours}h {minutes}m {seconds}s left</span>;
    }
  };

  const Priceset = () =>{
    return (
    <div className="col-12 col-lg-6 rght_brdr_info mt-3 mt-lg-0">
    {isNaN(onwer_price.tokenPrice) == false &&
      <p className="mb-0 text-lg-right info_card_last_txt">
        {onwer_price
          && onwer_price.tokenPrice
          && 
          <p className="mb-0 info_card_last_txt">{onwer_price.tokenPrice} {onwer_price.CoinName}</p>}
        $ {(onwer_price
          && onwer_price.tokenPrice
          && (onwer_price.tokenPrice > 0) ? toFixedNumber((Number((onwer_price.tokenPrice * Number((onwer_price.CoinName != "BNB")? nftStyle :convertVal)))),onwer_price.tokenPrice,nftStyle) : toFixedNumber((Number((onwer_price.tokenPrice / Number((onwer_price.CoinName != "BNB")? nftStyle :convertVal))))))}</p>
    } </div>
    )
  }

  const toFixedNumber = (x,l,m)=> {
    //console.log("l,mmmmmm",l,m,x)
    if (Math.abs(x) < 1.0) {
        var e = parseInt(x.toString().split('e-')[1]);
        if (e) {
            x *= Math.pow(10, e - 1);
            x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
        }
    } else {
        var e = parseInt(x.toString().split('+')[1]);
        if (e > 20) {
            e -= 20;
            x /= Math.pow(10, e);
            x += (new Array(e + 1)).join('0');
        }
    }
      // console.log("hhdfebfuibuifb2222",q.length)
      var j;
      var q = String(x)
      if(Number(q) < 0.0001)
      {
      for (var i = 0; i <= q.length; i++){
        if((q.charAt(i) !== '.') && (q.charAt(i) !== '0'))
        {
          j = q.slice(0,i+3)
          i = q.length
        }
      }
    }
    else{
      j = q
    }
    return j;
}



  useEffect(() => {
    Priceset()
  },[nftStyle])

  const nftstyle = async()=>{
    var convertion = await convertionValue2();
    if(convertion && convertion.data && convertion.data.data && convertion.data.data.price){
      //console.log("jenwfwwjfnfniowjmf,",convertion.data.data.price)
      setnftStyle(convertion.data.data.price)           
    }
    else{
      setnftStyle(0)                      
    }
  }



  const test = (a) => {
    // var temp = 0;
    // a.tokenOwnerInfo.curraddress.filter(list => String(list) == String(UserAccountAddr)).map(() => {
    //   temp = 1;
    // })
    // if(temp == 1)
    // {
    //   setunlocked(a.unlockcontent)
    // }
    // else{
    //   setunlocked('Your Not a Owner')
    //   toast.warning("Buy To UNLOCK",toasterOption)
    // }

  }

  // //("test all",MyTokenDetail)
  return (
    <div className="home_header footer_mar_0">
      {/* <ConnectWallet
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
      /> */}

      <PutOnSaleRef
        ref={PutOnSaleForwardRef}
        Set_HitItem={Set_HitItem}
        item={HitItem}
        Service_Fee={Wallet_Details.Service_Fee}
        set_Service_Fee={set_Service_Fee}
        UserAccountAddr={Wallet_Details.UserAccountAddr}
        UserAccountBal={Wallet_Details.UserAccountBal}
        Accounts={Accounts}
        GetUserBal={GetUserBal}
        againCall={TokenCounts_Get_Detail_Call}
        showingloadertrue={showingloader_true}
        showingloaderfalse={showingloader_false}
        setConvertVal={setConvertVal}
        convertVal={convertVal}
        set_providers={set_providers}
        providerss={providerss}
        tokenValues={tokenValues}
        settokenValues={settokenValues}
      />
      <BurnRef
        ref={BurnForwardRef}
        Set_HitItem={Set_HitItem}
        item={HitItem}
        Service_Fee={Wallet_Details.Service_Fee}
        set_Service_Fee={set_Service_Fee}
        UserAccountAddr={Wallet_Details.UserAccountAddr}
        UserAccountBal={Wallet_Details.UserAccountBal}
        Accounts={Accounts}
        GetUserBal={GetUserBal}
        againCall={TokenCounts_Get_Detail_Call}
        showingloadertrue={showingloader_true}
        showingloaderfalse={showingloader_false}
        setConvertVal={setConvertVal}
        convertVal={convertVal}
        set_providers={set_providers}
        providerss={providerss}
        tokenValues={tokenValues}
        settokenValues={settokenValues}
      />
      <LikeRef

        UserAccountAddr={Wallet_Details.UserAccountAddr}
        ref={LikeForwardRef}
        WalletConnected={WalletConnected}
        set_providers={set_providers}
        providerss={providerss}
        setLikedTokenList={setLikedTokenList}
        MyItemAccountAddr={MyItemAccountAddr}
        tokenValues={tokenValues}
        settokenValues={settokenValues}
      />
      <PlaceAndAcceptBidRef
        ref={PlaceABidForwardRef}
        Set_WalletConnected={Set_WalletConnected}
        Set_UserAccountAddr={Set_UserAccountAddr}
        Set_UserAccountBal={Set_UserAccountBal}
        Set_AddressUserDetails={Set_AddressUserDetails}
        Set_Accounts={Set_Accounts}
        Set_MyItemAccountAddr={Set_MyItemAccountAddr}
        Set_tokenCounts={Set_tokenCounts}
        Set_item={Set_item}
        Set_tokenCounts_Detail={Set_tokenCounts_Detail}
        Set_MyTokenBalance={Set_MyTokenBalance}
        Set_Bids={Set_Bids}
        Set_AccepBidSelect={Set_AccepBidSelect}
        Set_tokenBidAmt={Set_tokenBidAmt}
        Set_NoOfToken={Set_NoOfToken}
        Set_ValidateError={Set_ValidateError}
        Set_TokenBalance={Set_TokenBalance}
        Set_YouWillPay={Set_YouWillPay}
        Set_YouWillPayFee={Set_YouWillPayFee}
        Set_YouWillGet={Set_YouWillGet}
        Set_BidApply_ApproveCallStatus={Set_BidApply_ApproveCallStatus}
        Set_BidApply_SignCallStatus={Set_BidApply_SignCallStatus}
        tokenValues={tokenValues}
        settokenValues={settokenValues}
        WalletConnected={WalletConnected}
        UserAccountAddr={Wallet_Details.UserAccountAddr}
        UserAccountBal={Wallet_Details.UserAccountBal}
        AddressUserDetails={AddressUserDetails}
        Accounts={Accounts}
        MyItemAccountAddr={MyItemAccountAddr}
        tokenCounts={tokenCounts}
        item={item}
        tokenCounts_Detail={tokenCounts_Detail}
        MyTokenBalance={MyTokenBalance}
        Bids={Bids}
        AccepBidSelect={AccepBidSelect}
        tokenBidAmt={tokenBidAmt}
        NoOfToken={NoOfToken}
        ValidateError={ValidateError}
        TokenBalance={TokenBalance}
        YouWillPay={YouWillPay}
        YouWillPayFee={YouWillPayFee}
        YouWillGet={YouWillGet}
        BidApply_ApproveCallStatus={BidApply_ApproveCallStatus}
        BidApply_SignCallStatus={BidApply_SignCallStatus}
        AllowedQuantity={AllowedQuantity}
        Service_Fee={Wallet_Details.Service_Fee}
        set_Service_Fee={set_Service_Fee}
        set_Wen_Bln={set_Wen_Bln}
        Wen_Bln={Wen_Bln}
        MyItemAccountAddr_Details={MyItemAccountAddr_Details}
        againCall={TokenCounts_Get_Detail_Call}
        showingloadertrue={showingloader_true}
        showingloaderfalse={showingloader_false}
        setConvertVal={setConvertVal}
        convertVal={convertVal}
        set_providers={set_providers}
        providerss={providerss}
      />
      <WalletRef
        ref={WalletForwardRef}
        Set_UserAccountAddr={Set_UserAccountAddr}
        Set_WalletConnected={Set_WalletConnected}
        Set_UserAccountBal={Set_UserAccountBal}
        tokenValues={tokenValues}
        settokenValues={settokenValues}
      />

      <PurchaseNowRef
        ref={PurchaseNowForwardRef}
        Set_HitItem={Set_HitItem}
        item={HitItem}
        UserAccountAddr={Wallet_Details.UserAccountAddr}
        UserAccountBal={Wallet_Details.UserAccountBal}
        Accounts={Accounts}
        GetUserBal={GetUserBal}
        Service_Fee={Wallet_Details.Service_Fee}
        set_Service_Fee={set_Service_Fee}
        set_Wen_Bln={set_Wen_Bln}
        Wen_Bln={Wen_Bln}
        MyItemAccountAddr_Details={MyItemAccountAddr_Details}
        againCall={TokenCounts_Get_Detail_Call}
        showingloadertrue={showingloader_true}
        showingloaderfalse={showingloader_false}
        setConvertVal={setConvertVal}
        convertVal={convertVal}
        set_providers={set_providers}
        providerss={providerss}
        tokenValues={tokenValues}
        settokenValues={settokenValues}
      />
      <CancelOrderRef
        ref={CancelOrderForwardRef}
        Set_HitItem={Set_HitItem}
        item={HitItem}
        WalletConnected={WalletConnected}

        UserAccountAddr={Wallet_Details.UserAccountAddr}
        UserAccountBal={Wallet_Details.UserAccountBal}
        Accounts={Accounts}
        GetUserBal={GetUserBal}
        againCall={TokenCounts_Get_Detail_Call}
        showingloadertrue={showingloader_true}
        showingloaderfalse={showingloader_false}
        setConvertVal={setConvertVal}
        convertVal={convertVal}
        set_providers={set_providers}
        providerss={providerss}
        tokenValues={tokenValues}
        settokenValues={settokenValues}
      />
      <ReportNowRef
        UserAccountAddr={Wallet_Details.UserAccountAddr}
        ref={ReportForwardRef}
        tokenValues={tokenValues}
        settokenValues={settokenValues}
      />
      <ShareNowRef
        ref={ShareForwardRef}
      />
      <TransferRef
        ref={TransferForwardRef}
        Set_HitItem={Set_HitItem}
        item={HitItem}
        UserAccountAddr={Wallet_Details.UserAccountAddr}
        UserAccountBal={Wallet_Details.UserAccountBal}
        Accounts={Accounts}
        GetUserBal={GetUserBal}
        swap_fee={swap_fee}
        set_swap_fee={set_swap_fee}
        againCall={TokenCounts_Get_Detail_Call}
        showingloadertrue={showingloader_true}
        showingloaderfalse={showingloader_false}
        set_providers={set_providers}
        providerss={providerss}
        tokenValues={tokenValues}
        settokenValues={settokenValues}
      />

      {showingLoader == true ?

        <Loader />
        : <>
          <div className="inner_page_bg">
            <Header
              color="transparent"
              routes={dashboardRoutes}
              brand={<Link to="/"><img src={require("../assets/images/logo.png")} alt="logo" className="img-fluid" /></Link>}
              leftLinks={<HeaderLinks />}
              fixed
              changeColorOnScroll={{
                height: 20,
                color: "white"
              }}
              {...rest}
            />
            <ScrollToTopOnMount />
            <div className={classes.pageHeader + " inner_pageheader info_header"}>
              {/* info row */}
              <div className="row info_row mx-0 buyer_div">
                <div className="col-12 col-md-7 col-lg-8" id="image_div">

                  <div className="flex_center py-5">
                    <div className="float-right arrow_expand" onClick={hideDetail}>
                      <i class="fas fa-arrows-alt" aria-hidden="true" id="arrow_icon"></i>
                    </div>
                    <div className="clearfix"></div>
                    {
                      item && item.image && item.image.split('.').pop() == 'mp4' ?
                        <ReactPlayer playing={true} url={item.image === "" ? `${config.IPFS_IMG}/${item.ipfsimage}` : `${config.Back_URL}/compressedImage/${item.tokenCreator}/${item.image}`}
                          loop={true}
                          controls={true}
                          muted={true}
                          playsinline={true} />
                        // <video src={`${config.IPFS_IMG}/${item.ipfsimage}`} type="video/mp4" alt="Collections" className="img-fluid img_info" autoPlay controls playsInline loop />
                        :
                        <img src={item.image === "" ? `${config.IPFS_IMG}/${item.ipfsimage}` : `${config.Back_URL}/compressedImage/${item.tokenCreator}/${item.image}`} alt="Collections" className="img-fluid img_info" />
                    }
                    {/* <img src={require("../assets/images/img_info.png")} alt="Collections" className="img-fluid img_info_rad" /> */}
                    <div className="img_des" id="img_des">
                      <p className="info_title">{item.tokenName}</p>
                      <h3 className="info_h3">by<span className="px-2 txte_break">{isEmpty(item.usersinfo) ? item.tokenOwner : item.usersinfo.name}</span>on<span className="pl-2">NFT</span></h3>

                    </div>
                  </div>

                </div>
                <div className="col-12 col-md-5 col-lg-4 bg_blue px-0" id="detai_div">
                  <div className="">
                    <div className="d-flex justify-content-between align-items-center px-3 d-flex-block">
                      <div>
                        <span className="info_title">{item.tokenName}</span>
                      </div>
                      <div class="masonry_likes">

                        {
                          (LikedTokenList.findIndex(tokenCounts => (tokenCounts.tokenCounts === item.tokenCounts)) > -1)
                            ? (<i className="fas fa-heart mr-2 liked" onClick={() => LikeForwardRef.current.hitLike(item)} style={{ cursor: 'pointer' }}></i>)
                            : (<i className="far fa-heart mr-2" onClick={() => LikeForwardRef.current.hitLike(item)} style={{ cursor: 'pointer' }}></i>)
                        }
                        <span class={item.tokenCounts + '-likecount mr-2' + "badge badge_pink mr-2"}>{item.likecount}</span>

                        {/* <i className="fas fa-ellipsis-h"></i> */}
                        <div class="dropdown d-inline">
                          <button class="btn btn-secondary dropdown-toggle filter_btn badge badge_pink" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fas fa-ellipsis-h"></i>
                          </button>
                          <div class="dropdown-menu filter_menu filter_menu_info dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                            {
                              MyTokenDetail
                              && MyTokenDetail.balance > 0 &&
                              <div className=" menu_itm" data-target="#" onClick={() => BurnForwardRef.current.Burn_Click(item, MyTokenDetail)}>
                                <span>Burn Token</span>
                              </div>
                            }
                            {
                              MyTokenDetail
                              && MyTokenDetail.balance > 0
                              && item
                              && item.clocktime == null
                              && item.endclocktime == null &&
                              <div className=" menu_itm" data-target="#"
                                onClick={() => TransferForwardRef.current.Transfer_Click(item, MyTokenDetail)}>
                                <span>Transfer Token</span>
                              </div>
                            }
                            {
                              MyTokenDetail
                              && MyTokenDetail.balance > 0
                              && MyTokenDetail.tokenPrice == 0
                              && item.clocktime == null
                              && item.endclocktime == null &&

                              <div className=" menu_itm" data-toggle="modal" data-target="#">
                                <span onClick={() => PutOnSaleForwardRef.current.PutOnSale_Click(item, MyTokenDetail)}>Put on sale</span>
                              </div>
                            }
                            {
                              MyTokenDetail
                              && MyTokenDetail.balance > 0
                              && MyTokenDetail.tokenPrice > 0 &&
                              <div>
                                <div className=" menu_itm" data-toggle="modal" data-target="#">
                                  <span onClick={() => PutOnSaleForwardRef.current.PutOnSale_Click(item, MyTokenDetail)}>Lower Price</span>
                                </div>
                                <div className=" menu_itm" data-toggle="modal" data-target="#">
                                  <span onClick={() => CancelOrderForwardRef.current.CancelOrder_Click(item, token_owner_detail_first, MyTokenDetail)}>Cancel Order</span>
                                </div>
                              </div>
                            }
                            <div className=" menu_itm" data-toggle="modal" data-target="#" onClick={() => ShareForwardRef.current.ShareSocial_Click(item, onwer_price)}>
                              <span>Share</span>
                            </div>

                            <div className="menu_itm" onClick={hideDetail}>
                              <span>View Full Screen</span>
                            </div>
                            <div className="menu_itm" data-toggle="modal" data-target="#" onClick={() => ReportForwardRef.current.SubmitReport_Click(item, onwer_price)}  >
                              <span>Report</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                    <h3 className="info_h3 px-3">
                      <span className="pr-2">
                        {
                          item
                            && item.tokenBid == true
                            && item.clocktime == null
                            && item.endclocktime == null
                            ?

                            (onwer_price !== undefined &&
                              (
                                onwer_price.tokenPrice !== undefined
                                  && onwer_price.tokenPrice != null
                                  && onwer_price.tokenPrice != 0 ?
                                  onwer_price.tokenPrice + ' ' + onwer_price.CoinName : 'Not for Sale'

                              ))
                            :
                            item.minimumBid + ' ' + onwer_price.CoinName

                        }

                      </span>
                      <span className="badge bange_grey_outlone">Collectibles </span>
                    </h3>
                    <p className="info_des px-3">{item.tokenDesc}</p>
                    {MyTokenDetail &&
                      MyTokenDetail.tokenOwner
                      &&
                      MyTokenDetail.tokenOwner == Wallet_Details.UserAccountAddr
                      &&
                      item.unlockcontent != '' &&
                      <div class="px-3">
                        <Button class="unlocakable_link px-3" onClick={() => { setunlocked((unlocked) ? false : true) }}>Unlock</Button>
                        {unlocked &&
                          <p className="info_des px-3">
                            <ReactMarkdown children={item.unlockcontent} />
                          </p>
                        }
                        {unlocked &&
                          <CopyToClipboard text={item.unlockcontent} onCopy={() => copyText()}>
                            {copied?
                            <i className="fas fa-clipboard-check notes_fatic mb-1"><span> Copied</span></i>
                            :
                            <i className="fas fa-clipboard notes_fa mb-1"><span> Copy</span></i>
                            }
                        </CopyToClipboard>
                        }
                      </div>
                    }

                    <div className="px-3">
                      <Scrollbars style={{ height: 65 }}>
                        <nav className="nav nav-tabs masonry_tab primary_tab items_tab info_tab_with py-0 w-100 info_tab">
                          <div className="nav nav-tabs masonry_tab" id="nav-tab" role="tablist">
                            <a className="nav-link active" id="info-tab" data-toggle="tab" href="#info" role="tab" aria-controls="info" aria-selected="true">Info</a>
                            <a className="nav-link" id="owners-tab" data-toggle="tab" href="#owners" role="tab" aria-controls="active" aria-selected="false">Owner</a>
                            <a className="nav-link" id="bid-tab" data-toggle="tab" href="#bid" role="tab" aria-controls="bid" aria-selected="false">Bid</a>

                          </div>
                        </nav>
                      </Scrollbars>
                    </div>
                    <div className="tab-content explore_tab_content mt-2 px-3" id="nav-tabContent">
                      <div className="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">
                        <div className="proposal_panel_overall">
                          <Scrollbars style={{ height: 265 }}>
                            <div className="inner_div_info">
                              {
                                Wallet_Details.UserAccountAddr
                                && item
                                && item.tokenowners_current
                                &&
                                <div className="follow_media activity_media info_new_media">
                                  <div className="price_grey_ful">
                                    <div className="media">
                                      <div className="img_tick_div">
                                        {/* <span class="img_tick img_tick_lg"><img src={require("../assets/images/act_right.png")} /></span> */}
                                        {/* <span class="img_tick img_tick_lg"><img src={require("../assets/images/act_right.png")} /></span> */}
                                        <div className="img_prgo_re mr-3">
                                          {item.tokenCreatorInfo.image[0] != '' ?
                                            <a href={`${config.Front_URL}/user/${item.tokenCreatorInfo.curraddress[0]}`} title={`Creator : ${item.tokenCreatorInfo.name[0]}`}>

                                              <img src={`${config.Back_URL}/images/${item.tokenCreatorInfo._id}/${item.tokenCreatorInfo.image[0]}`} alt="Owner" className="img-fluid img_user_new" />
                                            </a>
                                            :
                                            <a href={`${config.Front_URL}/user/${item.tokenCreatorInfo.curraddress[0]}`} title={`Creator : ${item.tokenCreatorInfo.curraddress[0]}`}>

                                              {/* <Avatars item={item.tokenCreatorInfo.curraddress[0]!=""?item.tokenCreatorInfo.curraddress[0]:item.tokenCreator} className="img-fluid img_user_new"></Avatars> */}
                                              <Avatars classValue="img-fluid img_user_new" />
                                            </a>
                                          }
                                        </div>

                                      </div>
                                      {/* <p>dsahdgsajh</p> */}
                                      <div className="media-body flex_body">
                                        <div>
                                          <p className="mt-0 media_num mt-0">Creator</p>
                                          <p className="my-0 media_text word_break_txt word_break_txt_sm" title={item.tokenCreatorInfo.name != "" ? item.tokenCreatorInfo.name : item.tokenCreator}>{item.tokenCreatorInfo.name != "" ? item.tokenCreatorInfo.name : item.tokenCreator}</p>


                                        </div>

                                      </div>
                                    </div>

                                    <div className="ml-2 ml-cus">
                                      <div className="card owner_card my-0">
                                        <div className="card-body p-2">
                                          <div className="flex_txt">
                                            <div className="media_num">{item.tokenRoyality}%</div>
                                            <div className="prce_grey">
                                              <p className="mb-0 price_1">Sales to the Creator</p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>}
                            </div>
                          </Scrollbars>
                        </div>
                      </div>
                      <div className="tab-pane fade" id="owners" role="tabpanel" aria-labelledby="owners-tab">
                        <div className="proposal_panel_overall">
                          <Scrollbars style={{ height: 265 }}>
                            <div className="inner_div_info">
                              {tokenUsers && tokenUsers.length > 0 && tokenUsers.map((itemCur, i) => {
                                return (<div className="follow_media activity_media info_new_media">
                                  <div className="media">
                                    <div className="img_tick_div">

                                      {/* <span class="img_tick img_tick_lg"><img src={require("../assets/images/act_right.png")} /></span> */}
                                      <div className="img_prgo_re mr-3">
                                        {(itemCur && itemCur.tusers.image != '') ?
                                          <a href={itemCur
                                            && itemCur.tusers
                                            && itemCur.tusers.customurl != ""
                                            ? `${config.Front_URL}/${itemCur.tusers.customurl}`
                                            : `${config.Front_URL}/user/${itemCur.tusers.curraddress}`} title={`Owner : ${itemCur.tusers.name}`}>
                                            <img src={`${config.Back_URL}/images/${itemCur.tusers._id}/${itemCur.tusers.image}`} alt="Owner" className="img-fluid img_user_new" />
                                          </a>
                                          :
                                          <a href={`${config.Front_URL}/user/${itemCur.tusers.curraddress}`} title={`Owner : ${itemCur.tusers.curraddress}`}>
                                            {/* <Avatars item={itemCur.tokenOwner} className="img-fluid img_user_new"></Avatars> */}
                                            <Avatars classValue="img-fluid img_user_new" /></a>
                                        }
                                      </div>

                                    </div>
                                    <div className="media-body flex_body">
                                      <div>
                                        <p className="mt-0 media_num mt-0">Owned by</p>
                                        <p className="my-0 media_text ">
                                          {
                                            (itemCur.tusers.name != ''
                                              ? itemCur.tusers.name
                                              :
                                              <span title={itemCur.tokenOwner}>{(itemCur.tokenOwner).slice(0, 8).concat('....')}</span>
                                            )
                                          }
                                        </p>
                                        {
                                          itemCur.tokenPrice > 0
                                          && <p className="mt-0 media_text mb-0">
                                            {itemCur.balance}/{itemCur.quantity} on sale for {itemCur.tokenPrice} {itemCur.CoinName} {itemCur.quantity > 0 && 'each'}</p>}
                                        {itemCur.tokenPrice == 0 && <p className="mt-0 media_text mb-0">{itemCur.balance}/{itemCur.quantity} Not for sale</p>}
                                        {
                                          itemCur.tokenPrice > 0 && itemCur.balance > 0 && itemCur.tokenOwner != Wallet_Details.UserAccountAddr &&
                                          <Button className="connect_btn btn-block mb-2" onClick={() => PurchaseNowForwardRef.current.PurchaseNow_Click(item, itemCur)} >Buy Now</Button>
                                        }
                                      </div>
                                    </div>
                                  </div>

                                </div>

                                )
                              })}

                            </div>
                          </Scrollbars>

                        </div>
                      </div>
                      <div className="tab-pane fade" id="bid" role="tabpanel" aria-labelledby="bid-tab">
                        <div className="proposal_panel_overall">
                          <Scrollbars style={{ height: 265 }}>
                            <div className="inner_div_info">
                              {
                                Bids && Bids.pending && Bids.pending.length > 0 && Bids.pending.map((curBid) => {
                                  return (
                                    <div className="follow_media activity_media info_new_media">
                                      <div className="media">
                                        <div className="img_tick_div">
                                          {/* <span class="img_tick img_tick_lg"><img src={require("../assets/images/act_right.png")} /></span> */}
                                          {curBid.bidUsers && <div className="img_prgo_re mr-3">
                                            <a href={curBid.bidUsers !== undefined && (curBid.bidUsers.customurl != "" ? `${config.Front_URL}/${curBid.bidUsers.customurl}` : `${config.Front_URL}/user/${curBid.tokenBidAddress}`)}>

                                              {
                                                curBid.bidUsers.image != "" && <img src={`${config.Back_URL}/images/${curBid.bidUsers._id}/${curBid.bidUsers.image}`} alt="User" className="img-fluid img_user_new" />

                                              }
                                              {
                                                curBid.bidUsers.image == "" &&
                                                <Avatars classValue="img-fluid img_user_new" />
                                              }
                                            </a>
                                          </div>}

                                        </div>
                                        <div className="media-body flex_body">
                                          <div>
                                            <p className="mt-0 media_num mt-0 ">{curBid.tokenBidAmt} {curBid.CoinName} by   <span title={curBid.bidUsers !== undefined && (curBid.bidUsers.name != "" ? curBid.bidUsers.name : curBid.tokenBidAddress)}>{curBid.bidUsers !== undefined && (curBid.bidUsers.name != "" ? curBid.bidUsers.name : <span className="">{String(curBid.tokenBidAddress).slice(0, 8).concat('....')}</span>)}</span> {AllowedQuantity > 0 && (<span>for {curBid.pending}/{curBid.NoOfToken} edition</span>)}</p>
                                            <p className="my-0 media_text">{moment(curBid.timestamp).format('MMMM Do YYYY, h:mm a')}</p>


                                          </div>
                                          {Wallet_Details.UserAccountAddr
                                            && Wallet_Details.UserAccountAddr != curBid.tokenBidAddress
                                            && item
                                            && item.tokenowners_current
                                            && item.tokenowners_current.findIndex(e => e.tokenOwner == Wallet_Details.UserAccountAddr) > -1
                                            &&
                                            <div className="ml-2 ml-cus">
                                              {
                                                item
                                                  && item.tokenBid == true
                                                  && item.clocktime != null
                                                  && item.endclocktime != null
                                                  && (new Date(item.endclocktime) > new Date(Date.now())) ?
                                                  (<p className="mt-0 media_text_big_1 text-center">You Can't Accept The Bid Until Auction Complete</p>)
                                                  :
                                                  ((Bids.highestBid.tokenBidAddress == curBid.tokenBidAddress) ?
                                                    <Button className="primary_btn mb-2" onClick={() => PlaceABidForwardRef.current.AcceptBid_Select(curBid)}>Accept</Button>
                                                    :
                                                    ((item.type == 1155) ?
                                                      <Button className="primary_btn mb-2" onClick={() => PlaceABidForwardRef.current.AcceptBid_Select(curBid)}>Accept</Button>
                                                      : null))
                                              }
                                            </div>
                                          }
                                          {Wallet_Details.UserAccountAddr
                                            && Wallet_Details.UserAccountAddr == curBid.tokenBidAddress
                                            && item
                                            && item.tokenBid == true
                                            // && item.clocktime == null
                                            // && item.endclocktime == null
                                            &&
                                            <Button className="btn_outline_grey cancel_btn mb-2" onClick={() => PlaceABidForwardRef.current.CancelBid_Select(curBid)}>Cancel</Button>
                                          }


                                        </div>
                                      </div>

                                    </div>

                                  )
                                })}
                            </div>
                          </Scrollbars>

                        </div>
                      </div>
                    </div>
                    {/* <p>{AllowedQuantity},{MyTokenBalance}</p> */}

                    <div className="px-3">

                      <div className="card info_big_card mb-0">
                        <div className="card-body px-0">
                          <div className="row pb-4 pt-2">
                            <div className="col-12 col-lg-6 rght_brdr_info rght_brdr_info_flex_end">
                              {(Bids.highestBid && Bids.highestBid.tokenBidAmt > 0) ?

                                <div className="follow_media activity_media info_new_media pr-0">
                                  <div className="media">
                                    <div className="img_tick_div">
                                      {/* <span class="img_tick img_tick_lg"><img src={require("../assets/images/act_right.png")} /></span> */}
                                      <div className="img_prgo_re mr-3">
                                        {
                                          Bids.highestBid.bidUsers.image != "" && <img src={`${config.Back_URL}/images/${Bids.highestBid.bidUsers._id}/${Bids.highestBid.bidUsers.image}`} alt="User" className="img-fluid img_user_new" />

                                        }
                                        {
                                          Bids.highestBid.bidUsers.image == "" &&
                                          <Avatars classValue="img-fluid img_user_new" />

                                        }
                                      </div>

                                    </div>
                                    <div className="media-body flex_body">
                                      <div>
                                        <p className="mt-0 media_text mt-0 mb-0">Highest Bid {Bids.highestBid.tokenBidAmt}{Bids.highestBid.CoinName} by</p>
                                        <p className={`my-0 media_text`} title={(Bids.highestBid.bidBy && Bids.highestBid.bidBy.name) ? Bids.highestBid.bidBy.name : (Bids.highestBid.tokenBidAddress)}>
                                          {(Bids.highestBid.bidBy && Bids.highestBid.bidBy.name) ? Bids.highestBid.bidBy.name : (Bids.highestBid.tokenBidAddress).slice(0, 8).concat('....')}
                                        </p>



                                      </div>

                                    </div>
                                  </div>

                                </div>
                                :
                                <div className="media">
                                  {/* <div className="badge bnb_badge float-lg-right">Bid not available</div> */}
                                </div>}


                              {/* <Button className="connect_btn btn-block bnt_pos_left" data-toggle="modal" data-target="#accept_modal">Accept</Button> */}
                              {
                                onwer_price
                                && onwer_price.tokenOwner
                                && (onwer_price.tokenPrice == 0 ||
                                  onwer_price.tokenPrice == null)
                                &&

                                ((item
                                  && item.tokenBid == true
                                  && item.clocktime != null
                                  && item.endclocktime != null
                                  && new Date(item.endclocktime) < Date.now()) ?
                                  (!isEmpty(Bids.highestBid) ?
                                    (Bids && !isEmpty(Bids.highestBid) &&
                                    Wallet_Details.UserAccountAddr
                                      && Wallet_Details.UserAccountAddr != Bids.highestBid.tokenBidAddress
                                      && item
                                      && item.tokenowners_current
                                      && item.tokenowners_current.findIndex(e => e.tokenOwner == Wallet_Details.UserAccountAddr) > -1
                                      ?
                                      <Button className="btn_outline_red ml-2 mb-2" onClick={() => PlaceABidForwardRef.current.AcceptBid_Select(item, Bids.highestBid)}>
                                        Accept
                                      </Button>
                                      :
                                      <Button className="btn_outline_red ml-2 mb-2">
                                        Waiting for owner to accept the bid
                                      </Button>)
                                    :
                                    <p className="btn_outline_red ml-2 mb-2">Timed auction ended</p>
                                  )
                                  :
                                  AllowedQuantity > MyTokenBalance ?
                                    Bids
                                      && Bids.myBid
                                      && !Bids.myBid.status
                                      ?
                                      <Button className="connect_btn btn-block bnt_pos_right mt-3 mt-lg-0" onClick={() => PlaceABidForwardRef.current.PlaceABid_Click()}>
                                        Bid now
                                      </Button>
                                      :
                                      Bids
                                      && Bids.myBid
                                      && Bids.myBid.status
                                      && (Bids.myBid.status == 'pending' ?
                                        <Button className="connect_btn btn-block bnt_pos_right mt-3 mt-lg-0" onClick={() => PlaceABidForwardRef.current.PlaceABid_Click()}>
                                          Edit a bid
                                        </Button>
                                        :
                                        Bids
                                        && Bids.myBid
                                        && Bids.myBid.status
                                        && Bids.myBid.status == 'partiallyCompleted'
                                        &&
                                        <Button className="connect_btn btn-block bnt_pos_right mt-3 mt-lg-0" onClick={() => PlaceABidForwardRef.current.CancelBid_Select(Bids.myBid)}>
                                          Cancel a bid
                                        </Button>)
                                    : ''

                                )}


                            </div>
                            <div className="col-12 col-lg-6 mt-3 mt-lg-0">
                              <div className="min_h_div_indo">
                                {BuyOwnerDetailFirst
                                  && BuyOwnerDetailFirst.tokenPrice
                                  && <div className="badge bnb_badge float-lg-right">{BuyOwnerDetailFirst.tokenPrice} {BuyOwnerDetailFirst.CoinName}</div>}

                              </div>
                              {
                                BuyOwnerDetailFirst
                                && BuyOwnerDetailFirst.tokenOwner != Wallet_Details.UserAccountAddr
                                && BuyOwnerDetailFirst.tokenPrice > 0
                                && <Button className="connect_btn btn-block bnt_pos_left mb-2" onClick={() => PurchaseNowForwardRef.current.PurchaseNow_Click(item, BuyOwnerDetailFirst)} >Buy Now</Button>}
                              {
                                MyTokenDetail
                                  && MyTokenDetail.tokenOwner == Wallet_Details.UserAccountAddr
                                  && MyTokenDetail.tokenPrice > 0
                                  ?
                                  <Button className="connect_btn btn-block bnt_pos_left" onClick={() => CancelOrderForwardRef.current.CancelOrder_Click(item, token_owner_detail_first, MyTokenDetail)}>Cancel Order</Button>
                                  :
                                  MyTokenDetail
                                  && MyTokenDetail.tokenOwner
                                  && item
                                  && item.tokenBid == true
                                  && item.clocktime != null
                                  && item.endclocktime != null
                                  &&
                                  ((new Date(item.endclocktime)) > (Date.now())) &&
                                  <Button className="btn-block bnt_pos_right">
                                    Action Not Complete Yet
                                  </Button>}
                              {/* { MyTokenDetail 
                               && MyTokenDetail.tokenOwner
                               && item
                               && item.tokenBid == true
                               && item.clocktime != null
                               && item.endclocktime != null
                               &&
                               ((new Date(item.endclocktime)) < (Date.now())) &&
                              <Button className="connect_btn btn-block bnt_pos_right mt-3 mt-lg-0" onClick={() => PutOnSaleForwardRef.current.PutOnSale_Click(item, MyTokenDetail)}>Place order</Button>
                             } */}
                              {
                                MyTokenDetail
                                && MyTokenDetail.tokenOwner
                                && (MyTokenDetail.tokenPrice == null || MyTokenDetail.tokenPrice == "")
                                && item
                                && item.tokenBid == true
                                && item.clocktime == null
                                && item.endclocktime == null
                                &&
                                <Button className="connect_btn btn-block bnt_pos_right mt-3 mt-lg-0" onClick={() => PutOnSaleForwardRef.current.PutOnSale_Click(item, MyTokenDetail)}>Place order</Button>
                              }


                            </div>
                          </div>
                          {(onwer_price.tokenPrice > 0) &&
                            <div className="bordr_top_bot_info_div">
                              <div className="row">
                                <div className="col-12 col-lg-6">
                                  <p className="mb-0 info_card_last_txt">Service fee {Wallet_Details.Service_Fee / 1e18}%</p>
                                </div>
                               <Priceset/>
                              </div>

                            </div>}

                          <div className="row py-3">
                      {(
                        item
                        && item.clocktime != null
                        && item.endclocktime != null
                        && new Date(item.endclocktime) < Date.now()) ?
                        (
                        
                          <div className="col-12 col-lg-6">
                            <p className="mb-0 info_card_last_txt d-flex align-items-center">
                              <span>
                                <img src={require("../assets/images/fire.png")} alt="Collections" className="img-fluid mr-2" />
                              </span>
                              Auction Completed
                            </p>
                          </div>
                        )
                        :
                          <div className="col-12 col-lg-6 rght_brdr_info mt-3 mt-lg-0">
                         
                            <p className="mb-0 text-lg-right info_card_last_txt_black">
                              {(item && item.clocktime != null && item.endclocktime != null) ?
                                (<Countdown date={new Date(item.endclocktime)}
                                  autoStart={true}
                                  onStart={() => new Date(item.clocktime)}
                                  renderer={renderer}
                                >
                                </Countdown>
                                ) : ('')
                                }
                            </p>
                          </div>
                          }
                    </div>
                        </div>
                      </div>



                    </div>

                  </div>

                </div>
              </div>
              {/* end info row */}



            </div>
          </div>
          <Footer />
        </>}





    </div>


  );
}
