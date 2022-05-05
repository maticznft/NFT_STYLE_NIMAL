import React, {
 useEffect,
 useState,
 useRef,
 } from 'react';
 import {
 Link,
 useParams,
 useHistory
 } from "react-router-dom";
 import isEmpty from "lib/isEmpty";
 import {
  getprofile,
  getFollowers,
  followUnfollow,
  checkFollower
 } from '../actions/v1/user';
 // @material-ui/core components
 import { makeStyles } from "@material-ui/core/styles";
 import { FacebookShareButton,  TwitterShareButton, TelegramShareButton, WhatsappShareButton } from 'react-share'
 import { Button, TextField } from '@material-ui/core';
 // core components
 import Header from "components/Header/Header.js";
 import GridContainer from "components/Grid/GridContainer.js";
 import GridItem from "components/Grid/GridItem.js";
 import HeaderLinks from "components/Header/HeaderLinks.js";
 import Footer from "components/Footer/Footer.js";
 import styles from "assets/jss/material-kit-react/views/landingPage.js";
 import { Scrollbars } from 'react-custom-scrollbars';
 import Web3 from 'web3';
 import config from '../lib/config';
 import Avatars from './Avatar';
 import CopyToClipboard from 'react-copy-to-clipboard';
 import imgs from "../assets/images/my_items_bg_new_light.png";
 import imgdark from "../assets/images/my_items_bg_new.jpg";
 import Modal from 'react-modal';
 import BNB from '../assets/images/loader.png'

 import {
  getCurAddr,
  FollowChange_Action,
  changeReceiptStatus_Action,
  ParamAccountAddr_Detail_Get,
  User_FollowList_Get_Action,
  coverimagevalidations,
  coverImage,
 } from '../actions/v1/user';
 import { toast } from 'react-toastify';
 import {
  CollectiblesList_MyItems
 } from '../actions/v1/token';
 import Banner from "../assets/images/my_items_bg_new.jpg";
 import TokenItem from './separate/Token-Item';
 import BidPopup from './separate/Bid-Popup';
 import ConnectWallet from './separate/Connect-Wallet';
import {ActivityCall,notifications,notificationStatusChange} from '../actions/v1/report';
 toast.configure();
 let toasterOption = config.toasterOption;
 function ScrollToTopOnMount() {
 useEffect(() => {
  window.scrollTo(0, 0);
  if(document.getElementById("root").classList.contains('light_theme')){    
      document.getElementById("items_bg_img").src=imgs;  
    }
     else
     {
   document.getElementById("items_bg_img").src=imgdark; 
     }
 }, []);
 return null;
 }

 const dashboardRoutes = [];
 const useStyles = makeStyles(styles);
 
 export default function Myitems(props) {
  const history=useHistory();
 const classes = useStyles();
 const { ...rest } = props;
 var temp = 1
 var { paramUsername, paramAddress,activity } = useParams();
 if(typeof paramUsername == 'undefined') { paramUsername = ''; }
 if(typeof paramAddress == 'undefined') { paramAddress = ''; }
//console.log('paramUsername : ',paramUsername,'paramAddress : ',paramAddress);
 const [ParamAccountCustomUrl, Set_ParamAccountCustomUrl] = React.useState(paramUsername);
 const [ParamAccountAddr, Set_ParamAccountAddr] = React.useState(paramAddress);
 const [UserNotFound, Set_UserNotFound] = React.useState(false);
 const [FollowingUserList, Set_FollowingUserList] = React.useState([]);
 
 // wallet related : common state
 const [WalletConnected, Set_WalletConnected] = React.useState('false');
 const [UserAccountAddr, Set_UserAccountAddr] = React.useState('');
 const [UserAccountBal, Set_UserAccountBal] = React.useState(0);
 const [AddressUserDetails, Set_AddressUserDetails] = useState({});
 const [Accounts, Set_Accounts] = React.useState('');
 const [showingLoader, setshowingLoader] = React.useState(false);
 const [chooseimage, setchooseimage] = React.useState(false);
 const [validateError, setvalidateError] = React.useState({});
 const [followButton , setFollowButton] = useState('Follow')
 const [MyItemAccountAddr, Set_MyItemAccountAddr] = React.useState('');
 const [MyItemAccountAddr_Details, Set_MyItemAccountAddr_Details] = React.useState('');
 const [profile, setProfile] = useState({});
 const [coverimage, setcoverphoto] = React.useState(Banner);
 const [HitItem, Set_HitItem] = useState({});
 const [LikedTokenList, setLikedTokenList] = React.useState([]);
 const [OnSale_Count, Set_OnSale_Count] = useState(0);
 const [OnSale_List, Set_OnSale_List] = useState([]);
 const [followList, setFollowList ] = useState([]);
 const [followingList, setFollowingList] = useState([]);
 
 const [Collectibles_Count, Set_Collectibles_Count] = useState(0);
 const [Collectibles_List, Set_Collectibles_List] = useState([]);
 
 const [Created_Count, Set_Created_Count] = useState(0);
 const [Created_List, Set_Created_List] = useState([]);
 
 const [Owned_Count, Set_Owned_Count] = useState(0);
 const [Owned_List, Set_Owned_List] = useState([]);
 
 const [Liked_Count, Set_Liked_Count] = useState(0);
 const [Liked_List, Set_Liked_List] = useState([]);
  
 const [Burned_Count, Set_Burned_Count] = useState(0);
 const [Burned_List, Set_Burned_List] = useState([]);

 const [Activity_Data, set_Activity_Data] = useState([]);
 const [Activity_Count, set_Activity_Count] = useState(0);
 const [Service_Fee, set_Service_Fee] = useState(0);
 const [providerss,set_providers]=useState(null)
const[Wen_Bln,set_Wen_Bln]=useState(0);
const [convertVal, setConvertVal] = React.useState(0);
const [Activity_Item,Set_Activity_Item]=useState([])
const [modalopen,setmodalopen] = useState(false)
useEffect(() => {
  setmodalopen(true)
  getInit(UserAccountAddr);
  getProfileData();
}, [UserAccountAddr]);  

const Get_MyItemAccountAddr_Details = async (payload) => {
  var Resp = await ParamAccountAddr_Detail_Get(payload);
  //////console.log("weewewew",Resp.data)
  if (
    Resp
    && Resp.data
    && Resp.data.User
    && Resp.data.User.curraddress
  ) {
    Set_MyItemAccountAddr(Resp.data.User.curraddress);
    if (Resp.data.User) {
      Set_MyItemAccountAddr_Details(Resp.data.User);
    }
  }
  else {
    if(temp == 0){
    toast.warning('User not found', toasterOption);
    Set_UserNotFound(true);
    temp = temp - 1
    }
  }
}

// async function AfterWalletConnected() {}
const AfterWalletConnected = async () => {
  // getInit();
}

const customStyles = {
  content: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 27px 24px 12px rgb(0 0 0 / 20%), 0 40px 77px 0 rgb(0 0 0 / 22%)',
    borderRadius: '30px',
    border: 'none !important',
  },
  overlay: {
   zIndex:2,
   backgroundColor: 'rgba(255, 255, 255, 1)'
   //backGroundColor
  },
};

const getInit=async(UserAccountAddr)=>{
var currAddr = isEmpty(UserAccountAddr)?await getCurAddr() : UserAccountAddr;
var payload = {}
// if (UserAccountAddr != '') {
  if (ParamAccountAddr!="" || ParamAccountCustomUrl!="") {
    if (ParamAccountAddr && ParamAccountAddr.toString() === currAddr.toString()) {
     Set_MyItemAccountAddr(ParamAccountAddr);
     payload.addr=ParamAccountAddr
   }
   else {
     if (ParamAccountAddr!="") {
       
       payload.addr = ParamAccountAddr;
     }
     else if (ParamAccountCustomUrl!="") {
       payload.customurl = ParamAccountCustomUrl;
     }
   }
 }
 else {
   Set_MyItemAccountAddr(currAddr);
   payload.addr=currAddr
 }
 Set_MyItemAccountAddr()
 await Get_MyItemAccountAddr_Details(payload);
 window.$('#AfterWalletConnected_two').click();
//  }
 
} 

const getProfileData = async () => {
  
  const currAddr = MyItemAccountAddr;

  let reqData = {
    currAddr
  }
  var data = await getprofile(reqData);
  
  setProfile(data.userValue);
 if (data&&data.userValue) {
   if (data.userValue.coverimage != "") {
   
      let coverimage = `${config.Back_URL}/images/coverimages/${data.userValue._id}/${data.userValue.coverimage}`;
      setcoverphoto(coverimage);
      setTimeout(() => {
        setmodalopen(false)
      }, 500);
    }
    else{
      setcoverphoto(Banner)
      setTimeout(() => {
        setmodalopen(false)
      }, 500);
    }
  }
}
async function AfterWalletConnected_two() {
  await ActivityTab('mine');
  await checkFollowUser();
  await getfollowers1();
  await getfollowing();
  await getProfileData();
  await Tab_Data_Call('Count', 'onsale', 'true');
  await Tab_Data_Call('List', 'onsale', 'true');
  await Tab_Data_Call('Count', 'created', 'true');
  await Tab_Data_Call('Count', 'collectibles', 'true');
  await Tab_Data_Call('Count', 'owned', 'true');
  await Tab_Data_Call('Count', 'liked', 'true');
  
}

async function Tab_Click(TabName) {
  await Tab_Data_Call('List', TabName, true);
  await Tab_Data_Call('Count', TabName, true);
}
async function Tab_Data_Call(Target, TabName, init) {
  if (MyItemAccountAddr!="") {
    // //////console.log("allowed here")
    var ReqData = {
      Addr: MyItemAccountAddr,
      MyItemAccountAddr: MyItemAccountAddr,
      ParamAccountAddr: ParamAccountAddr,
      UserAccountAddr: UserAccountAddr,
      Target: Target,
      TabName: TabName,
      init: init,
      from: 'My-Items'
    };

    var Resp = {};
    Resp = await CollectiblesList_MyItems(ReqData);
    var RespNew = await CorrectDataGet(Resp);

    if (
      (Target == 'Count' && typeof RespNew.count != 'undefined')
      ||
      (Target == 'List' && RespNew.list)
    ) {
      if (TabName == 'collectibles') {
        if (Target == 'Count') { Set_Collectibles_Count(RespNew.count); }
        if (Target == 'List') { Set_Collectibles_List(RespNew.list); }
      }
      else if (TabName == 'onsale') {
        if (Target == 'Count') { Set_OnSale_Count(RespNew.count); }
        if (Target == 'List') { Set_OnSale_List(RespNew.list); }
      }
      else if (TabName == 'created') {
        //("check vala",RespNew.count)
        //("check vala",RespNew.list)
        if (Target == 'Count') { Set_Created_Count(RespNew.count); }
        if (Target == 'List') { Set_Created_List(RespNew.list); }
      }
      else if (TabName == 'owned') {
        if (Target == 'Count') { Set_Owned_Count(RespNew.count); }
        if (Target == 'List') { Set_Owned_List(RespNew.list); }
      }
      else if (TabName == 'liked') {
        if (Target == 'Count') { Set_Liked_Count(RespNew.count); }
        if (Target == 'List') { Set_Liked_List(RespNew.list); }
      }
    }
  }
  return true;
}
async function changeReceiptStatus_Call(list) {
  var web3 = new Web3(window.ethereum);
  list.map(async (item) => {
    if (item && typeof item.checkAdd != "undefined" && item.checkAdd.hashValue) {
      try {
        var data = await web3.eth.getTransactionReceipt(item.checkAdd.hashValue);
        var hashValue = item.checkAdd.hashValue;
        if (data == null) {
        } else {
          if (data.status == '0x0') {
          } else {
            var payload = {
              status: 'true',
              hashValue: hashValue
            }
            await changeReceiptStatus_Action(payload);
          }
        }
      }
      catch (err) {
        // //('err', err);
      }
    }
  })
}
async function CorrectDataGet(Resp, Target) {
  var RetData = { count: 0, list: [] }
  if (
    Resp
    && Resp.data
    && Resp.data.Target
    && Resp.data.list
    && Resp.data.list[0]
  ) {
    if (Resp.data.Target == 'Count' && Resp.data.list[0].count) {
      RetData.count = Resp.data.list[0].count;
    }
    else if (Resp.data.Target == 'List' && Resp.data.list[0]) {
      RetData.list = Resp.data.list;
    }
  }
  if (
    Resp
    && Resp.data
    && Resp.data.Target
    && Resp.data.changeStatusList) {
    changeReceiptStatus_Call(Resp.data.changeStatusList);
  }
  return RetData;
}

const ActivityTab=async(data)=>{
  var reqdata={
    tabName:data,
    currAddr:MyItemAccountAddr,
    limit:config.limit,
    page:1,
  }
  
  var activitys=await ActivityCall(reqdata)
  if(activitys&&activitys.data&&activitys.data.list&&(activitys.data.list).length>0){
    Set_Activity_Item(activitys.data.list)
  }
  else{
    Set_Activity_Item([])
  }

}

const copyText = (a, b) => {
  toast.success('copied', toasterOption);

}
const handleFile = async (e) => {
  var reader = new FileReader()
  var file = e.target.files[0];
  var url = reader.readAsDataURL(file);
  reader.onloadend = function (e) {
    setcoverphoto(reader.result)
  }.bind(this);


  let addr = isEmpty(paramAddress) ? UserAccountAddr : paramAddress;
  var reqdata = {
    file,
    currAddr: addr,
  }

  const { error } = await coverimagevalidations(reqdata)

  if (error != undefined) {
    setshowingLoader(true)
    if (isEmpty(error.errors)) {
      setchooseimage(true)
      setvalidateError('')
      var coverimg = await coverImage(reqdata)
      if (coverimg && coverimg.userValue != undefined) {
        window.$('#edit_cover_modal').modal('hide');
        getProfileData();
        setshowingLoader(false)
        setchooseimage(false)
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        setcoverphoto(Banner)
      }
    } else {
      setchooseimage(false)
      setshowingLoader(false)
      setvalidateError(error.errors)

    }
  } else {
    if (isEmpty(error)) {
      setshowingLoader(true)
      setchooseimage(true)
      setvalidateError('')
      var coverimg = await coverImage(reqdata)
      if (coverimg && coverimg.userValue != undefined) {
        document.getElementById('edit_cover_modal_close').click()
        setshowingLoader(false)
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        setcoverphoto(Banner)
      }

    } else {
      setshowingLoader(false)
      setchooseimage(false)
      setvalidateError(error.errors)
    }
  }
}

const followFun = async (followerAddress) => {
 

  const currAddr =MyItemAccountAddr_Details.curraddress;
  let reqData = {
    curraddress: currAddr,
    followeraddress: followerAddress 
  }
  var data = await followUnfollow(reqData);
  if (data && data.follower && data.follower.success === true) {
    if (data.follower.message)
      toast.success(data.follower.message, toasterOption)
  }
  checkFollowUser();
  // //("<<<<<dd>>>>>",data)
}
const checkFollowUser = async () => {

  const currAddr = MyItemAccountAddr_Details.curraddress;
  let reqData = {
    curraddress: currAddr,
    followeraddress: UserAccountAddr
  }
  var data = await checkFollower(reqData);
  if (data && data.follower && data.follower.success === true) {
    if (data.follower.message)
      setFollowButton(data.follower.message)
  }
}
const getfollowers1 = async () => {
 
  const currAddr = MyItemAccountAddr
  let reqData = {
    curraddress: currAddr,
    tab: "follower"
  }
  var data = await getFollowers(reqData);
   if (data && data.follower && (data.follower.list).length!=0) {
    setFollowList(data.follower.list);
  }
}


const Tab_Activity = async (data) => {
 
  const currAddr = MyItemAccountAddr_Details.curraddress;
  let reqdata = {
    currAddr: currAddr,
    // tab : data
  }

  if (currAddr) {
    var noti = await notifications(reqdata)
    if (noti) {
      if (noti.data && noti.data.data) {
        //////console.log("notification val1", (noti))
        set_Activity_Data(noti.data.data)
        set_Activity_Count(noti.data.count)
        //////console.log("ywqetwqueytwqetwqeqwu", noti.data.count)
      }

    }

  }
}
const getfollowing = async () => {
  const currAddr = MyItemAccountAddr;
    let reqData = {
    curraddress: currAddr,
    tab: "following"
  }
  var data = await getFollowers(reqData);
  if (data && data.follower && (data.follower.list).length!=0) {
    setFollowingList(data.follower.list);
  }
}
const statusChangeactivity = async (data) => {
  var reqdata = {
    currAddr: (UserAccountAddr).toLowerCase(),
    tokenCounts: data.tokenCounts,
    _id: data._id
  }
  var noti = await notificationStatusChange(reqdata)
  //////console.log("qweiqwueiqwueiouqeuqw", noti)
}

const CoverImage = () =>{
  return(
    <div className="items_bg">
    <img alt="profile" src={coverimage}
     className="img-fluid items_bg_img" id="items_bg_img" />
    <div className="container edit_cover_container">
   {
    (isEmpty(paramAddress) && isEmpty(paramUsername))  
    && <p className="edit_cover_text" data-toggle="modal" data-target="#edit_cover_modal">Edit cover</p>
   }
   </div>
   </div>
  )
}

useEffect(() => {
  CoverImage()
},[coverimage])

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
 
  <div className={classes.pageHeader + " inner_pageheader items_header"}>
  <div id="AfterWalletConnected_two" onClick={() => AfterWalletConnected_two()}>&nbsp;</div>
 
   <div>
   <GridContainer className="mx-0">
    <GridItem xs={12} sm={12} md={12} className="px-0">
    <CoverImage/>
    </GridItem>
   </GridContainer>
   </div>
   <div>
   <GridContainer className="mx-0">
    <GridItem xs={12} sm={12} md={12} className="px-0">
    <div className="items_bg_pink">
     <div className="item_prof">
     <div className="item_prof_img">
      {MyItemAccountAddr_Details && MyItemAccountAddr_Details.image!="" &&
     <img src={  `${config.Back_URL}/images/${MyItemAccountAddr_Details._id}/${MyItemAccountAddr_Details.image}` } alt="profile" className="img-fluid items_profile" />}
     {
      MyItemAccountAddr_Details && MyItemAccountAddr_Details.image==""&&
      //  <Avatars item={MyItemAccountAddr_Details.curraddress}/>
      <Avatars classValue="img-fluid items_profile"/>
     }
     </div>
     </div>
     <p className="mt-4">
     {(MyItemAccountAddr_Details && MyItemAccountAddr_Details.name) && <p><span className="address_text">{MyItemAccountAddr_Details.name}</span></p>}
     </p>
     <p className="d-flex">
     <a target="_blank" href={`https://bscscan.com/address/${MyItemAccountAddr_Details && MyItemAccountAddr_Details.curraddress}`}>
     <span className="address_text_sm word_brak_text_inline_new">{MyItemAccountAddr_Details && MyItemAccountAddr_Details.curraddress}</span>
     </a>
     <span>
       
     <CopyToClipboard text={MyItemAccountAddr_Details.curraddress} onCopy={() => copyText('invite link', MyItemAccountAddr_Details.curraddress)}>
      <i className="fas fa-copy notes_fa"></i>
      </CopyToClipboard>
     </span>
     </p>
     {MyItemAccountAddr_Details && MyItemAccountAddr_Details.personalsite &&
                        <p className="px-3 text-dark text-center">
                          Personal site : <a href={`${MyItemAccountAddr_Details.personalsite}`} target="_blank"><span className="address_text_desclink">{MyItemAccountAddr_Details && (MyItemAccountAddr_Details.personalsite).split('/')[2]}</span></a>
                        </p>
                      }
      <div>
                      <div className="mt-3  ">
                        <p className="mb-1 myownnnn">
                          {(MyItemAccountAddr_Details.instagram && MyItemAccountAddr_Details.instagram != "") ?
                            <a href={`${MyItemAccountAddr_Details.instagram}`} target="_blank">
                              <span className="pl-3"> <i className="fab fa-instagram notes_fa_fac mr-2"></i>
                                {(MyItemAccountAddr_Details.instagram).split('/')[3]}</span> </a> : null}
                          {(MyItemAccountAddr_Details.twitter && MyItemAccountAddr_Details.twitter != "") ?
                            <a href={`${MyItemAccountAddr_Details.twitter}`} target="_blank">
                              <span className="pl-3">
                                <i className="fab fa-twitter notes_fa_fac mr-2"></i>
                                {(MyItemAccountAddr_Details.twitter).split('/')[3]}</span> </a> : null}

                          {(MyItemAccountAddr_Details.facebook && MyItemAccountAddr_Details.facebook != "") ?
                            <a href={`${MyItemAccountAddr_Details.facebook}`} target="_blank">
                              <span className="pl-3"> <i className="fab fa-facebook-f notes_fa_fac mr-2"></i>
                                {(MyItemAccountAddr_Details.facebook).split('/')[3]}</span> </a> : null}
                          {(MyItemAccountAddr_Details.youtube && MyItemAccountAddr_Details.youtube != "") ?
                            <a href={`${MyItemAccountAddr_Details.youtube}`} target="_blank">
                              <span className="pl-3">
                                <i className="fab fa-youtube  notes_fa_fac mr-2"></i>
                                {(MyItemAccountAddr_Details.youtube).split('/')[3]}</span> </a> : null
                          }
                        </p>
                      </div>
                      </div>
                      <p className="px-3 text-center">
                        <span className="address_text_desc">{MyItemAccountAddr_Details && MyItemAccountAddr_Details.bio}</span>
                      </p>
     <div className="mt-3 d-flex align-items-center">
     {/* <Button className="btn_outline_red">Edit Profile</Button> */}
     {
    (MyItemAccountAddr_Details.curraddress == UserAccountAddr)
     ? <Link className="theme-btn flex_btn" to="/edit-profile">Edit Profile</Link> 
      : 
      <button className={'theme-btn flex_btn'} onClick={() => followFun(UserAccountAddr)}> 
       {followButton}
      </button>
     }
     
      <button class="bg_red_icon" type="button" data-toggle="modal" data-target="#share_modal1">
       <i class="fas fa-share"></i>
      </button>
     {/* <div class="dropdown">
      <button class="bg_red_icon" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
       <i class="fas fa-ellipsis-h"></i>
      </button>
      <div class="dropdown-menu dd_trans dropdown-menu-right" aria-labelledby="dropdownMenuButton">
       <a class="dropdown-item" href="#" data-toggle="modal" data-target="#report_page_modal">Report Page</a>
      </div>
     </div> */}
     </div>
     <div className="container">
     <Scrollbars style={{ height: 130 }} className="tab_style_texg">
     <nav className="masonry_tab_nav mt-4 pb-0 items_tab_outer">
     <div className="nav nav-tabs masonry_tab primary_tab items_tab" id="nav-tab" role="tablist">
     {/* <div className="item_tab_inner_bg"> */}
     <a className="nav-link active" id="onsale-tab" data-toggle="tab" href="#onsale" role="tab" aria-controls="onsale" aria-selected="true" onClick={() => Tab_Click('onsale')}>
      <div className="tab_head">OnSale</div>
      <div className="tab_count">{OnSale_List && OnSale_List.length}</div>
     </a>
     <a className="nav-link" id="collectibles-tab" data-toggle="tab" href="#collectibles" role="tab" aria-controls="collectibles" aria-selected="false" onClick={() => Tab_Click('collectibles')}>
      <div className="tab_head">Collectibles</div>
      <div className="tab_count">{Collectibles_Count}</div>
     </a>
     <a className="nav-link" id="created-tab" data-toggle="tab" href="#created" role="tab" aria-controls="created" aria-selected="false" onClick={() => Tab_Click('created')}>
      <div className="tab_head">Created</div>
      <div className="tab_count">{Created_Count}</div>
     </a>
     <a className="nav-link" id="liked-tab" data-toggle="tab" href="#liked" role="tab" aria-controls="liked" aria-selected="false" onClick={() => Tab_Click('liked')}>
      <div className="tab_head">Liked</div>
      <div className="tab_count">{Liked_Count}</div>
     </a>
     <a className="nav-link" id="activity-tab" data-toggle="tab" href="#activity" role="tab" aria-controls="activity" aria-selected="false" onClick={()=>Tab_Activity()}>
      <div className="tab_head">Activity</div>
      <div className="tab_count">{Activity_Count}</div>
     </a>
     <a className="nav-link" id="following-tab" data-toggle="tab" href="#following" role="tab" aria-controls="following" aria-selected="false">
      <div className="tab_head">Following</div>
      <div className="tab_count">{ followingList && followingList.length}</div>
     </a>
     <a className="nav-link" id="followers-tab" data-toggle="tab" href="#followers" role="tab" aria-controls="followers" aria-selected="false">
      <div className="tab_head">Follower</div>
      <div className="tab_count">{ followList && followList.length}</div>
     </a>
    
     {/* </div> */}
     </div>
    </nav>
    </Scrollbars>
    </div>
    </div>
    </GridItem>
   </GridContainer>
   </div>
   <div className="container">
   <GridContainer>
    <GridItem xs={12} sm={12} md={12}>
   
    <div className="tab-content explore_tab_content mt-2 pb-5" id="nav-tabContent">
     <div className="tab-pane fade show active" id="onsale" role="tabpanel" aria-labelledby="onsale-tab">
     <div className="proposal_panel_overall">
      
      <div className="text-center py-3">
      {(OnSale_Count > 0 || OnSale_List.length > 0)?(
      <div className="row mx-0">
      {
         OnSale_List.map((item) => {
        return (
          <div className="col-12 col-sm-6 col-lg-4 col-xl-3 masonry mb-4">
     
          <TokenItem
          item={item}
          UserAccountAddr={UserAccountAddr}
          UserAccountBal={UserAccountBal}
          WalletConnected={WalletConnected}
        /></div>
        )
         })
       }
      </div>
     ):(
      <div className="text-center py-3 d-none no_items_row">
       <p className="not_found_text">No items found</p>
       <p className="not_found_text_sub">Come back soon! Or try to browse something for you on our marketplace</p>
       <div className="mt-3">
        <Button className="connect_btn">Browse Marketplace</Button>
       </div>
      </div>
     )}
     </div>
     </div>
     </div>
     <div className="tab-pane fade" id="collectibles" role="tabpanel" aria-labelledby="collectibles-tab">
     <div className="proposal_panel_overall">
     
      <div className="text-center py-3">
      {(Collectibles_Count > 0 || Collectibles_List.length > 0) ?(
      <div className="row mx-0">
      {
         Collectibles_List.map((item) => {
        return (
          <div className="col-12 col-sm-6 col-lg-4 col-xl-3 masonry mb-4">
     
          <TokenItem
                            item={item}
                            UserAccountAddr={UserAccountAddr}
                            UserAccountBal={UserAccountBal}
                            WalletConnected={WalletConnected}
                          /></div>
        )
         })
       }
      </div>
      ):(
      <div className="text-center py-3 d-none no_items_row">
       <p className="not_found_text">No items found</p>
       <p className="not_found_text_sub">Come back soon! Or try to browse something for you on our marketplace</p>
       <div className="mt-3">
        <Button className="connect_btn">Browse Marketplace</Button>
       </div>
      </div>
      )}
      </div>
     </div>
     </div>
 
     <div className="tab-pane fade" id="created" role="tabpanel" aria-labelledby="created-tab">
     <div className="proposal_panel_overall">
      <div className="text-center py-3">
      {(Created_List > 0 || Created_List.length > 0) ?(
      <div className="row mx-0">
      {
         Created_List.map((item) => {
        return (
          <div className="col-12 col-sm-6 col-lg-4 col-xl-3 masonry mb-4">
     
          <TokenItem
          item={item}
          UserAccountAddr={UserAccountAddr}
          UserAccountBal={UserAccountBal}
          WalletConnected={WalletConnected}
        /></div>
        )
         })
       }
      </div>
      ):(
      <div className="text-center py-3 d-none no_items_row">
       <p className="not_found_text">No items found</p>
       <p className="not_found_text_sub">Come back soon! Or try to browse something for you on our marketplace</p>
       <div className="mt-3">
        <Button className="connect_btn">Browse Marketplace</Button>
       </div>
      </div>
      )}
      </div>
     </div>
     </div>
 
     <div className="tab-pane fade" id="liked" role="tabpanel" aria-labelledby="liked-tab">
     <div className="proposal_panel_overall">
      <div className="text-center py-3">
      {(Liked_Count > 0 || Liked_List.length > 0) ?(
      <div className="row mx-0">
      {
         Liked_List.map((item) => {
        return (
          <div className="col-12 col-sm-6 col-lg-4 col-xl-3 masonry mb-4">
     
          <TokenItem
          item={item}
          UserAccountAddr={UserAccountAddr}
          UserAccountBal={UserAccountBal}
          WalletConnected={WalletConnected}
        /></div>
        )
         })
       }
      </div>
      ):(
      <div className="text-center py-3 d-none no_items_row">
       <p className="not_found_text">No items found</p>
       <p className="not_found_text_sub">Come back soon! Or try to browse something for you on our marketplace</p>
       <div className="mt-3">
        <Button className="connect_btn">Browse Marketplace</Button>
       </div>
      </div>
      )}
      </div>
     </div>
     </div>
     <div className="tab-pane fade" id="activity" role="tabpanel" aria-labelledby="activity-tab">
     <div className="proposal_panel_overall">
     
      
      {(Activity_Count>0) ?
       
       (Activity_Data.map((item)=>{
         //console.log("adslkdjlaskdjaslkdjlasjldjklasjdlkaskld",Activity_Data)
         return(
      <div className="" onClick={()=>statusChangeactivity(item)}>
      <div className="row">
       <div className="col-12 col-md-10 col-lg-8 col-xl-8 mx-auto">
       <div className="card activty_card my-3">
      <div className="card-body">
      <div className="media follow_media activity_media">
      <div className="img_tick_div">
      {/* <span class="img_tick img_tick_lg"><img src={require("../assets/images/act_right.png")} /></span> */}
      <div className="img_prgo_re mr-2">
     {
     item.touserField&&item.touserField.image!=""&&
      <img src={`${config.Back_URL}/images/${item.touserField._id}/${item.touserField.image}`} alt="User" className="img-fluid img_user_new" />}
      {
      item.touserField===undefined || isEmpty(item.touserField) || item.touserField.image==""&&
      //  <Avatars item={MyItemAccountAddr_Details.curraddress}/>
      <Avatars classValue="img-fluid img_user_new"/>
     }
      </div>
      
      </div>
       <div className="media-body flex_body">
       <div>
       {item.to&&<div onClick={()=>history.push(`/user/${item.to}`)}> <p className="my-0 media_text" title={(item.touserField&&item.touserField.name!="")?item.touserField.name:item.to}>{(item.touserField&&item.touserField.name!="")?item.touserField.name:item.to&&((item.to))}</p></div>}
                    {item.activity&&<div onClick={()=>history.push(`/info/${item.tokenCounts}`)}><p className="mt-0 media_num mt-0"><b>{item.tokenField&&item.tokenField.tokenName!=""&&item.tokenField.tokenName}</b> {item.activity}</p></div>}
					{item.from&&	<div onClick={()=>history.push(`/user/${item.from}`)}><p className="my-0 media_text" title={(item.userField&&item.userField.name!="")?item.userField.name:(item.from)}>{(item.userField&&item.userField.name!="")?item.userField.name:(item.from)}</p></div>	}
                   
    
       </div>
      
       </div>
     </div>
      </div>
      </div>
 
     
       </div>
      </div>
     
 
      </div>)
    
  }))
      :
      <div className="text-center py-3  no_items_row">
      <p className="not_found_text">No items found</p>
      <p className="not_found_text_sub">Come back soon! Or try to browse something for you on our marketplace</p>
      <div className="mt-3">
       <Button className="connect_btn">Browse Marketplace</Button>
      </div>
      </div>}
 
     </div>
     </div>
     <div className="tab-pane fade" id="following" role="tabpanel" aria-labelledby="following-tab">
                          <div className="proposal_panel_overall">
                          {followingList&&followingList.length==0?
                            <div className="text-center py-3 no_items_row">
                              <p className="not_found_text">No items found</p>
                              <p className="not_found_text_sub">Come back soon! Or try to browse something for you on our marketplace</p>
                              <div className="mt-3">
                                <Button className="connect_btn">Browse Marketplace</Button>
                              </div>
                            </div>
                            :
                            <div className="py-3">
                              <div className="row">
                                <div className="col-12 col-md-10 col-lg-8 col-xl-8 mx-auto">
                                  <div className="row justify-content-center">
                                  {followingList&&followingList.map((User)=>{ 
                                       return <div className="col-12 col-md-6 col-xl-4 mb-4">
                                          <div className="media follow_media activity_media">
                                            <div className="img_tick_div">
                                                <div className="img_prgo_re mr-2">
                                                {User&&User.user&&!isEmpty(User.user)&&User.user.image&&User.user.image!=""?
                                                  <a href={(User.user.customurl&&User.user.customurl!="")?config.Front_URL+'/'+User.user.customurl:config.Front_URL+'/user/'+User.user.curraddress}>
                                                <img src={`${config.Back_URL}/images/${User.user._id}/${User.user.image}`} alt="User" className="img-fluid img_user_new" /></a>
                                                :  
                                                <a href={(User.user.customurl&&User.user.customurl!="")?config.Front_URL+'/'+User.user.customurl:config.Front_URL+'/user/'+User.user.curraddress}>                                        
                                                <Avatars  item="img-fluid img_user_new" />                                      </a>
                                              }
                                              {
                                          User&&User.user&&isEmpty(User.user)&&
                                          <a href={config.Front_URL+'/user/'+User.followerAddress}>
                                          <Avatars  item="img-fluid img_user_new" />  </a>
                                        
                                        }
                                              </div>
                                            </div>
                                            <div className="media-body flex_body">
                                              <div>
                                              {
                                               
                                               User&&User.user&&!isEmpty(User.user)?
                                                <>
                                                 <p className="mt-0 media_num mt-0">You Started following</p>
                                                      <a href={(User.user.customurl&&User.user.customurl!="")?config.Front_URL+'/'+User.user.customurl:config.Front_URL+'/user/'+User.user.curraddress}>
                                                <p className="my-0 media_text">{User.user.name!=""?User.user.name:String(User.user.curraddress).slice(0,12).concat('....')}</p></a>
                                               </>
                                              : <> 
                                              <p className="mt-0 media_num font_14 mb-0">You Started Following  </p> 
                                              <a href={config.Front_URL+'/user/'+User.followerAddress}>
                <p className="my-0 media_text" title={'User :'+ User.followerAddress }>{(User.followerAddress).slice(0,10).concat("...")}</p>
                                             
                                             </a> </>
                                              }
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        //   </div>
                                        //  </div>
                                            })
                                    }
                                  </div>
                                </div>
                              </div>
      
                            </div>
      }
                          </div>
                        </div>
                        <div className="tab-pane fade" id="followers" role="tabpanel" aria-labelledby="followers-tab">
                          <div className="proposal_panel_overall">
                          {followList&&followList.length==0?
                            <div className="text-center py-3  no_items_row">
                              <p className="not_found_text">No items found</p>
                              <p className="not_found_text_sub">Come back soon! Or try to browse something for you on our marketplace</p>
                              <div className="mt-3">
                                <Button className="connect_btn">Browse Marketplace</Button>
                              </div>
                            </div>:
                            <div className="py-3">
                              <div className="row">
                                <div className="col-12 col-md-10 col-lg-8 col-xl-8 mx-auto">
      
                                {followList&&followList.map((User)=>{
                                     return <div className="row justify-content-center">
                                        <div className="col-12 col-md-6 col-xl-4 mb-4">
                                          <div className="media follow_media activity_media">
                                            <div className="img_tick_div">
                                               <div className="img_prgo_re mr-2">
                                               {User&&User.user&&!isEmpty(User.user)&&User.user.image&&User.user.image!=""?
                                        <a href={(User.user.customurl&&User.user.customurl!="")?config.Front_URL+'/'+User.user.customurl:config.Front_URL+'/user/'+User.user.curraddress}>
                                                <img src={`${config.Back_URL}/images/${User.user._id}/${User.user.image}`} alt="User" className="img-fluid img_user_new" />
                                                </a>
                                                :
                                                <a href={(User.user.customurl&&User.user.customurl!="")?config.Front_URL+'/'+User.user.customurl:config.Front_URL+'/user/'+User.user.curraddress}>
                                                <Avatars  item="img-fluid img_user_new" />
                                                
                                            </a>}
                                          {
                                          User&&User.user&&isEmpty(User.user)&&
                                         
          
                                      
                                             <a href={config.Front_URL+'/user/'+User.userAddress}>
                                          <Avatars  item="img-fluid" />  </a>
                                        
                                        }
                                              </div>
                                              {/* <img src={require("../assets/images/masonary_02.png")} alt="User" className="img-fluid mr-3 img_user_new" /> */}
                                            </div>
                                            <div className="media-body flex_body">
                                              <div>
                                              {
                                               
                                               User&&User.user&&!isEmpty(User.user)?<> 
                                               
                                               <a href={(User.user.customurl&&User.user.customurl!="")?config.Front_URL+'/'+User.user.customurl:config.Front_URL+'/user/'+User.user.curraddress}>
                                                <p className="my-0 media_text">{User.user.name!=""?User.user.name:String(User.userAddress).slice(0,10).concat('...')}</p></a>
                                              
                                                <p className="mt-0 media_num mt-0">Started following you</p>
                                                </>
                                                :
                                                <> 
                                               
                                               <a href={config.Front_URL+'/user/'+User.userAddress}>
                                                <p className="my-0 media_text">{String(User.userAddress).slice(0,10).concat('...')}</p></a>
                                              
                                                <p className="mt-0 media_num mt-0">Started following you</p>
                                                </>}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                })
                                  }
                                </div>
      
                              </div>
                            </div>
                          }
                          </div>
                        </div>

     
    
 
   
    </div>
    </GridItem>
   </GridContainer>
   </div>
  </div>
  </div>
  <Footer />
 
  {/* edit_cover Modal */}
  <div class="modal fade primary_modal" id="edit_cover_modal" tabindex="-1" role="dialog" aria-labelledby="edit_cover_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
   <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
   <div class="modal-content">
    <div class="modal-header text-center">
    <h5 class="modal-title" id="edit_cover_modalLabel_1">Update cover</h5>
    <h5 class="modal-title d-none" id="edit_cover_modalLabel_2">Follow Steps</h5>
 
    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
     <span aria-hidden="true">&times;</span>
    </button>
    </div>
    <div class="modal-body">
    <div className="update_cover_div_1" id="update_cover_div_1">
     <p className="mt-0 approve_desc text-center mb-4">Upload new cover for your profile page. We recommended to upload images in 1140×260 resolution</p>
     <form className="text-center">
     <Button className="file_btn theme-btn" disabled={chooseimage}>Choose image
      <input 
       className="inp_file" 
       type="file" 
       name="file" 
       name="coverimage" 
       id="coverphoto"  
       onChange={ (e)=>handleFile(e) } 
      />
     </Button>
     </form>
     { validateError.file && <span className="text-danger">{validateError.file}</span>   }
    </div>
   
    </div>
   </div>
   </div>
  </div>
  {/* end edit_cover modal */}
 
  {/* Choose Collection Modal */}
  <div class="modal fade primary_modal" id="report_page_modal" tabindex="-1" role="dialog" aria-labelledby="choose_collection_modalCenteredLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
   <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
   <div class="modal-content">
    <div class="modal-header text-center">
    <h5 class="modal-title" id="report_page_modalLabel">Report This Profile?</h5>
    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
     <span aria-hidden="true">&times;</span>
    </button>
    </div>
    <div class="modal-body">
    <form className="edit_profile_form">
     <p className="font_16 font_600 line_20 mb-1 text_drk_bl">Tell us how this user violates the rules of the site</p>
     <div className="form-row mt-3">
     <div className="form-group col-md-12">
      <label className="primary_label" htmlFor="name">Message</label>
      <textarea class="form-control" id="msg" rows="3" placeholder="Tell us some details"></textarea>
     </div>
     </div>
     <div className="text-center mt-3">
     <Button className="primary_btn btn-block w-100">Submit</Button>
     </div>
    </form>
    </div>
   </div>
   </div>
  </div>
 
 
  <div class="modal fade primary_modal" id="share_modal1" tabindex="-1"
          role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="share_modalCenteredLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
            <div class="modal-content">
              <div class="modal-module">
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

                        <TwitterShareButton
                          title={`${(MyItemAccountAddr_Details.name  != "") ? MyItemAccountAddr_Details.name : MyItemAccountAddr_Details.curraddress}`}
                          url={`${config.Front_URL}/user/${MyItemAccountAddr_Details.curraddress}`}
                          hashtags={config.shareTag}
                          via={`${config.Front_URL}`}
                        >
                          <i class="fab fa-twitter"></i>
                          <p>Twitter</p>


                        </TwitterShareButton>

                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3 px-1">
                      <div className="text-center icon_div">

                        <TelegramShareButton
                         title={`${(MyItemAccountAddr_Details.name  != "") ? MyItemAccountAddr_Details.name : MyItemAccountAddr_Details.curraddress}`}
       url={`${config.Front_URL}/user/${MyItemAccountAddr_Details.curraddress}`}
      hashtags={config.shareTag}
                          via={`${config.Front_URL}`}
                        >

                          <i class="fab fa-telegram-plane"></i>
                          <p>Telegram</p>

                        </TelegramShareButton>

                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3 px-1">
                      <div className="text-center icon_div">
                        <FacebookShareButton
                          title={`${(MyItemAccountAddr_Details.name  != "") ? MyItemAccountAddr_Details.name : MyItemAccountAddr_Details.curraddress}`}
                          url={`${config.Front_URL}/user/${MyItemAccountAddr_Details.curraddress}`}
                             hashtags={config.shareTag}
                          via={`${config.Front_URL}`}
                        >
                          <i class="fab fa-facebook-f"></i>
                          <p>Facebook</p>
                        </FacebookShareButton>

                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3 px-1">
                      <div className="text-center icon_div">
                        <WhatsappShareButton
                           title={`${(MyItemAccountAddr_Details.name  != "") ? MyItemAccountAddr_Details.name : MyItemAccountAddr_Details.curraddress}`}
         url={`${config.Front_URL}/user/${MyItemAccountAddr_Details.curraddress}`}
        hashtags={config.shareTag}
                          via={`${config.Front_URL}`}
                        >
                          <i class="fab fa-whatsapp"></i>
                          <p>Whatsapp</p>
                        </WhatsappShareButton>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
     
   
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
  <Modal
          isOpen={modalopen}
          //onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
            <div>
              <div className='text-center'>
            <img src={BNB} alt="logo" className="img-fluid" />
            </div>
            <p className='text-dark'>Loading...Please Wait</p>
            </div>

        </Modal>
   </div>
  );
  }
  