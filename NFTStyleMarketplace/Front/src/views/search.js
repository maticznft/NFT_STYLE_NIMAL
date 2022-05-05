import React, { useEffect, useState } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import { Button, Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
// core components
import Header from "components/Header/Header.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import styled from "../../node_modules/styled-components";
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import { Link } from "react-router-dom";
import { Scrollbars } from 'react-custom-scrollbars';
import { getSearchList } from "actions/v1/user";
import Avatars from "./Avatar";
import ConnectWallet from './separate/Connect-Wallet';
import {
	getCurAddr
} from '../actions/v1/user';

import {
	CollectiblesList_Home
} from '../actions/v1/token';

import config from '../lib/config';
import isEmpty from "lib/isEmpty";
import TokenItem from "./separate/Token-Item";
import TokenCard from "./separate/TokenCard";
import TokenUserCard from "./separate/TokenUserCard";

import SearchCard from "./separate/SearchCard";
const dashboardRoutes = [];
const useStyles = makeStyles(styles);

// Scroll to Top
function ScrollToTopOnMount() {
useEffect(() => {
	window.scrollTo(0, 0);
}, []);
return null;
}
document && document.addEventListener('click', function(event) {
	if(document.readyState == "complete" && document.getElementById && document.getElementById("searchmneu_dd1") != null && document.getElementById("searchmneu_dd1").classList)
	{
	//alert(document.getElementById("usemneu_dd").classList)
	document.getElementById("searchmneu_dd1").classList.add('d-none');
	}
	if(document.readyState == "complete" && document.getElementById && document.getElementById("usemneu_dd") != null && document.getElementById("usemneu_dd").classList)
	{
	document.getElementById("usemneu_dd").classList.add('d-none');
	}
})

export default function Activity(props) {
const classes = useStyles();
const { ...rest } = props;
const [searchItem , setSearchItem] = useState([])
const [UsersearchItem, setUserSearchItem] = useState([])
const [UserAccountAddr, Set_UserAccountAddr] = React.useState('');
const [UserAccountBal, Set_UserAccountBal] = React.useState(0);
const [WalletConnected, Set_WalletConnected] = React.useState('false');
const [Accounts, Set_Accounts] = React.useState('');
const [AddressUserDetails, Set_AddressUserDetails] = useState({});
const [Service_Fee, set_Service_Fee] = useState(0);
const [keywords, setkeywords] = useState('');
const [providerss,set_providers]=useState(null)
const[Wen_Bln,set_Wen_Bln]=useState(0);
const [convertVal, setConvertVal] = React.useState(0);

useEffect(() => {
	//console.log("Searchin>>>>>>>>",keywords)
	searchCall();
},[props.location.search])



const searchCall = async () => {
		if (isEmpty(props.location.search))
			return false;
		
		var search = props.location.search; // could be '?foo=bar'
		var params = new URLSearchParams(search);
		var keyword = params.get('search')	
		setkeywords(keyword)
		
		let postData = {
			keyword : keyword ,
			limit:parseInt(config.limitMax)
		}
		var data = await getSearchList(postData);
		if(data && data.searchlist)
		{
			if(document && document.readyState)
			{
			var useclass = document.getElementById("search_inp").value;
			if(document.getElementById("search_inp").value != "")
			// document.getElementById("search_inp").value = ""
			if(document && document.getElementById && document.getElementById("searchmneu_dd"))
			{
			document.getElementById("searchmneu_dd").classList.add('d-none');
			}
			}
		}
		if (data && data.searchlist&&data.searchlist.items&&data.searchlist.items.list){
			setSearchItem(data.searchlist.items.list);}
			if (data && data.searchlist&&data.searchlist.users){
				setUserSearchItem(data.searchlist.users);}
		//('searchlist',data.searchlist)
	}
	const AfterWalletConnected = async () => {
		if (isEmpty(props.location.search))
			return false;
		
		var search = props.location.search; // could be '?foo=bar'
		var params = new URLSearchParams(search);
		var keyword = params.get('search')	
		setkeywords(keyword)
		
		let postData = {
			keyword : keyword ,
			limit:parseInt(config.limitMax)
		}
		var data = await getSearchList(postData);
		
		if (data && data.searchlist&&data.searchlist.items&&data.searchlist.items.list){
			setSearchItem(data.searchlist.items.list);}
			if (data && data.searchlist&&data.searchlist.users){
				setUserSearchItem(data.searchlist.users);}
		// //console.log('searchlist',data.searchlist)
	}

return (
	<div className="home_header">
		<div className="inner_page_bg">
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
	<ScrollToTopOnMount/>
	<div className={classes.pageHeader + " inner_pageheader inner_page_padding_big"}>
		<div>
		<div className="container">
		<div className="row justify-content-center">
			
			<div className="col-12 col-md-12 col-lg-12 mx-auto">
			<Scrollbars style={{ height: 90 }} className="tab_style_texg mx-3">
			<nav className="masonry_tab_nav mt-0 pt-0 pb-0 items_tab_outer">
			<div className="nav nav-tabs masonry_tab primary_tab items_tab activity_tab_with mx-auto" id="nav-tab" role="tablist">
			<a className="nav-link active" id="items-tab" data-toggle="tab" href="#items" role="tab" aria-controls="items" aria-selected="true">
				<div class="tab_head">Items</div>
				</a>                    
								<a className="nav-link" id="collections-tab" data-toggle="tab" href="#collections" role="tab" aria-controls="collections" aria-selected="false">
				<div class="tab_head">Users</div>
				</a>
				{/* <a className="nav-link" id="users-tab" data-toggle="tab" href="#users" role="tab" aria-controls="users" aria-selected="false">
				<div class="tab_head">Users</div>
				</a> */}
				{/* <a className="nav-link" id="collections-tab" data-toggle="tab" href="#collections" role="tab" aria-controls="collections" aria-selected="false">
				<div class="tab_head">Collections</div>
				</a> */}
			</div>
	</nav>
	</Scrollbars>
	<div className="tab-content explore_tab_content mt-1" id="nav-tabContent">
	<div className="tab-pane fade show active" id="items" role="tabpanel" aria-labelledby="items-tab">
		<div className="proposal_panel_overall">
			{searchItem.length==0?
			<>
			<div className="text-center py-3 no_items_row">
       <p className="not_found_text">No items found</p>
       <p className="not_found_text_sub">Come back soon! Or try to browse something for you on our marketplace</p>
       <div className="mt-3">
		   <Link to="/">
        <Button className="connect_btn">Browse Marketplace</Button>
		</Link>
       </div>
      </div>
     
			</>
			:                 
			<div className="row mx-0-xs">
				{
					searchItem.map((item,index) => 
					<div className="col-12 col-sm-6 col-lg-4 col-xl-3 masonry mb-4">

					<TokenItem
					item={item}
					UserAccountAddr={UserAccountAddr}
					UserAccountBal={UserAccountBal}
					WalletConnected={WalletConnected}
				      /></div>
					)
				}
				{/* <p color={'red'}>items</p> */}
			</div>}
		</div>
	</div>                
	
	<div className="tab-pane fade" id="collections" role="tabpanel" aria-labelledby="collections-tab">
	
	<div className="proposal_panel_overall">  
	<div className="row justify-content-center">
		{UsersearchItem.length==0?
		<>
		<div className="text-center py-3 no_items_row">
   <p className="not_found_text">No items found</p>
   <p className="not_found_text_sub">Come back soon! Or try to browse something for you on our marketplace</p>
   <div className="mt-3">
	<Button className="connect_btn">Browse Marketplace</Button>
   </div>
  </div>
 
		</>
		:
	<div className="col-12 col-md-10 col-lg-7 mx-auto">
	{
	UsersearchItem.map((item,index) => 	
	<div className="card activty_card my-3">
	<div className="card-body px-3">
	<div className="media follow_media activity_media_full">
	<div className="img_tick_div">
	<div className="img_prgo_re_1 mr-3">
		<Link to={item.customurl!=""?`/${item.customurl}`:`/user/${item.curraddress}`}>
	{item.image!=''?
	
	<img src={`${config.Back_URL}/images/${item._id}/${item.image}`} alt="User" className="img-fluid img_user_new" />
:
<div className="img-fluid img_user_new" >
	<Avatars item={item.curraddress}/>
	</div>}
	</Link>
	</div>

	</div>
	<div className="media-body flex_body">
	<div>
	<p className="mt-0 media_text mb-2">	<Link to={item.customurl!=""?`/${item.customurl}`:`/user/${item.curraddress}`}>
	{item.name!=""?item.name:item.curraddress}</Link></p>
	<p className="mt-0 media_num mt-0">{item.count!=0 && item.count + 'followers'} </p>

	</div>

	</div>
	</div>
	</div>
	</div>


	
	)}
			{/* <div className="card activty_card my-3">
			<div className="card-body px-3">
			<div className="media follow_media activity_media_full">
			<div className="img_tick_div">
			<div className="img_prgo_re_1 mr-3">
			<img src={require("../assets/images/collection_03.png")} alt="User" className="img-fluid img_user_new" />
			</div>

			</div>
			<div className="media-body flex_body">
			<div>
			<p className="mt-0 media_text mb-2">Teslaroid</p>
			<p className="mt-0 media_num mt-0">100 followers</p>

			</div>

			</div>
			</div>
			</div>
			</div> */}

		</div>}
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
	<Footer/>
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
	</div>
);
}
