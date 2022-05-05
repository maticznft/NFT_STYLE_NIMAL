/*eslint-disable*/
import React, { useEffect, useState, useRef } from "react";
import { Notifications, AccountBalanceWallet } from '@material-ui/icons';
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
// react components for routing our app without refresh
import { Link, useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";

// @material-ui/icons
import { Apps, CloudDownload } from "@material-ui/icons";

// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
// import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";

import { Scrollbars } from 'react-custom-scrollbars';
import ConnectWallet from '../../views/separate/Connect-Wallet';
import Avatars from "views/Avatar";
import { notifications, notificationStatusChange } from '../../actions/v1/report';
import {
  getCurAddr,
  getprofile,
} from '../../actions/v1/user';
import config from '../../lib/config';
import isEmpty from '../../lib/isEmpty'
import { getSearchList } from "actions/v1/user";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { Account_Connect, Account_disConnect } from "actions/redux/action";
toast.configure();
const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const classes = useStyles();
  const toggletheme = () => {


    document.getElementById("root").classList.toggle('light_theme');
    var usebody = document.getElementsByClassName("mobile_nav");
    for (var j = 0; j < usebody.length; j++) {
      usebody[j].classList.toggle('dark_theme')
    }


  };
  const dispatch = useDispatch();
  const Wallet_Details = useSelector(state => state.wallet_connect_context);
  const [Profile, setProfile] = React.useState();
  const [UserAccountBal, Set_UserAccountBal] = React.useState(Wallet_Details.UserAccountBal);
  const [UserAccountAddr, Set_UserAccountAddr] = React.useState(Wallet_Details.UserAccountAddr);
  const [WalletConnected, Set_WalletConnected] = React.useState('false');
  const [Accounts, Set_Accounts] = React.useState('');
  const [AddressUserDetails, Set_AddressUserDetails] = useState({});
  const [notificationss, setnotificationss] = useState([])
  const [searchItem, setSearchItem] = useState([])
  const [UsersearchItem, setUserSearchItem] = useState([])
  const [keyword, setKeyword] = useState();
  const history = useHistory();
   const[Wen_Bln,set_Wen_Bln]=useState(0);
  const [convertVal, setConvertVal] = React.useState(0);
 const [Service_Fee, set_Service_Fee] = useState(0);const [providerss, set_providers] = useState(null)


  var tab = 'activity';

  const searchCall = async () => {
    // window.$('#searchmneu_dd').show();
    let postData = {
      keyword: keyword
    }
    var data = await getSearchList(postData);
    setSearchItem(data.searchlist);
  }

  const seachByKeyword = () => {
    history.push({ pathname: '/Search', search: `?search=${keyword}`, key: Math.floor((Math.random() * 100) + 1) })
    if (window.location.pathname === '/Search')
      location.reload();
  }



  const statusChangeactivity = async (data) => {
    // alert('vanthutan')
    var reqdata = {
      currAddr: (UserAccountAddr).toLowerCase(),
      tokenCounts: data.tokenCounts,
      _id: data._id
    }
    var noti = await notificationStatusChange(reqdata)
    //("qweiqwueiqwueiouqeuqw", noti)
  }

  useEffect(() => {
    // Set_WalletConnected(true)
    if (isEmpty(localStorage)) {
      Disconnect()
    }
    getProfileData()
    notification(UserAccountAddr);
    //console.log("dbewh.ndikninjmiubhuibi", UserAccountBal)
  }, [UserAccountAddr]);



  const Disconnect = async () => {
    if(localStorage.walletconnect!=null&&localStorage.walletConnectType=='wc'){
      await (providerss).disconnect()
      localStorage.removeItem('walletconnect')
      localStorage.removeItem('walletConnectType');
   
    }
    
    localStorage.removeItem('walletConnectType');
      config.providercon=null
      set_providers(null)
      Set_WalletConnected("false")
      Set_UserAccountAddr('')
      Set_UserAccountBal(0)
    
      
	}


  const Connectto = () => {
    localStorage.setItem('kethirthaya', 'true')
  }

  function datediff(first, second) {
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
  }

  const toggleUsermenu = () => {
    var useclass = document.getElementsByClassName("usemneu_dd");
    for (var i = 0; i < useclass.length; i++) {
      useclass[i].classList.toggle('d-none')
    }




  }

  // const toggleSearchmenu = async (event) => {
  // 	var useclass = document.getElementsByClassName("searchmneu_dd");
  // 	for (var i = 0; i < useclass.length; i++) {
  // 		useclass[i].classList.toggle('d-none')
  // 	}
  // 	let keywordVal = event.target.value;
  // 	setKeyword(keywordVal)
  // 	let postData = {
  // 		limit:3,
  // 		keyword: keywordVal
  // 	}
  // 	var data = await getSearchList(postData);
  // 	if (data && data.searchlist&&data.searchlist.items&&data.searchlist.items.list){
  // 		setSearchItem(data.searchlist.items.list);}
  // 		if (data && data.searchlist&&data.searchlist.users){
  // 			setUserSearchItem(data.searchlist.users);}

  // 	//console.log(">>>>>>>>>>>>>>", data.searchlist);
  // }
  const toggleSearchmenu = async (event) => {
    var useclass = document.getElementsByClassName("searchmneu_dd1");

    //console.log(">>>>>>>>>>>>>>", event.target.value.length);
    if (event.target.value.length == 1) {
      for (var c = 0; c < useclass.length; c++) {
        useclass[c].classList.remove('d-none');

      }
      // //console.log(">>>>>>>>>>>>>>",document.getElementById("searchmneu_dd").classList)
      // //console.log(">>>>>>>>>>>>>>searchmenu",document.getElementsByClassName("searchmneu_dd1").classList);
      // //console.log(">>>>>>>>>>>>>>",document.getElementById("searchmneu_dd").classList)
      // //console.log(">>>>>>>>>>>>>>searchmenu",document.getElementById("searchmneu_dd1").classList.remove('d-none'))
      // //console.log(">>>>>>>>>>>>>>searchmenu",document.getElementsByClassName("searchmneu_dd1").classList)
      // useclass.classList.remove('d-none');
    }
    if (event.target.value.length == 0) {
      // alert("2");
      for (var c = 0; c < useclass.length; c++) {
        useclass[c].classList.add('d-none');

      }
      // useclass.classList.add('d-none');
    }
    let keywordVal = event.target.value;
    setKeyword(keywordVal)
    let postData = {
      limit: 3,
      keyword: keywordVal
    }
    var data = await getSearchList(postData);
    if (data && data.searchlist && data.searchlist.items && data.searchlist.items.list) {
      setSearchItem(data.searchlist.items.list);
    }
    if (data && data.searchlist && data.searchlist.users) {
      setUserSearchItem(data.searchlist.users);
    }

    //console.log(">>>>>>>>>>>>>>data", data.searchlist);
  }


  const getProfileData = async () => {
    var addrchk = "";
    if (localStorage.uwat == 'mt') {
      if (window.ethereum) {
        var web3 = new Web3(window.ethereum)

        if (web3 !== undefined) {
          addrchk = web3.eth.defaultAccount
        }
      }
    }
    else {
      if (!isEmpty(UserAccountAddr)) {
        addrchk = String(UserAccountAddr).toLowerCase()
      }
      else {
        addrchk = String(config.address).toLowerCase()
      }
    }


    var currAddr = addrchk;
    let reqData = {
      currAddr
    }
    //console.log('profile data>>>>>>', reqData);
    var data = await getprofile(reqData);
    if (data.userValue) {
      //console.log('profile data>>>>>>', data.userValue);
      setProfile(data.userValue);
    }
  }


  async function AfterWalletConnected() {
    // if(UserAccountAddr == ''){
    //   getInit();
    // }
  }
  const notification = async (currAddr) => {
    //   alert(currAddr)
    // var currAddr = await getCurAddr();

    var reqdata = {
      currAddr: currAddr,
      limit: 12
    }
    // alert(WalletConnected,UserAccountAddr)
    if (currAddr) {
      var noti = await notifications(reqdata)
      //("notification val", noti)

      if (noti && noti.data && noti.data.data) {

        setnotificationss(noti.data.data)
      }

    }


  }
  const copyText = (a, b) => {
    toast.success('copied', config.toasterOption);

  }

  return (
    <List className={classes.list + " main_navbar ml-auto"}>
      {/* <ListItem className={classes.listItem}>
      <div className="search_inp_group">
        <input type="text" className="search_inp" placeholder="Search collections / creators" />
        <div className="search_inp_group_append">
          <i className="fas fa-search"></i>
        </div>
      </div>
      </ListItem> */}
      {/* <ConnectWallet
          Set_UserAccountAddr={Set_UserAccountAddr}
          UserAccountAddr={UserAccountAddr}
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


      <ListItem className={classes.listItem + " menu_dropdown dropdown_header_ul search_dd_ul"}>

        <div className="search_inp_group">
          <input type="search" id="search_inp" className="search_inp" placeholder="Search Collections/Creators" onChange={toggleSearchmenu} />
          {/* <button type="button" className="d-lg-none">
    <i class="fas fa-search"></i>
  </button> */}
        </div>
        <div className="noti_parent noti_parnt_user searchmneu_dd d-none searchmneu_dd1" id="searchmneu_dd1">
          <Scrollbars style={{ height: 350 }} className="nto_scrol_div">
            {searchItem.length != 0 && <p className="font_we_600">Items</p>}
            <ul className="noti_ul_dd">
              {
                searchItem && searchItem.map((item, index) =>
                  <li className="px-3">
                    <div className="media" onClick={() => { history.push(`/info/${item.tokenCounts}`) }}>
                      {
                        item.image != "" && (item.image.split('.').pop() == "mp4" ?
                          <video className="img-fluid mr-2 img_user_noti align-self-center" autoPlay loop muted controls data-reactid=".0.1.0.0" alt="Collections">
                            <source type="video/mp4" data-reactid=".0.1.0.0.0" src={item.ipfsimage != "" ? `${config.IPFS_IMG}/${item.ipfsimage}` : `${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} />
                          </video>
                          :
                          <img src={item.ipfsimage != "" ? `${config.IPFS_IMG}/${item.ipfsimage}` : `${config.Back_URL}/nftImg/${item.tokenCreator}/${item.image}`} alt="Collections" className="img-fluid mr-2 img_user_noti align-self-center" />
                        )}
                      {/* <img src={`${config.Back_URL}/nftImg/${item.tokenOwner}/${item.image}`} alt="User" className="img-fluid mr-2 img_user_noti align-self-center" /> */}
                      <div className="media-body flex_body">
                        <div>
                          <p className="mt-0 banner_desc_user mb-0 font_14 not_banner_dessc">{item.tokenName}</p>
                          <p className="mt-0 banner_desc_user mb-0 font_12 not_banner_dessc">

                            {(
                              item
                              && item.tokenowners_current
                              && item.tokenowners_current.tokenPrice > 0)
                              && <span>{item.tokenowners_current.tokenPrice} {config.currencySymbol}   </span>}
                            {(

                              item
                              && item.clocktime == null
                              && item.endclocktime == null
                              && item.tokenowners_current
                              && (item.tokenowners_current.tokenPrice == 0 || item.tokenowners_current.tokenPrice == null)
                              && <span> Open for Bid </span>)}

                            {
                              item
                              && item.clocktime != null
                              && item.endclocktime != null
                              && item.minimumBid
                              && item.minimumBid != 0
                              && <span>{item.minimumBid} {config.tokenSymbol}   </span>}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              }

            </ul>

            {UsersearchItem.length != 0 && <p className="font_we_600">Users</p>}
            <ul className="noti_ul_dd">
              {
                UsersearchItem && UsersearchItem.map((searchUser, list) =>
                  <li className="px-3">
                    <Link to={"/user/" + searchUser.curraddress}>
                      <div className="media">
                        <img src={require("../../assets/images/follower_1.png")} alt="User" className="img-fluid mr-2 user_ul_new align-self-center" />
                        <div className="media-body flex_body">
                          <div>
                            <p className="mt-0 banner_desc_user mb-0 font_14 not_banner_dessc">{searchUser.name}</p>
                            <p className="mt-0 banner_desc_user mb-0 font_12 not_banner_dessc">{(searchUser.count != 0) && searchUser.count + '  Followers'} </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                )
              }
            </ul>

          </Scrollbars>
          <div className="text-center">
            <button class="btn connect_btn search_btn_flex_align mx-auto" tabindex="0" type="button" onClick={() => { seachByKeyword() }}>
              <span>Search</span>
            </button>
          </div>
        </div>

      </ListItem>

      {/* <ListItem className={classes.listItem + " menu_dropdown dropdown_header_ul user_dd_ul ml-auto ser_ul"}>
     
      <div className="search_inp_group">
        <input type="text" className="search_inp" placeholder="Search collections / creators" onChange={toggleSearchmenu} />
        <div className="search_inp_group_append">
          <i className="fas fa-search"></i>
        </div>
      </div>
<div className="noti_parent noti_parnt_user searchmneu_dd d-none" id="searchmneu_dd">
<Scrollbars style={{ height: 350 }} className="nto_scrol_div">
  <p className="font_we_700">Items</p>
            <ul className="noti_ul_dd">
              <li className="px-3">
              <div className="media">
              
                  <img src={require("../../assets/images/collections_01.png")} alt="User" className="img-fluid mr-2 img_user_noti align-self-center" />
                  <div className="media-body flex_body">
                    <div>
                    <p className="mt-0 banner_desc_user mb-0 font_14 not_banner_dessc">Medication Time</p>
                    <p className="mt-0 banner_desc_user mb-0 font_12 not_banner_dessc">2.3 BNB received</p>
                    </div>
                   
                  </div>
                </div>
               
              </li>
              <li className="px-3">
              <div className="media">
              
                  <img src={require("../../assets/images/collections_02.png")} alt="User" className="img-fluid mr-2 img_user_noti align-self-center" />
                  <div className="media-body flex_body">
                    <div>
                    <p className="mt-0 banner_desc_user mb-0 font_14 not_banner_dessc">Autumn</p>
                    <p className="mt-0 banner_desc_user mb-0 font_12 not_banner_dessc">Auctions</p>
                    </div>
                   
                  </div>
                </div>
               
              </li>
              <li className="px-3">
              <div className="media">
              
                  <img src={require("../../assets/images/collections_03.png")} alt="User" className="img-fluid mr-2 img_user_noti align-self-center" />
                  <div className="media-body flex_body">
                    <div>
                    <p className="mt-0 banner_desc_user mb-0 font_14 not_banner_dessc">Qilin - Little Red Cap</p>
                    <p className="mt-0 banner_desc_user mb-0 font_12 not_banner_dessc">2.3B WENLAMBO($100) received</p>
                    </div>
                    
                  </div>
                </div>
               
              </li>
          
          
            </ul>

            <p className="font_we_700">Users</p>
            <ul className="noti_ul_dd">
              <li className="px-3">
              <div className="media">
              
                  <img src={require("../../assets/images/collections_02.png")} alt="User" className="img-fluid mr-2 user_ul_new align-self-center" />
                  <div className="media-body flex_body">
                    <div>
                    <p className="mt-0 banner_desc_user mb-0 font_14 not_banner_dessc">Qi</p>
                    <p className="mt-0 banner_desc_user mb-0 font_12 not_banner_dessc">169 followers</p>
                    </div>
                   
                  </div>
                </div>
               
              </li>
              <li className="px-3">
              <div className="media">
              
                  <img src={require("../../assets/images/collections_02.png")} alt="User" className="img-fluid mr-2 user_ul_new align-self-center" />
                  <div className="media-body flex_body">
                    <div>
                    <p className="mt-0 banner_desc_user mb-0 font_14 not_banner_dessc">Qi</p>
                    <p className="mt-0 banner_desc_user mb-0 font_12 not_banner_dessc">169 followers</p>
                    </div>
                   
                  </div>
                </div>
               
              </li>
              <li className="px-3">
              <div className="media">
              
                  <img src={require("../../assets/images/collections_02.png")} alt="User" className="img-fluid mr-2 user_ul_new align-self-center" />
                  <div className="media-body flex_body">
                    <div>
                    <p className="mt-0 banner_desc_user mb-0 font_14 not_banner_dessc">Qi</p>
                    <p className="mt-0 banner_desc_user mb-0 font_12 not_banner_dessc">169 followers</p>
                    </div>
                   
                  </div>
                </div>
               
              </li>
          
          
            </ul>
           
            </Scrollbars>
            <div className="text-center mb-3">
            <button class="btn btn_blue brtn_serac_mob" tabindex="0" type="button"><span><Link to='/search'>Search</Link></span></button>
            </div>
            </div>
   
</ListItem>
   */}

      <ListItem className={classes.listItem}>
        {/* <Link className={classes.navLink} to="/explore">Explore</Link> */}
        <Link className={classes.navLink} to="/">Explore</Link>
      </ListItem>

      <ListItem className={classes.listItem}>
        {/* <Link className={classes.navLink} to="/my-items">My items</Link> */}
        <Link className={classes.navLink} to={`/my-items`}>My items</Link>
      </ListItem>

      <ListItem className={classes.listItem}>
        <Link className={classes.navLink} to="/following">Following</Link>
           </ListItem>
      <ListItem className={classes.listItem}>
        <Link className={classes.navLink} to="/how-it-works">How It Works</Link>
      </ListItem>

      {/* BEFORE LOGIN */}

      {/* <ListItem className={classes.listItem + " ml-auto"}>
        <Button className={classes.navLink + " create_btn btn_header mr-cus-btn"} data-toggle="modal" data-target="#login_modal">
         <span> Login</span>
        </Button>
      </ListItem>

      <ListItem className={classes.listItem}>
        <Button className={classes.navLink + " grey_btn_sm btn_header"} data-toggle="modal" data-target="#register_modal">
        <span>Signup</span>
        </Button>
      </ListItem> */}
      {/* END BEFORE LOGIN */}

      {/* <ListItem className={classes.listItem + " menu_dropdown dropdown_header_ul"}>
        <CustomDropdown
          noLiPadding
          buttonText="Community"         
          dropdownList={[
                  
            <Link to="/Discussion" className={classes.dropdownLink}>
              Discussion
            </Link>,
           
          ]}
        />
      </ListItem> */}
      {
        Wallet_Details.UserAccountAddr!=""&&
            <ListItem className={classes.listItem}>
              <Link to="/create" className={classes.navLink + " create_btn create_brn_header mr-3"}>
                Create
              </Link>
            </ListItem>
      }
      {
        (UserAccountAddr == "" && localStorage.walletConnectType == undefined
             ) ?
          <ListItem className={classes.listItem}>
            <Button className={classes.navLink + " grey_btn_sm create_brn_header"} data-toggle="modal" data-target="#connect_modal">
              Connect
            </Button>
          </ListItem>
          :
          <>
         

            
              <ListItem className={classes.listItem + " menu_dropdown dropdown_header_ul noti_ul noti_tb_trans"}>
                <CustomDropdown
                  noLiPadding
                  buttonText={<div className="noti_online"><Notifications className="menu_icons" />
                    <span className="icon_txt">Notifications</span>
                    {notificationss.map((item) => {
                      return (
                        item.statusOpen == "new" &&
                        <span className="green_circle_dot"></span>
                      )
                    })}
                  </div>}
                  dropdownList={[
                    <div className="noti_parent noti_parent_new_noti">
                      <p className="noti_head d-flex justify-content-between pt-4 mb-3">
                        <span>Notifications</span>
                        {/* <Button className="create_btn see_all_btn p-2 font_12">See All</Button> */}
                      </p>
                      <Scrollbars style={{ height: 350 }} className="nto_scrol_div">
                        <ul className="noti_ul_dd">
                          {
                            notificationss.length != 0 ?
                              notificationss.map((item) => {
                                return (
                                  <li className="px-3" onClick={() => statusChangeactivity(item)}>
                                    <div className="media">
                                      {item.to &&
                                        <>
                                          {
                                            item
                                            && item.touserField
                                            && item.touserField.image
                                            && item.touserField.image != ""
                                            && <img onClick={() => history.push(item.touserField.customurl != "" ? `/:${item.touserField.customurl}` : `/user/${item.to}`)} src={`${config.Back_URL}/images/${item.touserField._id}/${item.touserField.image}`} alt="User" className="img-fluid mr-2 img_user_noti align-self-center" />

                                          }
                                          {
                                            item.touserField === undefined
                                            || item.touserField.image === undefined
                                            || item.touserField.image == ""
                                            && <Avatars onClick={() => history.push(item.touserField.customurl != "" ? `/:${item.touserField.customurl}` : `/user/${item.to}`)} classValue="img-fluid mr-2 img_user_noti align-self-center" />
                                          }
                                        </>}
                                      <div className="media-body flex_body">
                                        <div>
                                          <p className="mt-0 banner_desc_user mb-0 font_14 not_banner_dessc not_banner_dessc_new">

                                            {item.to
                                              && <span title={"User :  " + ((item.touserField && item.touserField.name != "") ? item.touserField.name : String(item.to))} className="user_noti_colr" onClick={() => history.push(item.touserField && item.touserField.customurl != "" ? `/${item.touserField.customurl}` : `/user/${item.to}`)}>
                                                @{(item.touserField && item.touserField.name != "") ? item.touserField.name : String(item.to).slice(0, 6).concat('...')}</span>
                                            }

                                            <span onClick={() => history.push(`/info/${item.tokenCounts}`)}>{item.tokenField && item.tokenField.tokenName != "" && item.tokenField.tokenName}</span> 	{item.activity}
                                            <span onClick={() => history.push(item.userField && item.userField.customurl != "" ? `/${item.userField.customurl}` : `/user/${item.from}`)} className="user_noti_colr" title={"Token Owner : " + ((item.userField && item.userField.name != "") ? item.userField.name : String(item.from))}
                                            > @{(item.userField && item.userField.name != "") ? item.userField.name : String(item.from).slice(0, 6).concat('...')}</span></p>
                                          <p className="mt-0 banner_user font_10 mb-0 banner_user_new">   {(datediff(new Date(item.created), new Date())) > 0 && (datediff(new Date(item.created), new Date())) + 'days ago'}{(datediff(new Date(item.created), new Date())) <= 0 && 'a days ago'}</p>

                                        </div>


                                      </div>
                                    </div>

                                  </li>)
                              })
                              :
                              <>
                                <p className="no_noti">No new notifications</p>
                                {/* <p className="mt-0 banner_user font_10 mb-0 banner_user_new">   {(datediff(new Date('2021-08-01T07:16:00.179Z'), new Date()))>0 && (datediff(new Date('2021-08-02T07:16:00.179Z'), new Date()))+'days ago'}{(datediff(new Date('2021-08-02T07:16:00.179Z'), new Date()))<=0 &&'a days ago'}</p> */}
                              </>
                          }

                        </ul>
                      </Scrollbars>



                    </div>
                  ]}
                />
              </ListItem>



          

            <ListItem className={classes.listItem + " menu_dropdown dropdown_header_ul user_dd_ul"} onClick={toggleUsermenu}>
              <button color="transparent" href="#" className={classes.navLink + " pl-cust-wal"}>
                <AccountBalanceWallet className="menu_icons" />
                <span className="icon_txt">Wallet</span>
              </button>
              <div className="noti_parent noti_parnt_user usemneu_dd d-none" id="usemneu_dd">
                <p className="noti_head pt-4 mb-0">
                {Profile&&Profile.image!=""?
                <img src={`${config.Back_URL}/images/${Profile._id}/${Profile.image}`} alt="User" className="img-fluid user_header mr-2" />
                  :
                  // <div className="img-fluid user_header mr-2">
                    <Avatars classValue="img-fluid user_header mr-2"></Avatars>

                  // </div>
                  }
                  <span>{Profile && Profile.name}</span>
                  {/* <span>Enrico Cole</span> */}
                </p>
                <div className="px-3">
                  <p className="info_des"> 
                  {UserAccountAddr.toString().slice(0, 15).concat('....')}
                  <CopyToClipboard text={UserAccountAddr} onCopy={() => copyText('invite link', UserAccountAddr)}>
                  <i className="fas fa-sticky-note notes_fa cur_pointer"></i>
                 </CopyToClipboard></p>
                   <div className="media header_media pt-0">
                    <img src={require("../../assets/images/bnb.png")} alt="User" className="img-fluid mr-3 coin_header" />
                    <div className="media-body flex_body">
                      <div>
                        <p className="mt-0 media_num">Balance</p>
                        <p className="balance_txt_header pt-0 mb-0">
                          <span>{Number(UserAccountBal).toFixed(config.toFixed)} {config.currencySymbol}</span>
                        </p>

                      </div>

                    </div>
                  </div>
                  {/* <div className="media header_media pt-0">
                    <img src={require("../../assets/images/bnb.png")} alt="User" className="img-fluid mr-3 coin_header" />
                    <div className="media-body flex_body">
                      <div>
                        <p className="mt-0 media_num">{config.tokenSymbol} Balance</p>
                        <p className="balance_txt_header pt-0 mb-0">
                          <span>{Number(Wen_Bln).toFixed(config.toFixed)} {config.tokenSymbol}</span>
                        </p>

                      </div>

                    </div>
                  </div> */}

                  <ul className="user_prof_ul mt-4 user_prof_ul_new">
                    <li>
                      <Link to="/edit-profile"><span><i class="fas fa-user mr-2"></i>My profile</span></Link>
                    </li>
                    <li>
                      <Link to="/my-items"><span><i class="fas fa-file-image mr-2"></i>My items</span></Link>
                    </li>
                    <li>
                      <Link to="#" onClick={() => { Disconnect() }}><span><i class="fas fa-sign-out-alt mr-2"></i>Disconnect</span></Link>
                    </li>
                  </ul>

                </div>




              </div>

            </ListItem>

          </>
      }

    </List>
  );
}
