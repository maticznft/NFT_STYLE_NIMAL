import React, { useEffect, useState, useRef } from "react";
// nodejs library that concatenates classes
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
// core components
import Header from "components/Header/Header.js";
import ReactPlayer from "react-player";
import Footer from "components/Footer/Footer.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import { Button } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { Scrollbars } from 'react-custom-scrollbars';
// myside
import axios from 'axios';
import config from '../lib/config';
import isEmpty from "lib/isEmpty";
import {
  getCurAddr
} from '../actions/v1/user';
import {
  CollectiblesList_Home, NewCollectiblesList_Home, topCreatorsApi, ApproveCh
} from '../actions/v1/token';
import { WalletRef } from './separate/WalletRef';
import ReactHtmlParser from 'react-html-parser';
import TokenItem from './separate/Token-Item';
import BidPopup from './separate/Bid-Popup';
import ConnectWallet from './separate/Connect-Wallet';
import LiveAuction from './separate/LiveAuction-card';
import Avatars from "./Avatar";
import { getcmslistinhome, getpromotion } from '../actions/v1/report'
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import TokenCard from "./separate/Token-Item";
import { toast } from 'react-toastify';
toast.configure();
let toasterOption = config.toasterOption;
const dashboardRoutes = [];
const useStyles = makeStyles(styles);
// Scroll to Top
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}
export default function Home(props) {
  const history = useHistory();
  const classes = useStyles();
  const { ...rest } = props;
  function togglecollpase() {
    document.getElementById("collapse_sec").classList.toggle('d-none');
  }
  function toggleFilter() {
    document.getElementById("filter_sec_home").classList.toggle('d-none');

  }
  const [value, setValue] = useState(0);
  const [expanded1, setExpanded1] = React.useState('panel8');
  const [expanded3, setExpanded3] = React.useState('panel8');
  const [expanded2, setExpanded2] = React.useState('panel8');
  const [expanded4, setExpanded4] = React.useState('panel8');
  const [expanded5, setExpanded5] = React.useState('panel8');
  const [expanded6, setExpanded6] = React.useState('panel8');
  const [expanded7, setExpanded7] = React.useState('panel8');
  // added
  const [NewTokenList, setNewTokenList] = React.useState([]);
  const [UserAccountAddr, Set_UserAccountAddr] = React.useState('');
  const [UserAccountBal, Set_UserAccountBal] = React.useState(0);
  const [WalletConnected, Set_WalletConnected] = React.useState('false');
  const [Accounts, Set_Accounts] = React.useState('');
  const [AddressUserDetails, Set_AddressUserDetails] = useState({});
  const [Categorylist, setCategorylist] = React.useState([]);
  const [CatName, setCatName] = React.useState('All');
  const [CatBasedTokenList, setCatBasedTokenList] = React.useState({ 'loader': false, 'All': { page: 1, list: [], onmore: true } });
  const [TokenList, setTokenList] = React.useState([]);
  const [topcreatorsection, settopcreatorsection] = React.useState([]);
  const [getcmslistinhome1, setgetcmslistinhome1] = useState({});
  const [getcmslistinhome2, setgetcmslistinhome2] = useState({});
  const [Wen_Bln, set_Wen_Bln] = useState(0);
  const [convertVal, setConvertVal] = React.useState(0);
  const [Service_Fee, set_Service_Fee] = useState(0);
  const [providerss, set_providers] = useState(null)

  const [Time_Auction_List, Set_Time_Auction_List] = useState([]);
  const [WBNBconvertVal, Set_WBNBconvertVal] = useState(0)
  const [TopSaleValue, setTopSaleValue] = useState({})
  const [Promotion_List, Set_Promotion_list] = useState([])
  const [getcmslistinhome12, setgetcmslistinhome12] = useState({})
  // ref
  const WalletForwardRef = useRef();

  const handleChangeFaq = (panel1) => (event, isExpanded1) => {
    setExpanded1(isExpanded1 ? panel1 : false);
  };
  const handleChangeFaq2 = (panel2) => (event, isExpanded2) => {
    setExpanded2(isExpanded2 ? panel2 : false);
  };
  const handleChangeFaq3 = (panel3) => (event, isExpanded3) => {
    setExpanded3(isExpanded3 ? panel3 : false);
  };
  const handleChangeFaq4 = (panel4) => (event, isExpanded4) => {
    setExpanded4(isExpanded4 ? panel4 : false);
  };
  const handleChangeFaq5 = (panel5) => (event, isExpanded5) => {
    setExpanded5(isExpanded5 ? panel5 : false);
  };
  const handleChangeFaq6 = (panel6) => (event, isExpanded6) => {
    setExpanded6(isExpanded6 ? panel6 : false);
  };
  const handleChangeFaq7 = (panel7) => (event, isExpanded7) => {
    setExpanded7(isExpanded7 ? panel7 : false);
  };

  const [responsiveone] = React.useState({
    0: {
      items: 1,
    },
    450: {
      items: 1,
    },
    600: {
      items: 2,
    },
    1000: {
      items: 4,
    }
  })

  useEffect(() => {
    getcmslistinhomes22()
    CategoryListCall();
    topCreatorsFUnc();
    getcmslistinhomes1();
    // if(!(window.ethereum)){
    getInit();
    // }
  }, [])
  const getcmslistinhomes1 = async () => {
    var reqdata = {
      load: 'home'
    }
    var convers = await getcmslistinhome(reqdata);
    if (convers && convers.data) {
      setgetcmslistinhome12(convers.data)
      getcmslistinhomes12()
    }
  }

  const getcmslistinhomes22 = async () => {
    //console.log("ininninininininini")
    var reqdata = {
      load: 'image'
    }
    var convers = await getcmslistinhome(reqdata);
    if (convers && convers.data) {
      //console.log("ininninininininini222")
      //console.log("jsdfngvjrsngojnrfimage",convers.data,convers.data.answer)
      setgetcmslistinhome1(convers.data)
    }
  }

  const getcmslistinhomes12 = async () => {
    var reqdata = {
      load: 'home2'
    }
    var convers = await getcmslistinhome(reqdata);
    if (convers && convers.data) {
      //console.log("jsdfngvjrsngojnrf",reqdata,convers.data)
      setgetcmslistinhome2(convers.data)
    }
  }

  async function getInit() {
    NewTokenListCall();
    TokenListCall();
    timeAuctionFUnc();
    WBNBvlue();
    promotionData();
    // if(UserAccountAddr!=""){
    var senddata = { curraddress: UserAccountAddr }
    var appr = await ApproveCh(senddata)
    if (appr && appr.data && appr.data.success) {
      //console.log("appr", appr.data.success)

      toast('Now , You can able to mint', {
        position: "top-right",
        autoClose: 15000,
        hideProgressBar: false,
        newestOnTop: false,
        rtl: false,
        pauseOnFocusLoss: true,
        // draggable,
        pauseOnHover: true
      });
    }
  }
  // }

  const promotionData = async () => {
    var test = await getpromotion();
    if (test && test.userValue) {
      //console.log("benkjnfjknewionfiwo",test.userValue)
      Set_Promotion_list(test.userValue)
    }
  }



  const WBNBvlue = () => {
    axios.get('https://api.pancakeswap.info/api/v2/tokens/0x5d33e26336c445c71f206dd18b64ce11c2eee3f0')
      .then((data) => {
        if (data && data.data && data.data.data && data.data.data.price) {
          Set_WBNBconvertVal((data.data.data.price))
        }
      })
      .catch((e) => {
        console.log(e)
      })
    axios.get(`${config.vUrl}/token/show/top`)
      .then((data) => {
        //console.log("dsadasdasdsadasds", data.data)
        setTopSaleValue(data.data)
      })
      .catch((e) => {

      })
  }

  // myside
  const onLoadMore = () => {
    CatBasedTokenList[CatName].page = CatBasedTokenList[CatName].page + 1;
    setCatBasedTokenList(CatBasedTokenList);

    TokenListCall({
      page: CatBasedTokenList[CatName].page + 1
    });
  }
  async function catChange(name) {
    if (name != CatName) {
      setCatName(name);
      if (typeof CatBasedTokenList[name] == 'undefined') {
        CatBasedTokenList[name] = { page: 1, list: [], onmore: true };
        setCatBasedTokenList(CatBasedTokenList);
        TokenListCall({ CatName: name, page: 1 });
      }
    }
  }
  useEffect(() => {
    CmsImage()
  },[getcmslistinhome1])

  const CmsImage = () =>{
    return(
      <div className="dummy_bg">
              <div className="container">
                <div className="row dummy_cont">
                  <div className="col-12 col-lg-6 text-center">
                    <img src={getcmslistinhome1 && getcmslistinhome1.answer &&`${config.Back_URL + getcmslistinhome1.answer}`} alt="Collections2" className="img-fluid" />
                  </div>
                  <div className="col-12 col-lg-6 dummy_headnim">
                    {getcmslistinhome2 && getcmslistinhome2.answer ?
                    <>
                              {ReactHtmlParser(getcmslistinhome2.answer)}
                    </>
                    :
                    <>
                    <p className="dummy_head">Join the New Metaverse of Fashion</p>
                    <p className="dummy_head_big">Powerful Marketplace For Your Designs</p>
                    <p className="dummy_desc">The Nft-Style Marketplace is being designed to support the token perfectly. It is being developed to use NFT-Style token which will generate higher demand for the market. In addition of being unique concept, commission rates will be burned every month.</p>
                    </>
                    }
                  </div>
                </div>
              </div>
            </div>
    )
  }

  const topCreatorsFUnc = async () => {
    var topCraete = await topCreatorsApi();
    if (topCraete.data !== undefined) {
      settopcreatorsection(topCraete.data)
      // //("Top creator checking",topCraete)
    }
  }
  async function NewTokenListCall(data = {}) {
    var currAddr = UserAccountAddr
    // //("Admin Addtree "+ currAddr)
    var payload = {
      limit: config.limit,
      currAddr: currAddr,
      from: 'Home'
    }
    var resp = await NewCollectiblesList_Home(payload);
    // //("Admin Addreee",resp)
    if (resp !== undefined) {
      //console.log("testing",resp.data)
      setNewTokenList(resp.data.list);
    }
  }
  async function CategoryListCall() {
    axios
      .get(`${config.vUrl}/token/category/list`)
      .then(response => {
        //////('response',response)
        if (response && response.data && response.data.list) {
          setCategorylist(response.data.list);
        }
      })
      .catch(e => console.log(e))
  }
  async function AfterWalletConnected() {
    // if(UserAccountAddr == ''){
    //   getInit();
    // }
  }
  async function TokenListCall(data = {}) {
    var currAddr = UserAccountAddr;
    var name = CatName;
    if (data.CatName) {
      name = data.CatName
    }
    var payload = {
      limit: config.limit,
      page: (CatBasedTokenList[name] && CatBasedTokenList[name].page) ? CatBasedTokenList[name].page : 1,
      currAddr: currAddr,
      CatName: name,
      from: 'Home'
    }
    CatBasedTokenList.loader = true;
    setCatBasedTokenList(CatBasedTokenList);

    var resp = await CollectiblesList_Home(payload);
    CatBasedTokenList.loader = false;
    //console.log('home resp----', resp);
    if (resp && resp.data && resp.data.from == 'token-collectibles-list-home' && resp.data.list.length > 0) {
      setTokenList(TokenList.concat(resp.data.list));
      //console.log('home resp----11', resp);
      setCatBasedTokenList(CatBasedTokenList);
      if (typeof CatBasedTokenList[name] == 'undefined') {
        CatBasedTokenList[name] = { page: 1, list: [] };
      }
      CatBasedTokenList[name].list = CatBasedTokenList[name].list.concat(resp.data.list);
      setCatBasedTokenList([]);
      setCatBasedTokenList(CatBasedTokenList);
    }
    else {
      CatBasedTokenList[name].onmore = false;
      setCatBasedTokenList([]);
      setCatBasedTokenList(CatBasedTokenList);
    }
  }
  const timeAuctionFUnc = async () => {
    var currAddr = UserAccountAddr;

    var payload = {
      limit: 6, from: 'Time', currAddr: currAddr
    }
    var resp = await CollectiblesList_Home(payload);
    if (resp && resp.data && resp.data.from == 'time-auction-token-collectibles-list-home' && resp.data.list && resp.data.list.length > 0) {
      Set_Time_Auction_List(resp.data.list)
    }
    else {
      Set_Time_Auction_List([])
    }
  }

  const timediff = (a) =>{
    var date1 = new Date(Date.now());
    var date2 = new Date(a);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days
  } 

  const SliceData = (q) => {
    // console.log("hhdfebfuibuifb2222",q.length)
    var j;
    if(Number(q) < 0.0001)
    {
    for (var i = 0; i <= q.length; i++){
      if((q.charAt(i) !== '.') && (q.charAt(i) !== '0'))
      {
        j = q.slice(0,i+3)
        
      //console.log("hhdfebfuibuifb33",q,j)
        i = q.length
      }
    }
  }
  else{
    j = q
  }
    return j
  }

  return (
    <div className="home_header">
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
      <WalletRef
        ref={WalletForwardRef}
        Set_UserAccountAddr={Set_UserAccountAddr}
        Set_WalletConnected={Set_WalletConnected}
        Set_UserAccountBal={Set_UserAccountBal}
        set_providers={set_providers}
      />
      <div className="home_banner_bg">
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
        <div className="header-filter banner_hme">

          <div className="container pb-5">
            {Promotion_List.length == 0 ?
              <OwlCarousel items={1}
                className="owl-theme banner-owl"
                loop
                nav={true}
                margin={20} items={1} dots={false}>
                <div>
                  <div className="row">

                    <div className="col-12 col-lg-6 flex_center_left">
                      <>
                        {/* <div class="media">
                        <div class="media-body">
                          <p className="mt-0 mb-1 crnt_i_txt">Current Bid</p>
                          <p className="crnt_i_desc">281.35WBNB = $2.33</p>
                        </div>
                        <img src={require("../assets/images/banner-icon.png")} alt="Collections" className="img-fluid ml-3 icon_ban" />
                      </div> */}
                        <div class="meAddednim">
                          {ReactHtmlParser(getcmslistinhome12.answer)}
                        </div>
                        {/* <p className="banner_new_title">Yellow Fire</p>

                      <p className="banner_new_subtitle">World War</p> */}
                        <Button className="mt-3 mb-2 theme-btn ">
                          <Link to='/'>Explore</Link>

                        </Button>
                        <div className="row w-100">
                          <div className="col-12 col-sm-6">
                            <div className="card active_usr_crd">
                              <div className="card-body px-3">
                                <p className="active_user text-center">{TopSaleValue && TopSaleValue.totalBidings} Active</p>
                                <p className="crnt_i_txt text-center mb-0">Total Bid's</p>
                              </div>
                            </div>

                          </div>

                          <div className="col-12 col-sm-6">
                            <div className="card active_usr_crd">
                              <div className="card-body px-3">
                                <p className="active_user text-center">{TopSaleValue && TopSaleValue.totalNft && (TopSaleValue.totalNft).length > 0 && TopSaleValue.totalNft[0].users_count ? TopSaleValue.totalNft[0].users_count : 0} Active</p>
                                <p className="crnt_i_txt text-center mb-0">Total NFT's</p>
                              </div>
                            </div>

                          </div>
                        </div>
                      </>
                      {/* } */}

                      {/* {ReactHTMLParser(getcmslistinhome1.answer)} */}
                    </div>
                    <div className="col-12 col-lg-6 mt-4 mt-lg-0">
                      <div className="left_img_bbg">
                        <div className="right_baner_img">
                          <img src={require("../assets/images/banner_obj.png")} alt="Collections" className="img-fluid" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


              </OwlCarousel>
              :
              <OwlCarousel items={1}
                className="owl-theme banner-owl"
                loop
                nav={true}
                margin={20} items={1} dots={false}>
                {Promotion_List.map((Promotion_List) => {

                  return <div>
                    <div className="row">
                      <div className="col-12 col-lg-6 flex_center_left">
                        <>
                          <div class="media">
                            <img src={require("../assets/images/banner-icon.png")} alt="Collections" className="img-fluid mr-3 icon_ban" />

                            <div class="media-body">
                              <p className="mt-0 mb-1 crnt_i_descauc">On Auction</p>
                              {/* <p className="crnt_i_desc">281.35WBNB = $2.33</p> */}
                            </div>
                          </div>
                          {/* <p className=" banner_new_subtitle ">
                            On Auction
                          </p> */}
                          <p className=" banner_new_subtitle_1 ">{Promotion_List.tokenName}</p>

                          <p className="crnt_i_txt mt-2 text-uppercase bsanner_desc">{Promotion_List.tokenDesc}</p>

                          <p className="mt-0 mb-1 crnt_i_desc">{(timediff(Promotion_List.endclocktime) >= 1)? "Only" + " " + Math.round(timediff(Promotion_List.endclocktime)) + " "+"Day Left..!":(timediff(Promotion_List.endclocktime) == 0)?"Today's the Day Hurry Up":"Auction Ended"}</p>
                              <p className="crnt_i_descnim">{Promotion_List.minimumBid != 0? Promotion_List.minimumBid + " " + Promotion_List.CoinName + " " + "Minimum Bid":"Open For Bid"}</p>
                          {/* <p className="crnt_i_txt mt-2">{Promotion_List.tokenDesc}</p> */}
                          <Button className="mt-3 mb-2 theme-btn ">
                            <Link to={"/info/" + Promotion_List.tokenCounts}>View Item</Link>
                          </Button>
                          <div className="row w-100">
                            <div className="col-12 col-sm-6">
                              <div className="card active_usr_crd">
                                <div className="card-body px-3">
                                  <p className="active_user text-center">{TopSaleValue && TopSaleValue.totalBidings} Active</p>
                                  <p className="crnt_i_txt text-center mb-0">Total Bid's</p>
                                </div>
                              </div>

                            </div>

                            <div className="col-12 col-sm-6">
                              <div className="card active_usr_crd">
                                <div className="card-body px-3">
                                  <p className="active_user text-center">{TopSaleValue && TopSaleValue.totalNft && (TopSaleValue.totalNft).length > 0 && TopSaleValue.totalNft[0].users_count && TopSaleValue.totalNft[0].users_count} Active</p>
                                  <p className="crnt_i_txt text-center mb-0">Total NFT's</p>
                                </div>
                              </div>

                            </div>
                          </div>
                        </>
                        {/* } */}

                        {/* {ReactHTMLParser(getcmslistinhome1.answer)} */}
                      </div>
                      <div className="col-12 col-lg-6 mt-4 mt-lg-0">
                        <div className="left_img_bbg">
                          <div className="right_baner_img">
                            {(Promotion_List.image && Promotion_List.image != "" && (Promotion_List.image).split('.')[1] == 'mp4') ?
                             <ReactPlayer playing={true} url={Promotion_List.additionalImage ? (Promotion_List.additionalImage == "" ? `${config.IPFS_IMG}/${Promotion_List.ipfsimage}` : `${config.Back_URL}/nftImg/${Promotion_List.tokenCreator}/${Promotion_List.additionalImage}`) : `${config.Back_URL}/compressedImage/${Promotion_List.tokenCreator}/${Promotion_List.image}`}
                             loop={true}
                             controls={true}
                             muted={true}
                             playsinline={true} 
                             />
                            :
                            <img src={Promotion_List.additionalImage ? (Promotion_List.additionalImage == "" ? `${config.IPFS_IMG}/${Promotion_List.ipfsimage}` : `${config.Back_URL}/nftImg/${Promotion_List.tokenCreator}/${Promotion_List.additionalImage}`) : `${config.IPFS_IMG}/${Promotion_List.ipfsimage}`} alt="Collections" className="img-fluid" />
                            }
                            </div>
                        </div>
                      </div>

                    </div>
                  </div>
                })}

              </OwlCarousel>}
          </div>
        </div>
      </div>

      <div className="main">
        <div className="main_2_bg">
            <CmsImage/>
          <div className="live_sec_bg">
            {/* Explore Section */}
            <section className="bid_section section bid_section_section_1 pb-0">

              {
                (Time_Auction_List && Time_Auction_List.length > 0) &&

                <div className="container">
                  <h2 className="title_text_white mb-4 mt-0">Live Auctions</h2>
                  <OwlCarousel items={1}
                    className="owl-theme"
                    nav={true}
                    margin={20} autoplay={false} responsive={responsiveone} dots={false}>


                    {Time_Auction_List.map((item) => {
                      ////("check",item)
                      return (
                        <div className="masonry">

                          <TokenItem
                            item={item}
                            UserAccountAddr={UserAccountAddr}
                            UserAccountBal={UserAccountBal}
                            WalletConnected={WalletConnected}
                          />

                        </div>
                      )
                    }
                    )}

                  </OwlCarousel>

                </div>

              }
            </section>

            <div className="stat_sec pb-5 state_sec_bg">
              <div className="container">
                <div className="card card_blue_grad my-0">
                  <div className="card-body py-4">
                    <p className="heading_big heading_big_orange text-center">Our Stats</p>
                    <div className="row mt-4 pt-2">


                      <div className="col-12 col-sm-6 col-lg-3 mb-3">
                        <div className="card card_blue_dark my-0">
                          <div className="card-body">
                            <p className="heading_count text-center">{TopSaleValue && TopSaleValue.totalSales && TopSaleValue.totalSales}</p>
                            <p className="heading_stats text-center mb-0">Total Sales</p>
                          </div>
                        </div>

                      </div>
                      <div className="col-12 col-sm-6 col-lg-3 mb-3">
                        <div className="card card_blue_dark my-0">
                          <div className="card-body">
                            <p className="heading_count text-center">{TopSaleValue && TopSaleValue.totalUsers && TopSaleValue.totalUsers}</p>
                            <p className="heading_stats text-center mb-0">Total Users</p>
                          </div>
                        </div>

                      </div>
                      <div className="col-12 col-sm-6 col-lg-3 mb-3">
                        <div className="card card_blue_dark my-0">
                          <div className="card-body">
                            <p className="heading_count text-center">$ {SliceData(convertVal)}</p>
                            <p className="heading_stats text-center mb-0">Current {config.currencySymbol} Value in USD</p>
                          </div>
                        </div>

                      </div>
                      <div className="col-12 col-sm-6 col-lg-3 mb-3">
                        <div className="card card_blue_dark my-0">
                          <div className="card-body">
                            <p className="heading_count text-center">$ {SliceData(String(WBNBconvertVal))}</p>
                            <p className="heading_stats text-center mb-0">Current {config.tokenSymbol} Value in USD</p>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        {/* Explore Section */}
        <div className="disc_sec_full">
          <section className="discover_section section pt-2">
            <div className="container">
              <div className="row row_rel">
                <div className="col-12 col-lg-5 align_dis_sec">
                  <h2 className="title_text_white mb-3 mt-0">Discover</h2>



                </div>
                <div className="col-12 col-lg-7 pl-3 mt-3">
                  <Scrollbars style={{ height: 75 }}>
                    <nav className="masonry_tab_nav">
                      <div className="nav nav-tabs masonry_tab home_masonary_tab pl-0" id="nav-tab" role="tablist">
                        <a className="nav-link active" onClick={() => catChange('All')} id="all-tab" data-toggle="tab" href="#all" role="tab" aria-controls="all" aria-selected="true">All Items</a>
                        {
                          Categorylist.map((item) => {
                            return (
                              <a className="nav-link" onClick={() => catChange(item.name)} data-tabName={item.name} id="all-tab" data-toggle="tab" href="#all" role="tab" aria-controls="all" aria-selected="true">{item.name}</a>
                            )
                          })
                        }
                      </div>
                    </nav>
                  </Scrollbars>
                </div>





              </div>
              <div className="tab-content explore_tab_content mt-4" id="nav-tabContent">
                <div className="tab-pane fade show active" id="all" role="tabpanel" aria-labelledby="all-tab">
                  <div className="row mx-0-xs">
                    {
                      (CatBasedTokenList && CatName && CatBasedTokenList[CatName] && CatBasedTokenList[CatName].list && CatBasedTokenList[CatName].list.length > 0) ? (CatBasedTokenList[CatName].list.map((item) => {
                        return (
                          <div className="col-12 col-sm-6 col-lg-4 col-xl-3 masonry mb-4">

                            <TokenItem
                              item={item}
                              UserAccountAddr={UserAccountAddr}
                              UserAccountBal={UserAccountBal}
                              WalletConnected={WalletConnected}
                            />
                          </div>
                        )
                      })) :
                        <div className="text-center col-12">
                          <div className="text-center py-3  no_items_row">
                            <p className="not_found_text">No collectible items found</p>
                            <p className="not_found_text_sub">Come back soon! Or try to browse something for you on our marketplace</p>
                          </div>
                        </div>
                    }

                    {
                      (CatBasedTokenList && CatBasedTokenList.loader == false && CatBasedTokenList[CatName] && CatBasedTokenList[CatName].onmore == true) ? (
                        <div class="col-12 text-center">
                          {(CatBasedTokenList.loader == true) ? <i class="fa fa-spinner ml-2 spinner_icon spin_sm" aria-hidden="true"></i> : ('')}

                          <Button className="create_btn mb-3 mt-3 font_14 load_more_trans_btn" onClick={() => { onLoadMore() }}>
                            Load More
                          </Button>
                        </div>) : ('')}
                  </div>


                </div>


              </div>
            </div>
          </section>

          {/* Wallet Section */}
          <section className="mb-0 mt-3 wal_sec">

            <div className="container pt-2">
              <div className="row">
                <div className="col-12 col-md-12">
                  <div className="card black_card_big">
                    <div className="card-body">
                      <h2 className="heading_white_main mt-3 mb-4">Wallets Support</h2>
                      <div className="row my-3">
                        <div className="col-12 col-sm-10 mx-auto">
                          <div className="row">
                            <div className="col-6 col-md-2 offset-md-4 text-center">
                              <img src={require("../assets/images/fox.png")} alt="Wallet" className="img-fluid wallet_img" />

                            </div>
                            <div className="col-6 col-md-2 text-center">
                              <img src={require("../assets/images/trust.png")} alt="Wallet" className="img-fluid wallet_img" />

                            </div>
                          </div>

                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>

            </div>
          </section>
        </div>

      </div>
      <Footer />

      {/* proceed Modal */}
      <div class="modal fade primary_modal" id="proceed_modal" tabindex="-1" role="dialog" aria-labelledby="proceed_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
          <div class="modal-content">
            <div class="modal-header text-center">
              <h5 class="modal-title" id="proceed_modalLabel">Follow Steps</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form>
                <p className="mt-0 purchase_text text-center">Purchase</p>
                <p className="mt-0 purchase_desc text-center">Send transaction with your wallet</p>

                <div className="text-center my-3">
                  <Button className="primary_btn btn_white btn-block">Inprogress</Button>
                </div>


              </form>
            </div>
          </div>
        </div>
      </div>
      {/* end proceed modal */}

      {/* place_bid Modal */}
      <div class="modal fade primary_modal" id="place_bid_modal" tabindex="-1" role="dialog" aria-labelledby="place_bid_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
          <div class="modal-content">
            <div class="modal-header text-center">
              <h5 class="modal-title" id="place_bid_modalLabel">Place a bid</h5>
              <p className="text-center place_bit_desc">You are about to place a bid for</p>
              <p className="text_grey_clickb mb-0">0x0dsleowdslsaldjfldssh213221</p>
              <p className="place_bit_desc_2">by Xrteprt</p>


              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body px-0 pt-0">
              <form className="px-4 bid_form">
                <label for="bid">Your Bid</label>
                <div class="input-group mb-3 input_grp_style_1">
                  <input type="text" id="bid" class="form-control primary_inp" placeholder="" aria-label="bid" aria-describedby="basic-addon2" />
                  <div class="input-group-append">
                    <span class="input-group-text" id="basic-addon2">
                      {/* <img src={require("../assets/images/arrow_circle.png")} alt="Collections" className="img-fluid selct_arrow_pos" /> */}

                      <select class="form-control" id="exampleFormControlSelect1">
                        <option>BNB</option>
                        <option>ETH</option>

                      </select>
                    </span>
                  </div>
                </div>

                {/* <label for="qty">Enter quantity <span className="label_muted pl-2">(30 available)</span></label>
<div class="mb-3 input_grp_style_1">
<input type="text" id="qty" class="form-control" placeholder="1"  />

</div> */}
                <div className="row pb-2">
                  <div className="col-12 col-sm-6">
                    <p className="buy_desc_sm">Your balance</p>
                  </div>
                  <div className="col-12 col-sm-6 text-sm-right">
                    <p className="buy_desc_sm_bold">12 BNB</p>
                  </div>
                </div>
                <div className="row pb-2">
                  <div className="col-12 col-sm-6">
                    <p className="buy_desc_sm">Your bidding amount</p>
                  </div>
                  <div className="col-12 col-sm-6 text-sm-right">
                    <p className="buy_desc_sm_bold">2.21232 BNB</p>
                  </div>
                </div>
                <div className="row pb-2">
                  <div className="col-12 col-sm-6">
                    <p className="buy_desc_sm">Service fee</p>
                  </div>
                  <div className="col-12 col-sm-6 text-sm-right">
                    <p className="buy_desc_sm_bold">0.000002 BNB</p>
                  </div>
                </div>
                <div className="row pb-2">
                  <div className="col-12 col-sm-6">
                    <p className="buy_desc_sm">You will pay</p>
                  </div>
                  <div className="col-12 col-sm-6 text-sm-right">
                    <p className="buy_desc_sm_bold">2.3000002 BNB</p>
                  </div>
                </div>

                <div className="text-center mt-3">
                  <Button className="primary_btn btn-block" data-dismiss="modal" aria-label="Close" data-toggle="modal" data-target="#proceed_bid_modal">Place a bid</Button>

                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
      {/* end place_bid modal */}


      {/* place_bid multiple */}
      <div class="modal fade primary_modal" id="place_bid_multiple_modal" tabindex="-1" role="dialog" aria-labelledby="place_bid_multiple_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
          <div class="modal-content">
            <div class="modal-header text-center">
              <h5 class="modal-title" id="place_bid_multiple_modalLabel">Place a bid</h5>
              <p className="text-center place_bit_desc">You are about to place a bid for</p>
              <p className="text_grey_clickb mb-0">0x0dsleowdslsaldjfldssh213221</p>
              <p className="place_bit_desc_2">by Xrteprt</p>


              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body px-0 pt-0">
              <form className="px-4 bid_form">
                <label for="bid">Your bid</label>
                <div class="input-group mb-3 input_grp_style_1">
                  <input type="text" id="bid" class="form-control primary_inp" placeholder="" aria-label="bid" aria-describedby="basic-addon2" />
                  <div class="input-group-append">
                    <span class="input-group-text" id="basic-addon2">
                      {/* <img src={require("../assets/images/arrow_circle.png")} alt="Collections" className="img-fluid selct_arrow_pos" /> */}

                      <select class="form-control" id="exampleFormControlSelect1">
                        <option>BNB</option>
                        <option>ETH</option>

                      </select>
                    </span>
                  </div>
                </div>

                <label for="qty">Enter quantity <span className="label_muted pl-2">(30 available)</span></label>
                <div class="mb-3 input_grp_style_1">
                  <input type="text" id="qty" class="form-control" placeholder="1" />

                </div>

                <div className="row pb-2">
                  <div className="col-12 col-sm-6">
                    <p className="buy_desc_sm">Your balance</p>
                  </div>
                  <div className="col-12 col-sm-6 text-sm-right">
                    <p className="buy_desc_sm_bold">12 BNB</p>
                  </div>
                </div>
                <div className="row pb-2">
                  <div className="col-12 col-sm-6">
                    <p className="buy_desc_sm">Your bidding amount</p>
                  </div>
                  <div className="col-12 col-sm-6 text-sm-right">
                    <p className="buy_desc_sm_bold">2.21232 BNB</p>
                  </div>
                </div>
                <div className="row pb-2">
                  <div className="col-12 col-sm-6">
                    <p className="buy_desc_sm">Service fee</p>
                  </div>
                  <div className="col-12 col-sm-6 text-sm-right">
                    <p className="buy_desc_sm_bold">0.000002 BNB</p>
                  </div>
                </div>
                <div className="row pb-2">
                  <div className="col-12 col-sm-6">
                    <p className="buy_desc_sm">You will pay</p>
                  </div>
                  <div className="col-12 col-sm-6 text-sm-right">
                    <p className="buy_desc_sm_bold">2.3000002 BNB</p>
                  </div>
                </div>

                <div className="text-center mt-3">
                  <Button className="primary_btn btn-block" data-dismiss="modal" aria-label="Close" data-toggle="modal" data-target="#proceed_bid_modal">Place a bid</Button>

                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
      {/* end place_bid modal multiple */}

      {/* proceed_bid Modal */}
      <div class="modal fade primary_modal" id="proceed_bid_modal" tabindex="-1" role="dialog" aria-labelledby="proceed_bid_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
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
                  {/* <i className="fas fa-check mr-3 pro_initial" aria-hidden="true"></i> */}
                  <i className="fas fa-check mr-3 pro_complete" aria-hidden="true"></i>
                  {/* <i className="fas fa-check mr-3 pro_incomplete" aria-hidden="true"></i> */}
                  {/* <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true"></i> */}
                  <div className="media-body">
                    <p className="mt-0 approve_text">Approve</p>
                    <p className="mt-0 approve_desc">Checking balance and approving</p>
                  </div>
                </div>
                <div className="text-center my-3">
                  <Button className="primary_btn btn-block">Start</Button>
                </div>
                <div className="media approve_media">
                  <i className="fas fa-check mr-3 pro_initial" aria-hidden="true"></i>
                  {/* <i className="fas fa-check mr-3 pro_complete" aria-hidden="true"></i> */}
                  {/* <i className="fas fa-check mr-3 pro_incomplete" aria-hidden="true"></i> */}
                  {/* <i class="fa fa-spinner mr-3 spinner_icon" aria-hidden="true"></i> */}
                  <div className="media-body">
                    <p className="mt-0 approve_text">Signature</p>
                    <p className="mt-0 approve_desc">Create a signatute to place a bid</p>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <Button className="primary_btn btn-block" disabled>Start</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* end proceed_bid modal */}


      {/* SHARE Modal */}
      <div class="modal fade primary_modal" id="share_modal" tabindex="-1" role="dialog" aria-labelledby="share_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
          <div class="modal-content">
            <div class="modal-header text-center">
              <h5 class="modal-title" id="share_modalLabel">Share this NFT</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body px-0">
              <div className="row justify-content-center mx-0">
                <div className="col-12 col-sm-6 col-lg-3 px-1">
                  <div className="text-center icon_div">
                    <i class="fab fa-telegram-plane"></i>
                    <p>Telegram</p>
                  </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-3 px-1">
                  <div className="text-center icon_div">
                    <i class="fab fa-twitter"></i>
                    <p>Twitter</p>
                  </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-3 px-1">
                  <div className="text-center icon_div">
                    <i class="fab fa-facebook-f"></i>
                    <p>Facebook</p>
                  </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-3 px-1">
                  <div className="text-center icon_div">
                    <i class="fab fa-whatsapp"></i>
                    <p>Whatsapp</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      {/* end SHARE modal */}


    </div>
  );
}
